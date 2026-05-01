'use client';

import Courses from '@/components/ui/Courses';
import { fetchCourses } from '@/services/apis/courses';
import { useQuery } from '@tanstack/react-query';
import CoursesLayout from './CoursesLayout';

export default function TraineeCoursesPage() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['trainee-courses'],
    queryFn: fetchCourses,
  });

  return (
    <CoursesLayout
      title="My Courses"
      subtitle="Track, submit, and review your course work"
      isLoading={isLoading}
    >
      <Courses btnText="Continue Learning" courses={courses} />
    </CoursesLayout>
  );
}
