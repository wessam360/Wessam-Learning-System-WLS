import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      studentCourse,
      daySchedule,
      studentName,
      studentIdCode,
      gender,
      finalProjectName,
      projectUrl,
      portfolioUrl,
      teacherId,
    } = body;

    // Validation
    if (
      !studentCourse ||
      !daySchedule ||
      !studentName ||
      !studentIdCode ||
      !gender ||
      !finalProjectName ||
      !projectUrl ||
      !portfolioUrl ||
      !teacherId
    ) {
      return NextResponse.json(
        { error: 'All fields are required for project submission.' },
        { status: 400 }
      );
    }

    // Verify teacher exists
    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: 'Selected teacher was not found in the registry.' },
        { status: 404 }
      );
    }

    // Create submission with initialized academic record
    const submission = await prisma.projectSubmission.create({
      data: {
        studentIdCode: studentIdCode.trim(),
        studentName: studentName.trim(),
        course: studentCourse.trim(),
        schedule: daySchedule,
        gender: gender,
        projectName: finalProjectName.trim(),
        projectUrl: projectUrl.trim(),
        portfolioUrl: portfolioUrl.trim(),
        teacherId: teacherId,
        status: 'PENDING',
        academicRecord: {
          create: {
            participation: 0,
            attendance: 0,
            quizzes: 0,
            assignments: 0,
          },
        },
      },
      include: {
        teacher: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Project submission recorded successfully.',
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Submission creation error:', error);
    return NextResponse.json(
      { error: 'Failed to process project submission.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const totalCount = await prisma.projectSubmission.count();
    const evaluatedCount = await prisma.projectSubmission.count({
      where: { status: 'EVALUATED' },
    });
    return NextResponse.json({ totalCount, evaluatedCount });
  } catch {
    return NextResponse.json({ totalCount: 0, evaluatedCount: 0 });
  }
}
