import { getMentors } from '@/services/apis/users';
import { useQuery } from '@tanstack/react-query';

export const useMentors = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ['admin', 'mentors'],
    queryFn: getMentors,
    enabled,
  });
};
