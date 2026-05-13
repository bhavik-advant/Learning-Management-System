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

export const getUserNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}
