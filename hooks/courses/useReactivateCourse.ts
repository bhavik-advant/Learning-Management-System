import { reactivateCourse } from '@/services/apis/courses';
import queryClient from '@/utils/query-client';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useReactivateCourse = (courseId: string) => {
  return useMutation({
    mutationFn: () => reactivateCourse(courseId),

    onSuccess: () => {
      createToast('Course reactivated successfully', 'success');

      queryClient.invalidateQueries({
        queryKey: ['courses', courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ['courses'],
      });
    },

    onError: error => {
      createToast(error.message || 'Course Reactivation Failed!', 'error');
    },
  });
};
