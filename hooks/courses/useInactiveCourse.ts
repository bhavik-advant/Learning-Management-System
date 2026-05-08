import { inactiveCourse } from '@/services/apis/courses';
import queryClient from '@/utils/query-client';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useInactiveCourse = (courseId: string) => {
  return useMutation({
    mutationFn: () => inactiveCourse(courseId),

    onSuccess: () => {
      createToast('Course marked as inactive', 'success');

      queryClient.invalidateQueries({
        queryKey: ['courses', courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ['courses'],
      });
    },

    onError: (error: Error) => {
      createToast(error.message || 'Failed to inactive course', 'error');
    },
  });
};
