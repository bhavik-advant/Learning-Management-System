import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma-client';
import ApiResponse from '@/utils/api-response';
import getUserDetails from '@/lib/isAuth';

export const GET = async (req: NextRequest) => {
  try {
    const user = await getUserDetails();

    const searchParams = req.nextUrl.searchParams;

    const limit = Number(searchParams.get('limit')) || 3;
    const page = Number(searchParams.get('page')) || 1;
    const traineeId = searchParams.get('traineeId');
    const skip = (page - 1) * limit;

    if (!traineeId) {
      return NextResponse.json(new ApiResponse(401, 'Trainee Id is requires', {}), { status: 401 });
    }

    const userDetails = await prisma.user.findUnique({
      where: { id: traineeId },
      select: {
        mentorId: true,
      },
    });

    if (userDetails?.mentorId != user.id) {
      return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
    }

    const totalCourses = await prisma.course.count({
      where: {
        status: 'APPROVED',
        enrollments: {
          none: {
            studentId: traineeId,
          },
        },
      },
    });

    const courses = await prisma.course.findMany({
      where: {
        status: 'APPROVED',
        enrollments: {
          none: {
            studentId: traineeId,
          },
        },
      },
      include: {
        thumbnail: {
          select: {
            url: true,
          },
        },
        author: {
          select: {
            username: true,
          },
        },
        modules: {
          select: {
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: skip,
      take: limit,
    });

    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      status: 'APPROVED',
      thumbnail: course.thumbnail?.url,
      author: course.author?.username,
      submittedAt: course.createdAt,
      modulesCount: course.modules.length,
      lessons: course.modules.reduce((acc, module) => acc + module._count.lessons, 0),
    }));

    const totalPages = Math.ceil(totalCourses / limit);

    const paginationData = {
      courses: formattedCourses,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: totalCourses,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    return NextResponse.json(
      new ApiResponse(200, 'Approved courses fetched successfully', paginationData),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};
