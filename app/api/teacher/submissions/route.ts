import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    let whereClause = {};

    if (session.role === 'TEACHER') {
      if (!session.teacherProfileId) {
        // Fetch teacher profile if not in token
        const tp = await prisma.teacherProfile.findUnique({
          where: { userId: session.id },
        });
        if (!tp) {
          return NextResponse.json({ error: 'Teacher profile not found.' }, { status: 403 });
        }
        whereClause = { teacherId: tp.id };
      } else {
        whereClause = { teacherId: session.teacherProfileId };
      }
    } else if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden role access.' }, { status: 403 });
    }

    const submissions = await prisma.projectSubmission.findMany({
      where: whereClause,
      include: {
        teacher: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        academicRecord: true,
        evaluation: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, submissions });
  } catch (error) {
    console.error('Fetch teacher submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve submissions.' },
      { status: 500 }
    );
  }
}
