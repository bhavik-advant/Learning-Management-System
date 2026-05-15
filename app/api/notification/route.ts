import getUserDetails from '@/lib/isAuth';
import {
  deleteAllNotifications,
  deleteNotifications,
  getNotificationCount,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationsAsRead,
} from '@/services/repository/notification';
import ApiResponse from '@/utils/api-response';
import sendError from '@/utils/send-error';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    const user = await getUserDetails();

    const searchParams = request.nextUrl.searchParams;

    const status = searchParams.get('status');
    const count = searchParams.get('count');

    if (count === 'true') {
      const unreadCount = await getNotificationCount(user.id);

      return NextResponse.json(
        new ApiResponse(200, 'Notification count fetched successfully', { unreadCount }),
        {
          status: 200,
        }
      );
    }

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
  } catch (error) {
    return sendError(error, 'Failed to fetch notifications');
  }
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

    return NextResponse.json(
      new ApiResponse(200, 'Notifications marked as read successfully', {}),
      {
        status: 200,
      }
    );
  } catch (error) {
    return sendError(error, 'Failed to mark notifications as read');
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
    return sendError(error, 'Failed to delete notifications');
  }
};
