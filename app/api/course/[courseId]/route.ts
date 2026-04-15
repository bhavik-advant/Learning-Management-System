import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  let user;
  try {
    user = await getUserDetails();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Please login first';

    return NextResponse.json(new ApiResponse(401, message, {}), { status: 401 });
  }

  const { courseId } = await params;

  if (!courseId) {
    return NextResponse.json(new ApiResponse(401, 'Please Provide CourseId', {}), {
      status: 401,
    });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      thumbnail: {
        select: {
          url: true,
        },
      },
      modules: {
        orderBy: {
          order: 'asc',
        },
        select: {
          id: true,
          title: true,
          lessons: {
            orderBy: {
              order: 'asc',
            },
            select: {
              id: true,
              title: true,
              videoUrl: true,
              videoFile: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return NextResponse.json(new ApiResponse(401, 'Failed to fetch Coursr', {}), {
      status: 401,
    });
  }

  const formattedCourse = {
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail?.url || null,
    status: course.status,
    modules: course.modules.map(module => ({
      id: module.id,
      title: module.title,
      lessons: module.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        url: lesson.videoFile?.url || lesson.videoUrl || null,
      })),
    })),
  };

  return NextResponse.json(new ApiResponse(200, 'Course Fetched SuccessFully', formattedCourse), {
    status: 200,
  });
};
