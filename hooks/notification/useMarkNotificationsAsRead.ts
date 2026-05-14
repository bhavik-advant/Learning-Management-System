import { markAllNotificationsAsRead } from '@/services/apis/notification';
import type { NotificationsData } from '@/types/types';
import queryClient from '@/utils/query-client';
import { useMutation } from '@tanstack/react-query';

export const useMarkNotificationsAsRead = ({ notificationIds }: { notificationIds: string[] }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ markReadAll }: { markReadAll?: boolean }) =>
      markAllNotificationsAsRead({ notificationIds, markReadAll }),
    onSuccess: (_data, variables) => {
      queryClient.setQueriesData(
        { queryKey: ['notifications', 'unread'] },
        (oldData: NotificationsData | undefined) => {
          if (!oldData) return oldData;

          const shouldMarkAll = variables?.markReadAll ?? false;
          const updatedNotifications = oldData.notifications.map(notification => {
            if (shouldMarkAll || notificationIds.includes(notification.id)) {
              return { ...notification, isRead: true };
            }
            return notification;
          });

          const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
          const readCount = updatedNotifications.length - unreadCount;

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

      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    },
  });

  return {
    markNotificationsAsRead: mutateAsync,
    isMarkingAllAsRead: isPending,
  };
};
