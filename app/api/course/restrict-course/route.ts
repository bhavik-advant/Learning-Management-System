import getUserDetails from '@/lib/isAuth';
import { restrictCoursesForTrainee } from '@/services/repository/course';
import { getTraineeMentorId } from '@/services/repository/user';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = async (req: NextRequest) => {
  try {
    const user = await getUserDetails();
    const { courseIds, userId, role } = await req.json();

    if (!userId || !courseIds?.length) {
      return NextResponse.json(new ApiResponse(400, 'Invalid payload', {}), { status: 400 });
    }

    if (user.role === 'MENTOR' && role === 'TRAINEE') {
      const mentorId = await getTraineeMentorId(userId);

      if (mentorId !== user.id) {
        return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
      }
    }

    const deleteEnrollment = await restrictCoursesForTrainee({ courseIds, userId });

    return NextResponse.json(
      new ApiResponse(200, 'Courses restricted successfully', deleteEnrollment)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};
