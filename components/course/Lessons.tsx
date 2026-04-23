import { deletedLesson } from '@/services/apis/lesson';
import { getEmbedUrl } from '@/utils/embeded-url';
import queryClient from '@/utils/query-client';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { BiTrash } from 'react-icons/bi';
import { VscEdit } from 'react-icons/vsc';
import EditLesson from './EditLesson';
import { Course } from '@/types/types';

type Lesson = {
  id: string;
  title: string;
  url: string;
};

type LessonEditFormProps = {
  lesson: Lesson;
  moduleId: string;
};

const Lessons: React.FC<LessonEditFormProps> = ({ lesson, moduleId }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const { id: courseId } = useParams<{ id: string }>();
  const embedUrl = getEmbedUrl(lesson.url);

  const { isPending: deleting, mutateAsync: deleteAsync } = useMutation({
    mutationFn: deletedLesson,
    onSuccess: data => {
      try {
        const deletedLesson = data;
        queryClient.setQueryData(['courses', courseId], (old: Course) => {
          if (!old) return old;
          return {
            ...old,
            modules: old.modules.map(module => {
              if (module.id !== deletedLesson.moduleId) {
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
  return (
    <div className="flex justify-center bg-white  items-center">
      <div className="max-w-[500px] flex-1 border border-gray-400/30 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <label className="text-md font-medium text-gray-700 dark:text-gray-300">Lesson :</label>
            <p className="text-sm">{lesson.title}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowEditForm(prev => !prev);
              }}
              className="bg-blue-500/20 dark:bg-blue-500/10 p-2 rounded-lg hover:bg-blue-500/30 dark:hover:bg-blue-500/20 transition"
            >
              <VscEdit className="text-blue-500 dark:text-blue-400" />
            </button>
            <button
              onClick={handleDeleteLesson}
              disabled={deleting}
              aria-busy={deleting}
              aria-label={deleting ? 'Deleting lesson' : 'Delete lesson'}
              className={`relative flex items-center justify-center p-2 rounded-lg transition ${deleting ? 'bg-red-500/10 cursor-not-allowed opacity-70' : 'bg-red-500/20 hover:bg-red-500/30 dark:bg-red-500/10 dark:hover:bg-red-500/20'}`}
            >
              {deleting ? (
                <span className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <BiTrash className="text-red-500 dark:text-red-300" />
              )}
            </button>
          </div>
        </div>

        {showEditForm ? (
          <EditLesson
            lessonId={lesson.id}
            onClose={() => setShowEditForm(false)}
            moduleId={moduleId}
            title={lesson.title}
            url={lesson.url}
          />
        ) : (
          <div>
            <iframe
              src={embedUrl}
              title={lesson.title}
              className="w-full h-64 rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;
