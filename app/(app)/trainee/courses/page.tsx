'use client';
import Courses from '@/components/ui/Courses';
import { getTraineeCourses } from '@/services/apis/courses';
import { useQuery } from '@tanstack/react-query';

export default function CoursesPage() {
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['trainee-courses'],
    queryFn: getTraineeCourses,
  });

  if (coursesLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <section className="mx-8 space-y-5 mt-5">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-indigo-500 dark:text-indigo-400">
          Learning Progress
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          My Courses
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Track, submit, and review your course work
        </p>
      </div>
      <div>
        <Courses btnText="Continue Learning" courses={courses} />
      </div>
    </section>
  );
}
