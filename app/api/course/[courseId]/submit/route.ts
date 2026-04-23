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

    const availabeCourse = await prisma.course.findUnique({ where: { id: courseId } });

    if (user.role != 'ADMIN' && availabeCourse?.authorId != user.id) {
      return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        status: 'PENDING',
      },
    });

    return NextResponse.json(new ApiResponse(201, 'Course updated SuccessFully', updatedCourse), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(new ApiResponse(401, 'Internal Server Error', {}), { status: 401 });
  }
};
