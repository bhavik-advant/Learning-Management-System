import { createCourse } from '@/services/apis/courses';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useCreateCourse = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCourse,

    onSuccess() {
      createToast('Course created successfully', 'success');
    },

    onError: (error: Error) => {
      createToast(error.message || 'Failed to create course', 'error');
    },
  });

  return {
    createCourse: mutateAsync,
    isCreatingCourse: isPending,
  };
};
