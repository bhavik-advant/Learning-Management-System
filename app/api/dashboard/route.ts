import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { NextResponse } from 'next/server';
import { getAdminDashboardData } from '@/services/repository/user';

export const GET = async () => {
  try {
    const currentUser = await getUserDetails();

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), { status: 403 });
    }

    const {
      totalUsers,
      totalTrainees,
      totalMentors,
      pendingCourseApprovals,
      latestUsers,
      latestCoursesRaw,
    } = await getAdminDashboardData();

    const latestCourses = latestCoursesRaw.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      thumbnail: c.thumbnail?.url ?? '',
      author: c.author.username,
      image: c.author.image,
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

    return NextResponse.json(new ApiResponse(200, 'Dashboard data fetched successfully', data), {
      status: 200,
    });
  } catch (error) {
    console.error('ADMIN DASHBOARD ERROR:', error);

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', null), { status: 500 });
  }
};
