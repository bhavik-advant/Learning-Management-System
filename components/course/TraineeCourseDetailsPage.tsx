'use client';
import CourseDetailsLayout from '@/components/course/course-details/CourseDetailsLayout';
import { getCourseById } from '@/services/apis/courses';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import Loading from '../ui/loading';

type Props = {
  params: Promise<{ courseId: string }>;
};

export default function TraineeCourseDetailsPage({ params }: Props) {
  const { courseId } = use(params);

  const { data: course, isLoading } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => getCourseById(courseId),
  });

  if (isLoading) return <Loading text="Course Details" />;

  return <CourseDetailsLayout course={course} showSubmission={true} />;
}
