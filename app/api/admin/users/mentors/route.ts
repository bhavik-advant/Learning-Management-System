import { NextResponse } from 'next/server';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { auth } from '@clerk/nextjs/server';

// GET /api/admin/users/mentors — list mentors for admin assignment dropdown
export const GET = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(new ApiResponse(401, 'Please login first', null), { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser || currentUser.role === 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), { status: 403 });
    }

    const mentors = await prisma.user.findMany({
      where: { role: 'MENTOR' },
      orderBy: { username: 'asc' },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return NextResponse.json(new ApiResponse(200, 'Mentors fetched successfully', mentors), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error('GET MENTORS ERROR:', error);

    if (error && typeof error === 'object' && 'code' in error) {
      return NextResponse.json(new ApiResponse(400, 'Database error occurred', null), {
        status: 400,
      });
    }

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', null), { status: 500 });
  }
};
