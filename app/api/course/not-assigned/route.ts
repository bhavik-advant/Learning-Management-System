import { NextRequest, NextResponse } from 'next/server';
import ApiResponse from '@/utils/api-response';
import getUserDetails from '@/lib/isAuth';
import { getTraineeMentorId } from '@/services/repository/user';
import { getAssignableCourses, getAssignableCoursesCount } from '@/services/repository/course';

export const GET = async (req: NextRequest) => {
  try {
    const user = await getUserDetails();
    const searchParams = req.nextUrl.searchParams;

    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    const limit = Number(searchParams.get('limit')) || 3;
    const page = Number(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json(new ApiResponse(400, 'userId required', {}), { status: 400 });
    }

    if (user.role === 'MENTOR' && role === 'TRAINEE') {
      const mentorId = await getTraineeMentorId(userId);

      if (mentorId !== user.id) {
        return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
      }
    }

    const totalCourses = await getAssignableCoursesCount({ userId });

    const formattedCourses = await getAssignableCourses({ userId, limit, skip });

    return NextResponse.json(
      new ApiResponse(200, 'Assignable courses fetched', {
        courses: formattedCourses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCourses / limit),
          hasNextPage: page * limit < totalCourses,
          hasPreviousPage: page > 1,
        },
      })
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};
