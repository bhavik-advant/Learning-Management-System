import { NextRequest, NextResponse } from 'next/server';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { auth } from '@clerk/nextjs/server';

// GET /api/admin/users/:id — fetch single user details for admin
export const GET = async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(new ApiResponse(401, 'Please login first', null), { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!currentUser || currentUser.role === 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(new ApiResponse(400, 'User ID is required', null), { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        image: true,
        username: true,
        email: true,
        role: true,
        mentorId: true,
        mentor: {
          select: {
            username: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(new ApiResponse(404, 'User not found', null), { status: 404 });
    }

    const payload = {
      ...user,
      mentorName: user.mentor?.username ?? null,
    };

    return NextResponse.json(new ApiResponse(200, 'User fetched successfully', payload), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error('GET USER DETAILS ERROR:', error);

    if (error && typeof error === 'object' && 'code' in error) {
      return NextResponse.json(new ApiResponse(400, 'Database error occurred', null), {
        status: 400,
      });
    }

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', null), { status: 500 });
  }
};

// PATCH /api/admin/users/:id — admin can update user details
export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(new ApiResponse(401, 'Please login first', null), { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(new ApiResponse(400, 'User ID is required', null), { status: 400 });
    }

    const body = await req.json();
    const {
      username,
      email,
      image,
      role,
      mentorId,
    }: {
      username?: string;
      email?: string;
      image?: string;
      role?: 'ADMIN' | 'MENTOR' | 'TRAINEE';
      mentorId?: string | null;
    } = body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json(new ApiResponse(404, 'User not found', null), { status: 404 });
    }

    const nextRole = role ?? existingUser.role;
    let nextMentorId = mentorId;

    if (nextRole !== 'TRAINEE') {
      nextMentorId = null;
    } else if (nextMentorId) {
      const mentor = await prisma.user.findUnique({
        where: { id: nextMentorId },
      });
      if (!mentor || mentor.role !== 'MENTOR') {
        return NextResponse.json(new ApiResponse(400, 'Invalid mentor selected', null), {
          status: 400,
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username: username ?? existingUser.username,
        email: email ?? existingUser.email,
        image: image ?? existingUser.image,
        role: nextRole,
        mentorId: nextRole === 'TRAINEE' ? nextMentorId ?? existingUser.mentorId : undefined,
      },
    });

    const mentor =
      updatedUser.mentorId && updatedUser.role === 'TRAINEE'
        ? await prisma.user.findUnique({
            where: { id: updatedUser.mentorId },
            select: { username: true },
          })
        : null;

    const payload = {
      ...updatedUser,
      mentorName: mentor?.username ?? null,
    };

    return NextResponse.json(new ApiResponse(200, 'User updated successfully', payload), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error('UPDATE USER DETAILS ERROR:', error);

    if (error && typeof error === 'object' && 'code' in error) {
      return NextResponse.json(new ApiResponse(400, 'Database error occurred', null), {
        status: 400,
      });
    }

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', null), { status: 500 });
  }
};
