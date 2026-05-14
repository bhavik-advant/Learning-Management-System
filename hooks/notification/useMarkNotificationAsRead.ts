import { markNotificationAsRead } from '@/services/apis/notification';
import type { NotificationsData } from '@/types/types';
import queryClient from '@/utils/query-client';
import { useMutation } from '@tanstack/react-query';

export const useMarkNotificationAsRead = ({ notificationId }: { notificationId: string }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.setQueriesData(
        { queryKey: ['notifications'] },
        (oldData: NotificationsData | undefined) => {
          if (!oldData) return oldData;

          const updatedNotifications = oldData.notifications.map(notification => {
            if (notification.id === notificationId) {
              return { ...notification, isRead: true };
            }
            return notification;
          });

          const unreadCount = oldData.meta.unreadCount - 1;
          const readCount = oldData.meta.readCount + 1;

          return {
            ...oldData,
            notifications: updatedNotifications,
            meta: {
              unreadCount,
              readCount,
              totalCount: updatedNotifications.length,
            },
          };
        }
      );
    },
  });

  return {
    markAsRead: mutateAsync,
    isPending,
  };
};
