import Image from 'next/image';
import Link from 'next/link';
import ApproveButton from '../ui/ApproveButton';

type CourseType = {
  id: string;
  title: string;
  description: string;
  mentor: string;
  submittedAt: string;
  modules: number;
  lessons: number;
  image: string | null;
};

type Props = {
  courses: CourseType[];
};

export default function ApprovalTable({ courses }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {courses.length === 0 ? (
        <div className="overflow-hidden rounded-3xl border border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-950/30 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600 dark:text-gray-300 px-6">
            <div className="mb-4 grid place-items-center h-12 w-12 rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-gray-700 dark:text-gray-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold">No pending approvals</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
              All courses have been reviewed. New submissions will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <div
              key={course.id}
              className=" relative overflow-hidden rounded-3xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 backdrop-blur-xl shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  src={course.image || '/default-course.png'}
                  alt={course.title}
                  fill
                />
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center rounded-full border border-gray-300 bg-white/80 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    Pending
                  </span>
                </div>
              </div>

              <div className="relative p-5 space-y-4">
                <h3 className="text-[18px] font-semibold leading-snug text-gray-900 dark:text-white line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {course.mentor}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span>{formatDate(course.submittedAt)}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    {course.modules} modules
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {course.lessons} lessons
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <ApproveButton courseId={course.id} />
                  <Link
                    href={`courses/${course.id}`}
                    className="flex-1 flex items-center justify-center gap-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/30 text-sm font-medium hover:bg-white/80 dark:hover:bg-gray-950/50 transition"
                  >
                    View
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
