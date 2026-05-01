import { Course, restrictCourse } from '@/services/apis/courses';
import queryClient from '@/utils/query-client';
import { useMutation } from '@tanstack/react-query';

type CoursesResponse = {
  courses: Course[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
};

const useRestrictCourse = ({ traineeId }: { traineeId: string }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: restrictCourse,
    onSuccess: (data, variable) => {
      queryClient.setQueriesData(
        { queryKey: ['assigned-courses', traineeId] },
        (old: CoursesResponse | undefined) => {
          if (!old?.courses) return old;

          return {
            ...old,
            courses: old.courses.filter(course => !variable.courseIds.includes(course.id)),
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ['assignable-courses', traineeId] });
    },
  });

  return {
    restrictCourse: mutateAsync,
    isTakingAccess: isPending,
  };
};

export default useRestrictCourse;
