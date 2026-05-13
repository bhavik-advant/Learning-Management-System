import { getNotification } from '@/services/apis/notification';
import { useQuery } from '@tanstack/react-query';

export const useNotification = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotification,
  });
  return { notifications: data, isLoading, isError };
};
