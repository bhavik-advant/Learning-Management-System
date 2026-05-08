'use client';
import CourseDetailsLayout from '@/components/course/course-details/CourseDetailsLayout';
import ApproveButton from '@/components/ui/ApproveButton';
import { getCourseById } from '@/services/apis/courses';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { use } from 'react';
import Loading from '../../ui/loading';
import { Role } from '@/generated/prisma/enums';
import InactiveCourseButton from './InactiveCourseButton';
import ReactivateCourseButton from './ReactivateCourseButton ';

type Props = {
  role: Role;
  userId: string;
  params: Promise<{ courseId: string }>;
};

export default function CourseDetailsPage({ role, userId, params }: Props) {
  const { courseId } = use(params);

  const { data: course, isLoading } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => getCourseById(courseId),
  });

  if (isLoading || !course) return <Loading text="Course Details" />;

  if (!isLoading && !course) {
    return <p>Unable to load course details.</p>;
  }

  return (
    <CourseDetailsLayout
      course={course}
      topActions={
        <div className="flex gap-3">
          {(userId == course.authorId || role == 'ADMIN') && (
            <>
              <Link
                href={`/app/add-course/${course.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </Link>

              {course.status === 'DRAFT' && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition">
                  Draft
                </div>
              )}
              {course.status === 'PENDING' && role == 'ADMIN' && (
                <ApproveButton courseId={course.id} />
              )}

              {(userId == course.authorId || role == 'ADMIN') && course.status !== 'INACTIVE' ? (
                <InactiveCourseButton courseId={course.id} />
              ) : (
                <ReactivateCourseButton courseId={course.id} />
              )}
            </>
          )}
        </div>
      }
    />
  );
}
