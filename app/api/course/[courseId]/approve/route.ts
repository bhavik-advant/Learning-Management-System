import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma-client';
import ApiResponse from '@/utils/api-response';
import getUserDetails from '@/lib/isAuth';

export const PATCH = async (
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) => {
  try {
    const user = await getUserDetails();

    if (user.role != 'ADMIN') {
      return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
    }

    const { courseId } = await context.params;

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        status: 'APPROVED',
      },
    });

    return NextResponse.json(new ApiResponse(200, 'Course approved successfully', updatedCourse));
  } catch (error) {
    console.error('APPROVE COURSE ERROR:', error);

    return NextResponse.json(new ApiResponse(500, 'Failed to approve course', {}), { status: 500 });
  }
};
