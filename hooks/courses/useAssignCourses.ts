import { assignCourse, Course } from '@/services/apis/courses';
import queryClient from '@/utils/query-client';
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
