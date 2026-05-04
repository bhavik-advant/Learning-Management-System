import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma-client';
import ApiResponse from '@/utils/api-response';
import getUserDetails from '@/lib/isAuth';

export const GET = async (req: NextRequest) => {
  try {
    const currentUser = await getUserDetails();
    const searchParams = req.nextUrl.searchParams;

    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    const limit = Number(searchParams.get('limit')) || 3;
    const page = Number(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json(new ApiResponse(400, 'userId required', {}), { status: 400 });
    }

    if (currentUser.role === 'MENTOR' && role === 'TRAINEE') {
      const trainee = await prisma.user.findUnique({
        where: { id: userId },
        select: { mentorId: true },
      });

      if (trainee?.mentorId !== currentUser.id) {
        return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
      }
    }

    const totalCourses = await prisma.course.count({
      where: {
        enrollments: {
          some: {
            studentId: userId,
          },
        },
      },
    });

    const courses = await prisma.course.findMany({
      where: {
        enrollments: {
          some: {
            studentId: userId,
          },
        },
      },
      include: {
        thumbnail: { select: { url: true } },
        author: { select: { username: true } },
        modules: {
          select: {
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      status: course.status,
      thumbnail: course.thumbnail?.url,
      author: course.author?.username,
      modulesCount: course.modules.length,
      lessons: course.modules.reduce((acc, m) => acc + m._count.lessons, 0),
    }));

    return NextResponse.json(
      new ApiResponse(200, 'Assigned courses fetched', {
        courses: formattedCourses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCourses / limit),
          hasNextPage: page * limit < totalCourses,
          hasPreviousPage: page > 1,
        },
      })
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};
