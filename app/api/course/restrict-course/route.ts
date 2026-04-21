import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = async (req: NextRequest) => {
  try {
    const user = await getUserDetails();

    if (user.role == 'TRAINEE') {
      return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
    }

    const body = await req.json();

    const { courseIds, traineeId }: { courseIds: string[]; traineeId: string } = body;

    const newEnrollment = await Promise.all(
      courseIds.map(courseId => {
        return prisma.enrollment.deleteMany({
          where: {
            studentId: traineeId,
            courseId: courseId,
          },
        });
      })
    );

    return NextResponse.json(new ApiResponse(201, 'Courses restricted successfully', {}), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json(new ApiResponse(401, errorMessage || 'Error', {}), {
      status: 401,
    });
  }
};
