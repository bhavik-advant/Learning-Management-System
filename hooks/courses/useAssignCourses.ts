import { assignCourse, Course } from '@/services/apis/courses';
import queryClient from '@/utils/query-client';
import { useMutation } from '@tanstack/react-query';

export const useAssignCourse = ({ selectedTraineeId }: { selectedTraineeId: string }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: assignCourse,
    onSuccess: (data, variable) => {
      queryClient.setQueriesData(
        { queryKey: ['assignable-courses', selectedTraineeId] },
        (old: { courses: Course[] } | undefined) => {
          if (!old?.courses) return old;

          return {
            ...old,
            courses: old.courses.filter(course => !variable.courseIds.includes(course.id)),
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ['assigned-courses', selectedTraineeId] });
    },
  });

  return {
    assignCourses: mutateAsync,
    isAssigning: isPending,
  };
};
