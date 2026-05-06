import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  try {
    const user = await getUserDetails();

    const { courseId } = await params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(new ApiResponse(404, 'Course not found', null), { status: 404 });
    }

    if (user.role !== 'ADMIN' && course.authorId !== user.id) {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), { status: 403 });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        status: 'INACTIVE',
      },
    });

    return NextResponse.json(
      new ApiResponse(200, 'Course marked as inactive successfully', updatedCourse),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(new ApiResponse(500, 'Internal server error', null), { status: 500 });
  }
};
