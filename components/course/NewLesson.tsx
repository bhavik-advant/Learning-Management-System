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
          content: data.content,
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

  const handleAddLesson = async ({ title, content }: { title: string; content: string }) => {
    try {
      await mutateAsync({ courseId, moduleId, title, content });
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <>
      <LessonForm
        submitText="Add"
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
