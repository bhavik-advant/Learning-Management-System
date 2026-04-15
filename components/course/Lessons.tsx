import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { BiEdit, BiTrash } from 'react-icons/bi';

type Lesson = {
  id: string;
  title: string;
  url: string;
};

type LessonEditFormProps = {
  lesson: Lesson;
};

const Lessons: React.FC<LessonEditFormProps> = ({ lesson }) => {
  // const {} = useMutation({
  //   mutationFn: () => {return {message : ' '}},
  // });
  const handleDeleteLesson = () => {};
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
            className="bg-red-500/20 dark:bg-red-500/10 p-2 rounded-lg hover:bg-red-500/30 dark:hover:bg-red-500/20 transition"
          >
            <BiTrash className="text-red-400 dark:text-red-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
