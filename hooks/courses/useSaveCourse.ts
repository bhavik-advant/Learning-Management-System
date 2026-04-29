import { saveCourse } from '@/services/apis/courses';
import { useMutation } from '@tanstack/react-query';

export const useSaveCourse = () => {
  const mutation = useMutation({
    mutationFn: saveCourse,
  });

  return {
    saveCourse: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
};
