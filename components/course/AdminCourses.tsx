'use client';

import Courses from '@/components/ui/Courses';
import { fetchCourses } from '@/services/apis/courses';
import { useQuery } from '@tanstack/react-query';
import CoursesLayout from './CoursesLayout';

export default function AdminCoursesPage() {
  const {
    data: courses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: fetchCourses,
  });

  return (
    <CoursesLayout
      title="Courses"
      subtitle="Manage and review all courses"
      count={courses.length}
      isLoading={isLoading}
      isError={isError}
    >
      <Courses btnText="View Course" courses={courses} />
    </CoursesLayout>
  );
}
