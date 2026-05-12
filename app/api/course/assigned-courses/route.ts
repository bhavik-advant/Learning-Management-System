import { NextRequest, NextResponse } from 'next/server';
import ApiResponse from '@/utils/api-response';
import getUserDetails from '@/lib/isAuth';
import { getTraineeMentorId, getUserById } from '@/services/repository/user';
import { getFormattedAssignedCourses } from '@/services/repository/course';
import { userRoleCheck } from '@/utils/checkUserRole';

export const GET = async (req: NextRequest) => {
  try {
    const user = await getUserDetails();

    const searchParams = req.nextUrl.searchParams;

    const userId = searchParams.get('userId');
    const LIMIT = 6;

    const page = Number(searchParams.get('page'));
    let skip = 0;
    if (page && page > 1) {
      skip = (page - 1) * LIMIT;
    }

    if (!userId) {
      return NextResponse.json(new ApiResponse(400, 'userId required', {}), { status: 400 });
    }

    const selectedUser = await getUserById(userId);

    if (!selectedUser) {
      return NextResponse.json(new ApiResponse(404, 'User not found', {}), { status: 404 });
    }

    if (selectedUser.id !== user.id) {
      if (userRoleCheck.isMentor(user.role) && userRoleCheck.isTrainee(selectedUser.role)) {
        const mentorId = await getTraineeMentorId(userId);

        if (mentorId !== user.id) {
          return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
        }
      }
    }

    const formattedCourses = await getFormattedAssignedCourses({
      userId,
      limit: LIMIT,
      skip,
      page,
    });

    return NextResponse.json(new ApiResponse(200, 'Assigned courses fetched', formattedCourses));
  } catch (error) {
    console.error(error);

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};
