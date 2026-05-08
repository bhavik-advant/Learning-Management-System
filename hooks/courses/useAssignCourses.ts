import { assignCourse } from '@/services/apis/courses';
import { Course } from '@/types/types';
import queryClient from '@/utils/query-client';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useAssignCourse = ({ userId }: { userId: string }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: assignCourse,

    onSuccess: (data, variables) => {
      queryClient.setQueriesData(
        { queryKey: ['assignable-courses', userId] },
        (old: { courses: Course[] } | undefined) => {
          if (!old?.courses) return old;

          return {
            ...old,
            courses: old.courses.filter(course => !variables.courseIds.includes(course.id)),
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ['assigned-courses', userId],
      });

      queryClient.invalidateQueries({
        queryKey: ['assignable-courses', userId],
      });
      createToast('Course Assigned successfully!', 'success');
    },
    onError: (error: Error) => {
      createToast(error.message || 'Course Assignment Failed!', 'error');
    },
  });

  const assignCourses = async ({ courseIds }: { courseIds: string[] }) => {
    return mutateAsync({
      courseIds,
      userId,
    });
  };

  return {
    assignCourses,
    isAssigning: isPending,
  };
};
