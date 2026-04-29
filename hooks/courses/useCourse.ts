import { getCourseById } from '@/services/apis/courses';
import { useQuery } from '@tanstack/react-query';

export const useCourse = (courseId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => getCourseById(courseId),
  });

  return { course: data, isLoading };
};
