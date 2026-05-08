import { createAssignment } from '@/services/apis/assignments';
import { Course } from '@/types/types';
import queryClient from '@/utils/query-client';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useCreateAssignment = (courseId: string, moduleId: string) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      description,
      maxScore,
      title,
    }: {
      description: string;
      maxScore: number;
      title: string;
    }) => createAssignment({ courseId, moduleId, description, maxScore, title }),
    onSuccess: createdAssignment => {
      queryClient.setQueryData(['courses', courseId], (oldData: Course) => {
        if (!oldData) return oldData;

        return {
          ...oldData,

          modules: oldData.modules?.map(module =>
            module.id === moduleId
              ? {
                  ...module,
                  assignments: [...(module.assignments || []), createdAssignment],
                }
              : module
          ),
        };
      });

      createToast('Assignment created successfully', 'success');
    },

    onError: (error: Error) => {
      createToast(error.message || 'Failed to create assignment', 'error');
    },
  });

  return {
    createAssignment: mutateAsync,
    isCreating: isPending,
  };
};
