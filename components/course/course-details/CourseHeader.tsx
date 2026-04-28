import Link from 'next/link';
import Image from 'next/image';

type CourseHeaderProps = {
  course: {
    title: string;
    description: string;
    status: string;
    thumbnail: string | null;
    modules: Module[];
  };
};

type Lesson = {
  id: string;
  title?: string;
};

type Module = {
  id: string;
  title?: string;
  lessons: Lesson[];
};

export function CourseHeader({ course }: CourseHeaderProps) {
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  const statusColors = {
    APPROVED: 'bg-green-500/90 text-white',
    PENDING: 'bg-amber-500/90 text-white',
    DEFAULT: 'bg-gray-500/90 text-white',
  };

  const statusColor =
    statusColors[course.status as keyof typeof statusColors] || statusColors.DEFAULT;

  return (
    <div className="relative h-[45vh] min-h-[350px] overflow-hidden">
      {course.thumbnail ? (
        <Image src={course.thumbnail} alt={course.title} fill className="object-cover" priority />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600" />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-gray-700/50 via-gray-700/20 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-gray-700/80 via-transparent to-transparent" />

      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Link
          href="./"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition"
        >
          <BackIcon />
          Back
        </Link>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColor}`}
          >
            {course.status}
          </span>
        </div>
      </div>

      <div className="absolute bottom-20 left-0 right-0 p-6 sm:p-10">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
            <span className="font-medium">{course.modules.length} Modules</span>
            <span>•</span>
            <span>{totalLessons} Lessons</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
            {course.title}
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl line-clamp-2">
            {course.description}
          </p>
        </div>
      </div>
    </div>
  );
}

const BackIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
