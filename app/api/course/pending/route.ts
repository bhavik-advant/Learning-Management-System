import { NextResponse } from 'next/server';
import ApiResponse from '@/utils/api-response';
import getUserDetails from '@/lib/isAuth';
import { getPendingCourses } from '@/services/apis/courses';

export const GET = async () => {
  try {
    const user = await getUserDetails();

    if (user.role !== 'ADMIN') {
      return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
    }

    const courses = await getPendingCourses();

    return NextResponse.json(
      new ApiResponse(200, 'Pending courses fetched successfully', courses),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};
