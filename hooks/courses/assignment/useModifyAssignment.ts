import { editAssignment } from '@/services/apis/assignments';
import { Course } from '@/types/types';
import queryClient from '@/utils/query-client';
import { useMutation } from '@tanstack/react-query';

export const useModifyAssignment = (courseId: string, moduleId: string) => {
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: editAssignment,
    onSuccess: updatedAssignment => {
      queryClient.setQueryData(['courses', courseId], (oldCourse: Course) => {
        if (!oldCourse) return oldCourse;

        return {
          ...oldCourse,
          modules: oldCourse.modules?.map(module => {
            if (module.id !== moduleId) return module;
            return {
              ...module,
              assignments: module.assignments?.map(a =>
                a.id === updatedAssignment.id ? { ...a, ...updatedAssignment } : a
              ),
            };
          }),
        };
      });
    },
  });

  return {
    updateAssignment: mutateAsync,
    isUpdating: isPending,
    isUpdateError: isError,
    updateError: error,
  };
};
