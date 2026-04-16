import { NextResponse } from 'next/server';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { auth } from '@clerk/nextjs/server';

// GET /api/admin/users — admin dashboard: users list + aggregate stats
export const GET = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(new ApiResponse(401, 'Please login first', null), { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser || currentUser.role == 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), { status: 403 });
    }

    const [users, totalUsers, totalTrainees, totalMentors, pendingCourseApprovals] =
      await Promise.all([
        prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count(),
        prisma.user.count({ where: { role: 'TRAINEE' } }),
        prisma.user.count({ where: { role: 'MENTOR' } }),
        prisma.course.count({ where: { status: 'PENDING' } }),
      ]);

    const data = {
      users,
      stats: {
        totalUsers,
        totalTrainees,
        totalMentors,
      },
      pendingCourseApprovals,
    };

    return NextResponse.json(new ApiResponse(200, 'Users fetched successfully', data), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error('GET USERS ERROR:', error);

    if (error && typeof error === 'object' && 'code' in error) {
      return NextResponse.json(new ApiResponse(400, 'Database error occurred', null), {
        status: 400,
      });
    }

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', null), { status: 500 });
  }
};
