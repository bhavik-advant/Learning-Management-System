import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const user = await getUserDetails();

    if (user.role !== 'MENTOR') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorized', {}), { status: 403 });
    }

    const latestCourses = await prisma.course.findMany({
      where: {
        authorId: user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: {
          select: {
            url: true,
          },
        },
        status: true,
        author: {
          select: {
            username: true,
          },
        },
        authorId: true,
        thumbnailId: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            modules: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });

    const formattedCourses = latestCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail?.url || null,
      author: course.author?.username || null,
      authorId: course.authorId,
      status: course.status,
      thumbnailId: course.thumbnailId,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      modulesCount: course._count.modules,
    }));

    const studentCount = await prisma.user.count({
      where: { mentorId: user.id },
    });

    const dashboardData = {
      courses: formattedCourses,
      stats: {
        courses: latestCourses.length,
        students: studentCount,
        pendingReviews: 0,
      },
    };

    return NextResponse.json(
      new ApiResponse(200, 'Dashboard data fetched successfully', dashboardData),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching dashboard data:', error);

    return NextResponse.json(
      new ApiResponse(500, 'An unexpected error occurred while fetching dashboard data.', {}),
      { status: 500 }
    );
  }
};
