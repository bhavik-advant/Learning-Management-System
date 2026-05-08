import { addLesson } from '@/services/apis/lesson';
import { Course } from '@/types/types';
import queryClient from '@/utils/query-client';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useCreateLesson = ({ courseId, moduleId }: { courseId: string; moduleId: string }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      addLesson({ courseId, moduleId, title, content }),
    onSuccess: data => {
      const newLesson = {
        id: data.id,
        title: data.title,
        content: data.content,
      };

      queryClient.setQueryData(['courses', courseId], (oldData: Course) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          modules: oldData.modules.map(module =>
            module.id === moduleId
              ? {
                  ...module,
                  lessons: [...(module.lessons || []), newLesson],
                }
              : module
          ),
        };
      });
      createToast('Lesson created successfully!', 'success');
    },
    onError: error => {
      createToast(error.message || 'Failed to create Lesson!', 'error');
    },
  });

  return { createLesson: mutateAsync, isCreating: isPending };
};
