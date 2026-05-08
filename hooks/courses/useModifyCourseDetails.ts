import { updateCourse } from '@/services/apis/courses';
import { courseFormData } from '@/types/types';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useModifyCourseDetails = ({ courseId }: { courseId: string }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: courseFormData) => updateCourse(courseId, payload),

    onSuccess: () => {
      createToast('Course updated successfully', 'success');
    },

    onError: (error: Error) => {
      createToast(error.message || 'Failed to update course', 'error');
    },
  });

  return { modifyCourseDetails: mutateAsync, isModifying: isPending };
};
