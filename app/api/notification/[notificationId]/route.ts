import getUserDetails from '@/lib/isAuth';
import { getNotificationById, markNotificationAsRead } from '@/services/repository/notification';
import ApiResponse from '@/utils/api-response';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) => {
  const user = await getUserDetails();

  const { notificationId } = await params;

  const notification = await getNotificationById(notificationId);

  if (!notification) {
    return NextResponse.json(new ApiResponse(404, 'Notification not found', {}), { status: 404 });
  }

  if (notification.userId !== user.id) {
    return NextResponse.json(new ApiResponse(403, 'Unauthorized', {}), { status: 403 });
  }

  await markNotificationAsRead(notificationId);

  return NextResponse.json(new ApiResponse(200, 'Notification marked as read', {}), {
    status: 200,
  });
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) => {
  const user = await getUserDetails();

  const { notificationId } = await params;

  const notification = await getNotificationById(notificationId);

  if (!notification) {
    return NextResponse.json(new ApiResponse(404, 'Notification not found', {}), { status: 404 });
  }

  if (notification.userId !== user.id) {
    return NextResponse.json(new ApiResponse(403, 'Unauthorized', {}), { status: 403 });
  }

  await markNotificationAsRead(notificationId);

  return NextResponse.json(new ApiResponse(200, 'Notification marked as read', {}), {
    status: 200,
  });
};
