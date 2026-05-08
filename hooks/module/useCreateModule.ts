import { createModule } from '@/services/apis/module';
import { Course } from '@/types/types';
import queryClient from '@/utils/query-client';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useCreateModule = ({ courseId }: { courseId: string }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ title }: { title: string }) => createModule({ courseId, title }),
    onSuccess: data => {
      queryClient.setQueryData(['courses', courseId], (oldData: Course) => {
        if (!oldData) return oldData;

        const newModule = {
          id: data.id,
          title: data.title,
          order: data.order,
          lessons: [],
        };

        return {
          ...oldData,
          modules: [...(oldData.modules ?? []), newModule],
        };
      });
      createToast('Module created successfully!', 'success');
    },
    onError: error => {
      createToast(error.message || 'Failed to create Module', 'error');
    },
  });

  return { createModule: mutateAsync, isCreating: isPending };
};
