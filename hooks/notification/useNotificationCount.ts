import { getNotificationCount } from '@/services/apis/notification';
import { useQuery } from '@tanstack/react-query';

export const useNotificationCount = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['notificationCount'],
    queryFn: getNotificationCount,
  });

  return {
    count: data?.unreadCount ?? 0,
    isLoading,
  };
};
