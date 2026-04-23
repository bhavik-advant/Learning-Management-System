import React from 'react';
import LessonForm from './LessonForm';
import { editLesoon } from '@/services/apis/lesson';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import queryClient from '@/utils/query-client';
import { Course } from '@/types/types';

function EditLesson({
  lessonId,
  moduleId,
  onClose,
  url,
  title,
}: {
  moduleId: string;
  lessonId: string;
  onClose: () => void;
  url: string;
  title: string;
}) {
  const { id: courseId } = useParams<{ id: string }>();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: editLesoon,
    onSuccess: response => {
      queryClient.setQueryData(['courses', courseId], (old: Course) => {
        if (!old) {
          return old;
        }

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
      onClose();
    },
  });

  const handleSubmit = async ({
    title,
    url,
    file,
  }: {
    title: string;
    url?: string | undefined;
    file?: File | undefined;
  }) => {
    const result = await mutateAsync({ courseId, moduleId, lessonId, title, url, file });
    console.log(result);
  };

  return (
    <LessonForm
      formTitle="Edit Lesson"
      isPending={isPending}
      title={title}
      func={handleSubmit}
      moduleId={moduleId}
      onClose={onClose}
      url={url}
      stringForm={true}
    />
  );
}

export default EditLesson;
