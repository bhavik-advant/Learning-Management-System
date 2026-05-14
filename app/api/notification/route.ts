import getUserDetails from '@/lib/isAuth';
import {
  deleteAllNotifications,
  deleteNotifications,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationsAsRead,
} from '@/services/repository/notification';
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

export const PATCH = async (request: NextRequest) => {
  try {
    const user = await getUserDetails();

    const searchParams = request.nextUrl.searchParams;

    const markReadAll = searchParams.get('markReadAll') || 'false';

    if (markReadAll === 'true') {
      await markAllNotificationsAsRead(user.id);

      return NextResponse.json(
        new ApiResponse(200, 'All notifications marked as read successfully', {}),
        {
          status: 200,
        }
      );
    }

    const body = await request.json();

    const { notificationIds }: { notificationIds: string[] } = body;

    if (!notificationIds || notificationIds.length === 0) {
      return NextResponse.json(new ApiResponse(400, 'Invalid request', {}), { status: 400 });
    }

    await markNotificationsAsRead({ notificationIds, userId: user.id });

    return NextResponse.json(new ApiResponse(200, 'Notifications deleted successfully', {}), {
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(new ApiResponse(500, errorMessage, {}), { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const user = await getUserDetails();

    const searchParams = request.nextUrl.searchParams;

    const deleteAll = searchParams.get('deleteAll') || 'false';

    if (deleteAll === 'true') {
      await deleteAllNotifications(user.id);

      return NextResponse.json(new ApiResponse(200, 'All notifications deleted successfully', {}), {
        status: 200,
      });
    }

    const body = await request.json();

    const { notificationIds }: { notificationIds: string[] } = body;

    if (!notificationIds || notificationIds.length === 0) {
      return NextResponse.json(new ApiResponse(400, 'Invalid request', {}), { status: 400 });
    }

    await deleteNotifications({ notificationIds, userId: user.id });

    return NextResponse.json(new ApiResponse(200, 'Notifications deleted successfully', {}), {
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(new ApiResponse(500, errorMessage, {}), { status: 500 });
  }
};
