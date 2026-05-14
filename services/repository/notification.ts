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

export const markNotificationAsRead = async (notificationId: string) => {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

export const markAllNotificationsAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

export const markNotificationsAsRead = async ({
  notificationIds,
  userId,
}: {
  notificationIds: string[];
  userId: string;
}) => {
  return Promise.all(
    notificationIds.map(async id => {
      const notification = await prisma.notification.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      if (notification.userId !== userId) {
        throw new Error("You are not authorized to delete others' notifications");
      }

      return prisma.notification.update({
        where: {
          id,
          userId,
        },
        data: {
          isRead: true,
        },
      });
    })
  );
};

export const getNotificationById = async (notificationId: string) => {
  return prisma.notification.findUnique({
    where: { id: notificationId },
  });
};

export const deleteNotification = async (notificationId: string) => {
  return prisma.notification.delete({
    where: { id: notificationId },
  });
};

export const deleteAllNotifications = async (userId: string) => {
  return prisma.notification.deleteMany({
    where: { userId },
  });
};

export const deleteNotifications = async ({
  notificationIds,
  userId,
}: {
  notificationIds: string[];
  userId: string;
}) => {
  return Promise.all(
    notificationIds.map(async id => {
      const notification = await prisma.notification.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      if (notification.userId !== userId) {
        throw new Error("You are not authorized to delete others' notifications");
      }

      return prisma.notification.deleteMany({
        where: {
          id,
          userId,
        },
      });
    })
  );
};
