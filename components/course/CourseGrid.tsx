'use client';
import Courses from '@/components/ui/Courses';
import { fetchCourses } from '@/services/apis/courses';
import { useQuery } from '@tanstack/react-query';

export default function CourseGrid() {
  const {
    data: courses = [],
    isLoading: coursesLoading,
    isError: coursesError,
  } = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: fetchCourses,
  });

  const loading = coursesLoading;
  const hasError = coursesError;
  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Loading dashboard…</p>;
  }

  if (hasError && !loading) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Could not load dashboard data. Please refresh the page.
      </p>
    );
  }

  return (
    <section className="mx-8 space-y-5 mt-5">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Courses</h2>
      </div>
      <Courses btnText="View Course" courses={courses} />
    </section>
  );
}
