import getUserDetails from '@/lib/isAuth';
import { assignCoursesToUser } from '@/services/repository/course';
import { getTraineeMentorId } from '@/services/repository/user';
import ApiResponse from '@/utils/api-response';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserDetails();

    const body = await req.json();

    const {
      courseIds,
      userId,
      role,
    }: { courseIds: string[]; userId: string; role: 'TRAINEE' | 'MENTOR' } = body;

    if (!userId || !role || courseIds.length === 0) {
      return NextResponse.json(new ApiResponse(400, 'Invalid payload', {}), { status: 400 });
    }

    if (user.role === 'MENTOR') {
      if (role !== 'TRAINEE') {
        return NextResponse.json(new ApiResponse(401, 'Mentor can assign only to trainees', {}), {
          status: 401,
        });
      }

      const mentorId = await getTraineeMentorId(userId);

      if (mentorId !== user.id) {
        return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
      }
    }

    if (user.role !== 'ADMIN' && user.role !== 'MENTOR') {
      return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
    }

    const assign = await assignCoursesToUser({
      courseIds,
      userId,
    });

    return NextResponse.json(new ApiResponse(201, 'Courses assigned successfully', assign), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(new ApiResponse(500, 'Internal server error', {}), {
      status: 500,
    });
  }
};
