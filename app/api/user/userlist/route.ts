import { NextResponse } from 'next/server';
import ApiResponse from '@/utils/api-response';
import getUserDetails from '@/lib/isAuth';
import { getUsers } from '@/services/repository/user';

export const GET = async () => {
  try {
    const currentUser = await getUserDetails();

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), { status: 403 });
    }

    const users = await getUsers();

    return NextResponse.json(new ApiResponse(200, 'Users fetched successfully', users), {
      status: 200,
    });
  } catch (error) {
    console.error('GET USERS ERROR:', error);

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', null), { status: 500 });
  }
};
