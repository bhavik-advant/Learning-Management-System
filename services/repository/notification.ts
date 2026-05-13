import { prisma } from '@/utils/prisma-client';

export const createNotification = async ({
  userId,
  message,
  link,
}: {
  userId: string;
  message: string;
  link?: string;
}) => {
  return prisma.notification.create({
    data: {
      userId,
      message,
      link,
    },
  });
};

export const getUserNotifications = async ({
  userId,
  isRead,
}: {
  userId: string;
  isRead?: boolean;
}) => {
  const [notifications, unreadCount, readCount, totalCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId, isRead },
      orderBy: { createdAt: 'desc' },
    }),

    prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    }),

    prisma.notification.count({
      where: {
        userId,
        isRead: true,
      },
    }),

    prisma.notification.count({
      where: {
        userId,
      },
    }),
  ]);

  return {
    notifications,
    meta: {
      unreadCount,
      readCount,
      totalCount,
    },
  };
};
