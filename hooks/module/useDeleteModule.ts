import { deleteModule } from '@/services/apis/module';
import { Course } from '@/types/types';
import queryClient from '@/utils/query-client';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useDeleteModule = ({ courseId, moduleId }: { courseId: string; moduleId: string }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteModule({ courseId, moduleId }),
    onSuccess: () => {
      queryClient.setQueryData(['courses', courseId], (old: Course) => {
        if (!old) {
          return old;
        }

        return {
          ...old,
          modules: old.modules.filter(module => module.id != moduleId),
        };
      });
      createToast('Module deleted successfully!', 'success');
    },
    onError: error => {
      createToast(error.message || 'Failed to delete Module!', 'error');
    },
  });

  return { deleteModule: mutateAsync, isDeleting: isPending };
};
