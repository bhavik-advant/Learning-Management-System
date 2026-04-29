import { deleteAssignment } from '@/services/apis/assignments';
import { Course } from '@/types/types';
import queryClient from '@/utils/query-client';
import { useMutation } from '@tanstack/react-query';

export const useDeleteAssignment = (courseId: string, moduleId: string) => {
  const { mutateAsync, isError, error, isPending } = useMutation({
    mutationFn: deleteAssignment,
    onSuccess: deletedAssignment => {
      const deletedAssignmentId = deletedAssignment?.id;
      if (!deletedAssignmentId) return;

      queryClient.setQueryData(['courses', courseId], (oldCourse: Course | undefined) => {
        if (!oldCourse) return oldCourse;

        return {
          ...oldCourse,
          modules: oldCourse.modules?.map(module => {
            if (module.id !== moduleId) return module;
            return {
              ...module,
              assignments: (module.assignments || []).filter(a => a.id !== deletedAssignmentId),
            };
          }),
        };
      });
    },
  });

  return {
    deleteAssignment: mutateAsync,
    isDeleting: isPending,
    isDeletingError: isError,
    deletingError: error,
  };
};
