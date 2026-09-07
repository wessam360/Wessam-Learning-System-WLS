import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'TEACHER' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { submissionId, type } = body;

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required.' }, { status: 400 });
    }

    // Verify submission existence
    const submission = await prisma.projectSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
    }

    // Data isolation check for teachers
    if (session.role === 'TEACHER') {
      const tp = session.teacherProfileId
        ? session.teacherProfileId
        : (await prisma.teacherProfile.findUnique({ where: { userId: session.id } }))?.id;

      if (submission.teacherId !== tp) {
        return NextResponse.json(
          { error: 'You are not authorized to grade another instructor’s assigned student.' },
          { status: 403 }
        );
      }
    }

    if (type === 'INLINE_METRICS') {
      const { participation, attendance, quizzes, assignments } = body;

      const record = await prisma.academicRecord.upsert({
        where: { submissionId },
        update: {
          participation: Number(participation) || 0,
          attendance: Number(attendance) || 0,
          quizzes: Number(quizzes) || 0,
          assignments: Number(assignments) || 0,
        },
        create: {
          submissionId,
          participation: Number(participation) || 0,
          attendance: Number(attendance) || 0,
          quizzes: Number(quizzes) || 0,
          assignments: Number(assignments) || 0,
        },
      });

      return NextResponse.json({ success: true, record });
    } else if (type === 'RUBRIC_EVALUATION') {
      const {
        synopsisScore,
        uiUxScore,
        innovationScore,
        reportingScore,
        outcomesScore,
        groupScore,
        presentationScore,
        feedback,
      } = body;

      const s1 = Math.min(10, Math.max(0, Number(synopsisScore) || 0));
      const s2 = Math.min(20, Math.max(0, Number(uiUxScore) || 0));
      const s3 = Math.min(30, Math.max(0, Number(innovationScore) || 0));
      const s4 = Math.min(10, Math.max(0, Number(reportingScore) || 0));
      const s5 = Math.min(10, Math.max(0, Number(outcomesScore) || 0));
      const s6 = Math.min(10, Math.max(0, Number(groupScore) || 0));
      const s7 = Math.min(10, Math.max(0, Number(presentationScore) || 0));

      const totalScore = s1 + s2 + s3 + s4 + s5 + s6 + s7;

      const evaluation = await prisma.projectEvaluation.upsert({
        where: { submissionId },
        update: {
          synopsisScore: s1,
          uiUxScore: s2,
          innovationScore: s3,
          reportingScore: s4,
          outcomesScore: s5,
          groupScore: s6,
          presentationScore: s7,
          totalScore,
          feedback: feedback || '',
          evaluatorId: session.id,
        },
        create: {
          submissionId,
          synopsisScore: s1,
          uiUxScore: s2,
          innovationScore: s3,
          reportingScore: s4,
          outcomesScore: s5,
          groupScore: s6,
          presentationScore: s7,
          totalScore,
          feedback: feedback || '',
          evaluatorId: session.id,
        },
      });

      // Update submission status to EVALUATED
      await prisma.projectSubmission.update({
        where: { id: submissionId },
        data: { status: 'EVALUATED' },
      });

      return NextResponse.json({ success: true, evaluation });
    } else {
      return NextResponse.json({ error: 'Invalid grading type.' }, { status: 400 });
    }
  } catch (error) {
    console.error('Grading error:', error);
    return NextResponse.json(
      { error: 'Failed to update grades.' },
      { status: 500 }
    );
  }
}
