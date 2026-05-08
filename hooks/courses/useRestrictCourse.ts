import { restrictCourse } from '@/services/apis/courses';
import { Course } from '@/types/types';
import queryClient from '@/utils/query-client';
import createToast from '@/utils/toast';
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

const useRestrictCourse = ({ userId }: { userId: string }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: restrictCourse,

    onSuccess: (data, variables) => {
      queryClient.setQueriesData(
        { queryKey: ['assigned-courses', userId] },
        (old: CoursesResponse | undefined) => {
          if (!old?.courses) return old;

          return {
            ...old,
            courses: old.courses.filter(course => !variables.courseIds.includes(course.id)),
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ['assignable-courses', userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['assigned-courses', userId],
      });
      createToast('Course Restricted', 'success');
    },

    onError: error => {
      createToast(error.message || 'Course Restriction Failed!', 'error');
    },
  });

  const handleRestrictCourse = async ({ courseIds }: { courseIds: string[] }) => {
    return mutateAsync({
      courseIds,
      userId,
    });
  };

  return {
    restrictCourse: handleRestrictCourse,
    isTakingAccess: isPending,
  };
};

export default useRestrictCourse;
