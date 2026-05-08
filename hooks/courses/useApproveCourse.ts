'use client';

import { approveCourse } from '@/services/apis/courses';
import createToast from '@/utils/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useApproveCourse = (courseId: string) => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: approveCourse,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pendingCourses'],
      });

      queryClient.invalidateQueries({
        queryKey: ['courses', courseId],
      });
      createToast('Course Approved!', 'success');
    },
    onError: error => {
      createToast(error.message || 'Failed to approve course', 'error');
    },
  });

  const approve = () => {
    mutate(courseId);
  };

  const approveAsync = async () => {
    return await mutateAsync(courseId);
  };

  return {
    approve,
    approveAsync,
    isPending,
  };
};
