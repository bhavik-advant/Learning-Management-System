import { editLesoon } from '@/services/apis/lesson';
import { Course } from '@/types/types';
import queryClient from '@/utils/query-client';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useModifyLesson = ({
  courseId,
  moduleId,
  lessonId,
}: {
  courseId: string;
  moduleId: string;
  lessonId: string;
}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ content, title }: { content: string; title: string }) =>
      editLesoon({ courseId, moduleId, lessonId, content, title }),
    onSuccess: response => {
      queryClient.setQueryData(['courses', courseId], (old: Course) => {
        if (!old) {
          return old;
        }

        console.log(old, ' and ', response);

        return {
          ...old,
          modules: old.modules.map(module =>
            module.id === moduleId
              ? {
                  ...module,
                  lessons: module.lessons.map(lesson =>
                    lesson.id === lessonId ? response : lesson
                  ),
                }
              : module
          ),
        };
      });
      createToast('Lesson updated successfully!', 'success');
    },
    onError: error => {
      createToast(error.message || 'Failed to update Lesson!', 'error');
    },
  });

  return {
    editLesoon: mutateAsync,
    isEditing: isPending,
  };
};
