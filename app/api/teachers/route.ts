import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const teachers = await prisma.teacherProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    const formatted = teachers.map((t) => ({
      id: t.id,
      name: t.user.name,
      email: t.user.email,
      department: t.department,
      designation: t.designation,
    }));

    return NextResponse.json({ teachers: formatted });
  } catch (error) {
    console.error('Fetch teachers error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve registered teachers list.' },
      { status: 500 }
    );
  }
}
