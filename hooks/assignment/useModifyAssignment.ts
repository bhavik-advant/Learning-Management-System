import { editAssignment } from '@/services/apis/assignments';
import { Course } from '@/types/types';
import queryClient from '@/utils/query-client';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useModifyAssignment = (courseId: string, moduleId: string, assignmentId: string) => {
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: ({
      description,
      maxScore,
      title,
    }: {
      description: string;
      maxScore: number;
      title: string;
    }) => editAssignment({ assignmentId, courseId, description, maxScore, moduleId, title }),
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
      createToast('Assignment modified successfully', 'success');
    },
    onError: (error: Error) => {
      createToast(error.message || 'Failed to modify assignment', 'error');
    },
  });

  return {
    updateAssignment: mutateAsync,
    isUpdating: isPending,
    isUpdateError: isError,
    updateError: error,
  };
};
