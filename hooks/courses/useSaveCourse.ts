import { saveCourse } from '@/services/apis/courses';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useSaveCourse = () => {
  const mutation = useMutation({
    mutationFn: saveCourse,
    onSuccess: () => {
      createToast('Course Saved!', 'success');
    },
    onError: error => {
      createToast(error.message || 'Failed to save course', 'error');
    },
  });

  return {
    saveCourse: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
};
