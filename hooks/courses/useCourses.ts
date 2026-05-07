import { fetchCourses } from '@/services/apis/courses';
import { Course } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

export const useCourses = ({
  limit,
  filter,
}: {
  limit?: number;
  filter?: {
    search: string;
    statusFilter: string;
  };
} = {}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['courses', limit, filter],
    queryFn: () =>
      fetchCourses({
        ...(limit !== undefined ? { limit } : {}),
        ...(filter ? { filters: filter } : {}),
      }),
  });

  return {
    courses: data?.courses ?? [],
    stats: data?.stats,
    isFetching: isLoading,
    isError,
    error,
  };
};
