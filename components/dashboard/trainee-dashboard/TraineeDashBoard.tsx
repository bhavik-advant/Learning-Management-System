'use client';
import { BiBook } from 'react-icons/bi';
import DashBoardCard from '../mentor-dashboard/DashboardCard';
import { FaRegFileAlt } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FaArrowTrendUp } from 'react-icons/fa6';
import Courses from '@/components/ui/Courses';
import Assignments from '@/components/assignments/Assignments';
import { useQuery } from '@tanstack/react-query';
import { getTraineeCourses } from '@/services/apis/courses';
import { AssignmentType, getTraineeAssignments } from '@/services/apis/Assignments';
import Link from 'next/link';


type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  status: string;
  authorId: string;
  thumbnailId: string | null;
  createdAt: string;
  updatedAt: string;
  modulesCount: number;
};
function TraineeDashBoard() {
  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['trainee-courses'],
    queryFn: getTraineeCourses,
  });

  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery<AssignmentType[]>({
    queryKey: ['assignments'],
    queryFn: getTraineeAssignments,
  });

  if (coursesLoading || assignmentsLoading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Loading dashboard…</p>;
  }

  const totalCourses = courses.length;

  const pendingAssignments = assignments.filter(a =>
    a.submissions?.some(s => s.status === 'PENDING')
  ).length;

  const completedAssignments = assignments.filter(a =>
    a.submissions?.some(s => s.status === 'GRADED')
  ).length;

  const avgScore =
    assignments.reduce((acc, a) => {
      const scores = a.submissions?.filter(s => s.score !== null) || [];
      if (!scores.length) return acc;
      const avg = scores.reduce((sum, s) => sum + (s.score ?? 0), 0) / scores.length;
      return acc + avg;
    }, 0) / (assignments.length || 1);

  return (
    <div className="mx-4 sm:mx-8 space-y-6 pb-10">
      <section className="mt-6 sm:mt-8">
        <div className="relative overflow-hidden rounded-3xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 backdrop-blur-xl shadow-sm">
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="inline-flex w-fit items-center rounded-full border border-gray-200/80 dark:border-gray-800 bg-white/60 dark:bg-gray-950/40 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                  Learning Portal
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Trainee Dashboard</h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Track your courses, assignments, and learning progress all in one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/trainee/courses"
                  className="rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                >
                  Browse Courses
                </Link>
                <Link
                  href="/trainee/assignments"
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/30 px-4 py-2 text-sm font-medium hover:bg-white/80 dark:hover:bg-gray-950/50 transition"
                >
                  My Assignments
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DashBoardCard
                title="Courses Enrolled"
                value={totalCourses}
                icon={<BiBook className="text-[22px]" />}
              />
              <DashBoardCard
                title="Pending Assignments"
                value={pendingAssignments}
                icon={<FaRegFileAlt className="text-[20px]" />}
              />
              <DashBoardCard
                title="Completed Assignments"
                value={completedAssignments}
                icon={<IoMdCheckmarkCircleOutline className="text-[22px]" />}
              />
              <DashBoardCard
                title="Average Score"
                value={Math.round(avgScore || 0)}
                icon={<FaArrowTrendUp className="text-[20px]" />}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-3xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Your Courses</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Pick up where you left off and keep learning.
              </p>
            </div>
            <Link
              href="/trainee/courses"
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
            >
              View all
            </Link>
          </div>
          <div className="px-5 sm:px-6 pb-6">
            <Courses btnText="Continue Learning" courses={courses} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-3xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Assignments</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Submit pending work and review graded feedback.
              </p>
            </div>
            <Link
              href="/trainee/assignments"
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
            >
              View all
            </Link>
          </div>
          <div className="px-5 sm:px-6 pb-6">
            <Assignments assignments={assignments} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default TraineeDashBoard;
