import { deleteLesson } from '@/services/apis/lesson';
import queryClient from '@/utils/query-client';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { BiTrash } from 'react-icons/bi';
import { VscEdit } from 'react-icons/vsc';
import { Course } from '@/types/types';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/mdxEditor';
import EditLesson from './EditLesson';

type Lesson = {
  id: string;
  title: string;
  content: string;
};

type LessonEditFormProps = {
  lesson: Lesson;
  moduleId: string;
};

const Lessons: React.FC<LessonEditFormProps> = ({ lesson, moduleId }) => {
  const [isEditing, setIsEditing] = useState(false);

  const { id: courseId } = useParams<{ id: string }>();

  const { isPending: deleting, mutateAsync: deleteAsync } = useMutation({
    mutationFn: deleteLesson,
    onSuccess: data => {
      try {
        const deletedLesson = data;
        queryClient.setQueryData(['courses', courseId], (old: Course) => {
          if (!old) return old;
          return {
            ...old,
            modules: old.modules.map(module => {
              if (module.id !== moduleId) {
                return module;
              }
              return {
                ...module,
                lessons: module.lessons.filter(lesson => lesson.id !== deletedLesson.id),
              };
            }),
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleDeleteLesson = async () => {
    await deleteAsync({ courseId, moduleId, lessonId: lesson.id });
  };

  if (isEditing) {
    return (
      <EditLesson
        title={lesson.title}
        content={lesson.content}
        lessonId={lesson.id}
        moduleId={moduleId}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex justify-center bg-white dark:bg-[#1e2939]  items-center">
      <Card className="max-w-150 flex-1 border max-h-110  border-gray-400/30 p-4 ">
        <div className="flex justify-between items-center px-2  ">
          <div className=" font-medium">{lesson.title}</div>

          <div className="flex gap-4">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500/20 dark:bg-blue-500/10 p-2 rounded-lg hover:bg-blue-500/30 dark:hover:bg-blue-500/20 transition"
                >
                  <VscEdit className="text-blue-500 dark:text-blue-400" />
                </button>
                <button
                  onClick={handleDeleteLesson}
                  disabled={deleting}
                  className={`relative flex items-center justify-center p-2 rounded-lg transition ${deleting ? 'bg-red-500/10 cursor-not-allowed opacity-70' : 'bg-red-500/20 hover:bg-red-500/30 dark:bg-red-500/10 dark:hover:bg-red-500/20'}`}
                >
                  {deleting ? (
                    <span className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <BiTrash className="text-red-500 dark:text-red-300" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        <MarkdownEditor
          value={lesson.content ?? ''}
          onChange={() => {}}
          readOnly={!isEditing}
          isEditing={isEditing}
          className="overflow-auto no-scrollbar"
        />

        {isEditing && (
          <div className="flex justify-end gap-4 items-center">
            <button onClick={() => setIsEditing(false)}>Cancel</button>
            <button>Save</button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Lessons;
