import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { name, email, password, department, designation } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required fields.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'TEACHER',
        teacherProfile: {
          create: {
            department: department || 'Computer Science & AI',
            designation: designation || 'Instructor',
          },
        },
      },
      include: { teacherProfile: true },
    });

    const sessionPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'TEACHER' as const,
      teacherProfileId: user.teacherProfile?.id,
    };

    const token = signToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teacherProfileId: user.teacherProfile?.id,
      },
    });

    response.cookies.set('wls_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create teacher account.' },
      { status: 500 }
    );
  }
}
