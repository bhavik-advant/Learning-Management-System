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
      <div>
        <h1 className="text-3xl font-bold">Courses</h1>
        <p>Explore and enroll in courses</p>
      </div>
      <div>
        <Courses btnText="Continue Learning" courses={courses} />
      </div>
    </section>
  );
}
