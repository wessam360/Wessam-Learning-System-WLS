import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { generateExcelMarksheet, MarksheetRecord } from '@/lib/export-excel';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'TEACHER' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let whereClause = {};
    if (session.role === 'TEACHER') {
      const tp = session.teacherProfileId
        ? session.teacherProfileId
        : (await prisma.teacherProfile.findUnique({ where: { userId: session.id } }))?.id;
      if (tp) {
        whereClause = { teacherId: tp };
      }
    }

    const submissions = await prisma.projectSubmission.findMany({
      where: whereClause,
      include: {
        academicRecord: true,
        evaluation: true,
      },
      orderBy: { studentIdCode: 'asc' },
    });

    const records: MarksheetRecord[] = submissions.map((sub) => {
      const ar = sub.academicRecord;
      const ev = sub.evaluation;

      const participation = ar?.participation || 0;
      const attendance = ar?.attendance || 0;
      const quizzes = ar?.quizzes || 0;
      const assignments = ar?.assignments || 0;

      const synopsisScore = ev?.synopsisScore || 0;
      const uiUxScore = ev?.uiUxScore || 0;
      const innovationScore = ev?.innovationScore || 0;
      const reportingScore = ev?.reportingScore || 0;
      const outcomesScore = ev?.outcomesScore || 0;
      const groupScore = ev?.groupScore || 0;
      const presentationScore = ev?.presentationScore || 0;
      const totalScore = ev?.totalScore || 0;

      const grandTotalScore =
        participation + attendance + quizzes + assignments + totalScore;

      return {
        studentIdCode: sub.studentIdCode,
        studentName: sub.studentName,
        course: sub.course,
        schedule: sub.schedule,
        gender: sub.gender,
        projectName: sub.projectName,
        projectUrl: sub.projectUrl,
        portfolioUrl: sub.portfolioUrl,
        participation,
        attendance,
        quizzes,
        assignments,
        synopsisScore,
        uiUxScore,
        innovationScore,
        reportingScore,
        outcomesScore,
        groupScore,
        presentationScore,
        totalScore,
        grandTotalScore,
        status: sub.status,
      };
    });

    const excelBuffer = await generateExcelMarksheet(session.name, records);
    const filename = `WLS_Consolidated_Results_${new Date().toISOString().split('T')[0]}.xlsx`;

    return new Response(new Uint8Array(excelBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Excel export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel marksheet.' },
      { status: 500 }
    );
  }
}
