import { createAssignment } from '@/services/apis/assignments';
import { Course } from '@/types/types';
import queryClient from '@/utils/query-client';
import { useMutation } from '@tanstack/react-query';

export const useCreateAssignment = (courseId: string, moduleId: string) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createAssignment,
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
    },
  });

  return {
    createAssignment: mutateAsync,
    isCreating: isPending,
  };
};
