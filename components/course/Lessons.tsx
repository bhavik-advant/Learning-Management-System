import { deletedLesson } from '@/services/apis/lesson';
import queryClient from '@/utils/query-client';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BiEdit, BiTrash } from 'react-icons/bi';

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
  const { id: courseId } = useParams<{ id: string }>();

  const { isPending: deleting, mutateAsync: deleteAsync } = useMutation({
    mutationFn: deletedLesson,
    onSuccess: response => {
      const deletedLesson = response.data;

      queryClient.setQueryData(['courses', courseId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            modules: old.data.modules.map((module: any) => {
              if (module.id !== deletedLesson.moduleId) {
                return module;
              }

              return {
                ...module,
                lessons: module.lessons.filter((lesson: any) => lesson.id !== deletedLesson.id),
              };
            }),
          },
        };
      });
    },
  });
  const handleDeleteLesson = async () => {
    const response = await deleteAsync({ courseId, moduleId, lessonId: lesson.id });
    console.log(response);
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Course Lesson
      </label>

      <div className="flex items-center justify-center w-full gap-4">
        <Link
          href={lesson.url}
          target="_blank"
          className="flex flex-col items-center justify-center w-full h-18 border-2 border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{lesson.title}</p>
        </Link>

        <div className="flex flex-col gap-2">
          <button className="bg-blue-500/20 dark:bg-blue-500/10 p-2 rounded-lg hover:bg-blue-500/30 dark:hover:bg-blue-500/20 transition">
            <BiEdit className="text-blue-500 dark:text-blue-400" />
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
    </div>
  );
};

export default Lessons;
