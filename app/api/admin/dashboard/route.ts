import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

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

    const include = {
      author: { select: { username: true } },
      thumbnail: { select: { url: true } },
      _count: {
        select: {
          modules: true,
        },
      },
    } as const;

    const [
      totalUsers,
      totalTrainees,
      totalMentors,
      pendingCourseApprovals,
      latestUsers,
      latestCoursesRaw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'TRAINEE' } }),
      prisma.user.count({ where: { role: 'MENTOR' } }),
      prisma.course.count({ where: { status: 'PENDING' } }),

      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),

      prisma.course.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        include,
      }),
    ]);

    const latestCourses = latestCoursesRaw.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      thumbnail: c.thumbnail?.url ?? '',
      author: c.author.username,
      status: c.status,
      authorId: c.authorId,
      thumbnailId: c.thumbnailId,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      modulesCount: c._count.modules,
    }));

    const data = {
      stats: {
        totalUsers,
        totalTrainees,
        totalMentors,
      },
      pendingCourseApprovals,
      latestUsers,
      latestCourses,
    };
    // console.log(data);

    return NextResponse.json(new ApiResponse(200, 'Dashboard data fetched successfully', data), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error('ADMIN DASHBOARD ERROR:', error);

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', null), { status: 500 });
  }
};
