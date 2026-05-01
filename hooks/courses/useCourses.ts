import { fetchCourses } from '@/services/apis/courses';
import { useQuery } from '@tanstack/react-query';

export const useCourses = (limit?: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ['courses', limit],
    queryFn: () => fetchCourses({ limit }),
  });

  return { courses: data, isFetching: isLoading };
};
