import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserDetails();

    if (user.role !== 'MENTOR') {
      return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
    }

    const body = await req.json();

    const { courseIds, traineeId }: { courseIds: string[]; traineeId: string } = body;

    const userDetails = await prisma.user.findUnique({
      where: { id: traineeId },
      select: {
        mentorId: true,
      },
    });

    if (userDetails?.mentorId != user.id) {
      return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
    }

    await Promise.all(
      courseIds.map(courseId => {
        return prisma.enrollment.create({
          data: {
            courseId,
            studentId: traineeId,
          },
        });
      })
    );

    return NextResponse.json(new ApiResponse(201, 'Courses assigned successfully', {}), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(new ApiResponse(401, 'Internal server error', {}), {
      status: 401,
    });
  }
};
