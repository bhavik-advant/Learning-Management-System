import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma-client';
import ApiResponse from '@/utils/api-response';

export const GET = async () => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: 'PENDING',
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
    });

    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      image: course.thumbnail?.url,
      mentor: course.author?.username,
      submittedAt: course.createdAt,
      modules: course.modules.length,
      lessons: course.modules.reduce((acc, module) => acc + module._count.lessons, 0),
    }));
    return NextResponse.json(
      new ApiResponse(200, 'Pending courses fetched successfully', formattedCourses),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};
