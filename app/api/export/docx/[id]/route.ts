import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { generateWordEvaluationReport } from '@/lib/export-docx';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const resolvedParams = await params;
    const submissionId = resolvedParams.id;

    const submission = await prisma.projectSubmission.findUnique({
      where: { id: submissionId },
      include: {
        teacher: {
          include: {
            user: { select: { name: true } },
          },
        },
        evaluation: {
          include: {
            evaluator: { select: { name: true } },
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
    }

    const evaluation = submission.evaluation;
    if (!evaluation) {
      return NextResponse.json(
        { error: 'This project has not been evaluated yet.' },
        { status: 400 }
      );
    }

    const wordBuffer = await generateWordEvaluationReport({
      studentName: submission.studentName,
      studentIdCode: submission.studentIdCode,
      course: submission.course,
      schedule: submission.schedule,
      gender: submission.gender,
      projectName: submission.projectName,
      projectUrl: submission.projectUrl,
      portfolioUrl: submission.portfolioUrl,
      teacherName: submission.teacher.user.name,
      evaluatorName: evaluation.evaluator.name,
      synopsisScore: evaluation.synopsisScore,
      uiUxScore: evaluation.uiUxScore,
      innovationScore: evaluation.innovationScore,
      reportingScore: evaluation.reportingScore,
      outcomesScore: evaluation.outcomesScore,
      groupScore: evaluation.groupScore,
      presentationScore: evaluation.presentationScore,
      totalScore: evaluation.totalScore,
      feedback: evaluation.feedback || '',
      createdAt: evaluation.createdAt,
    });

    const filename = `WLS_Evaluation_${submission.studentIdCode.replace(/[^a-zA-Z0-9-]/g, '_')}.docx`;

    return new Response(new Uint8Array(wordBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': wordBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Docx export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Word assessment report.' },
      { status: 500 }
    );
  }
}
