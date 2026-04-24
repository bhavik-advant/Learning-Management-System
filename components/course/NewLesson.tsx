'use client';

import { addLesson } from '@/services/apis/lesson';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import queryClient from '@/utils/query-client';
import LessonForm from './LessonForm';
import { Course } from '@/types/types';

type LessonAddFormProps = {
  moduleId: string;
  onClose: () => void;
};

const NewLesson: React.FC<LessonAddFormProps> = ({ moduleId, onClose }) => {
  const { id: courseId } = useParams<{ id: string }>();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: addLesson,
    onSuccess: (data, variables) => {
      try {
        const newLesson = {
          id: data.id,
          title: data.title,
          url: data.url || null,
        };

        queryClient.setQueryData(['courses', courseId], (oldData: Course) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            modules: oldData.modules.map(module =>
              module.id === variables.moduleId
                ? {
                    ...module,
                    lessons: [...(module.lessons || []), newLesson],
                  }
                : module
            ),
          };
        });
        onClose();
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleAddLesson = async ({
    title,
    url,
    file,
  }: {
    title: string;
    url?: string;
    file?: File;
  }) => {
    try {
      if (url) {
        await mutateAsync({ courseId, moduleId, title, url });
      } else {
        if (!file) return;
        await mutateAsync({ courseId, moduleId, title, lesson: file });
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <>
      <LessonForm
        onClose={onClose}
        formTitle="Add new Lesson"
        func={handleAddLesson}
        isPending={isPending}
        moduleId={moduleId}
      />
    </>
  );
};

export default NewLesson;
