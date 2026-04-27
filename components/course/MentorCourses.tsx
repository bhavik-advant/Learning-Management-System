'use client';

import Courses from '@/components/ui/Courses';
import { fetchCourses } from '@/services/apis/courses';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import CoursesLayout from './CoursesLayout';

export default function MentorCoursesPage() {
  const { data: courses = [], isPending } = useQuery({
    queryKey: ['mentor-courses'],
    queryFn: fetchCourses,
  });

  return (
    <CoursesLayout
      title="Your Courses"
      isLoading={isPending}
      headerRight={
        <Link href="/app/add-course">
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md">+ Add Course</button>
        </Link>
      }
    >
      <Courses btnText="Manage Course" courses={courses} />
    </CoursesLayout>
  );
}
