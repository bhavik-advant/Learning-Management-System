import { NextResponse } from 'next/server';
import ApiResponse from '@/utils/api-response';
import getUserDetails from '@/lib/isAuth';
import { getAllMentors } from '@/services/repository/user';

export const GET = async () => {
  try {
    const currentUser = await getUserDetails();

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), {
        status: 403,
      });
    }

    const mentors = await getAllMentors();

    return NextResponse.json(new ApiResponse(200, 'Mentors fetched successfully', mentors), {
      status: 200,
    });
  } catch (error) {
    console.error('GET MENTORS ERROR:', error);

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', null), { status: 500 });
  }
};
