import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string; courseId: string }> }
) => {
  try {
    const user = await getUserDetails();

    if (user.role === 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

    const { moduleId, courseId } = await params;

    const courseDetails = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        authorId: true,
      },
    });

    if (!courseDetails) {
      return NextResponse.json(new ApiResponse(403, 'Course Not Found', {}), { status: 403 });
    }

    if (courseDetails?.authorId !== user.id && user.role == 'ADMIN') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

    const moduleDetails = await prisma.module.findUnique({
      where: { id: moduleId },
      select: {
        title: true,
      },
    });

    if (!moduleDetails) {
      return NextResponse.json(new ApiResponse(403, 'Module Not Found', {}), { status: 403 });
    }

    const body = await req.json();

    const { title, content }: { title: string; content: string } = body;

    if (title.trim() == '' && content.trim() == '') {
      return NextResponse.json(new ApiResponse(403, 'Please Provide all Details', {}), {
        status: 403,
      });
    }

    const lastLesson = await prisma.lesson.findFirst({
      where: {
        moduleId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const newLesson = await prisma.lesson.create({
      data: {
        content,
        title,
        order: lastLesson?.order ? lastLesson.order + 1 : 1,
        moduleId,
      },
    });

    return NextResponse.json(new ApiResponse(201, 'Lesson Uploaded Successfully', newLesson), {
      status: 201,
    });
  } catch (error) {
    console.error('Failed To Add Lesson', error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};
