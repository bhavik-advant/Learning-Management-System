import { deleteAllNotifications } from '@/services/apis/notification';
import type { NotificationsData } from '@/types/types';
import queryClient from '@/utils/query-client';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useDeleteNotifications = ({ notificationIds }: { notificationIds: string[] }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ deleteAll = false }: { deleteAll?: boolean }) =>
      deleteAllNotifications({ notificationIds, deleteAll }),
    onSuccess: (_data, variables) => {
      queryClient.setQueriesData(
        { queryKey: ['notifications'] },
        (oldData: NotificationsData | undefined) => {
          if (!oldData) return oldData;

          const shouldDeleteAll = variables?.deleteAll ?? false;
          const updatedNotifications = shouldDeleteAll
            ? []
            : oldData.notifications.filter(
                notification => !notificationIds.includes(notification.id)
              );

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
      createToast('Notifications deleted successfully', 'success');
    },
  });

  return {
    deleteNotifications: mutateAsync,
    isPending,
  };
};
