import getUserDetails from '@/lib/isAuth';
import { getUserNotifications } from '@/services/repository/notification';
import ApiResponse from '@/utils/api-response';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const user = await getUserDetails();

  const notifications = await getUserNotifications(user.id);

  return NextResponse.json(
    new ApiResponse(200, 'Notifications fetched successfully', notifications),
    {
      status: 200,
    }
  );
};
