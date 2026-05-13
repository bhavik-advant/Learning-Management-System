import getUserDetails from '@/lib/isAuth';
import { getUserNotifications } from '@/services/repository/notification';
import ApiResponse from '@/utils/api-response';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const user = await getUserDetails();

  const searchParams = request.nextUrl.searchParams;

  const status = searchParams.get('status');

  let isRead: boolean | undefined = undefined;

  if (status === 'read') {
    isRead = true;
  }

  if (status === 'unread') {
    isRead = false;
  }

  const notifications = await getUserNotifications({
    userId: user.id,
    isRead,
  });

  return NextResponse.json(
    new ApiResponse(200, 'Notifications fetched successfully', notifications),
    {
      status: 200,
    }
  );
};
