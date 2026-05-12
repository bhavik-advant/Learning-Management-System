'use client';
import { BiBook } from 'react-icons/bi';
import DashBoardCard from '../DashboardCard';
import { FaRegFileAlt } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FaArrowTrendUp } from 'react-icons/fa6';
import Courses from '@/components/ui/Courses';
import Assignments from '@/components/assignments/Assignments';
import Link from 'next/link';
import Loading from '@/components/ui/loading';
import { useCourses } from '@/hooks/courses/useCourses';
import useAssignments from '@/hooks/assignment/useAssignments';

function TraineeDashBoard() {
  const { courses, isFetching: coursesLoading } = useCourses({ limit: 3 });

  const { assignments, isLoading: assignmentsLoading } = useAssignments({
    filters: {
      search: '',
      statusFilter: 'ALL',
    },
    page: 1,
  });

  if (coursesLoading || assignmentsLoading) {
    return <Loading text="Dashboard Data" />;
  }

  const totalCourses = courses.length;

  const pendingAssignments = assignments.filter(a => !a.submission).length;

  const completedAssignments = assignments.filter(a => a.submission?.status === 'GRADED').length;

  const avgScore =
    assignments.reduce((acc, a) => {
      if (a.submission?.score != null) {
        return acc + a.submission.score;
      }
      return acc;
    }, 0) / (assignments.length || 1);
  console.log(assignments);

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
                value={avgScore}
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
              href="/app/courses"
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
            >
              View all
            </Link>
          </div>
          <div className="px-5 sm:px-6 pb-6">
            <Courses btnText="Continue Learning" courses={courses ?? []} />
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
              href="/app/assignments"
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
