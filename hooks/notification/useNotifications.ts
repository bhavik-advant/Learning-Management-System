import { getNotification } from '@/services/apis/notification';
import { useQuery } from '@tanstack/react-query';

export const useNotification = (status?: 'read' | 'unread') => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notifications', status],
    queryFn: () => getNotification(status),
  });

  return {
    notifications: data?.notifications || [],
    meta: data?.meta,
    isLoading,
    isError,
  };
};
