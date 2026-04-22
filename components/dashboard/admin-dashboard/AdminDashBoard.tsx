'use client';

import { BiBook } from 'react-icons/bi';
import DashBoardCard from '../mentor-dashboard/DashboardCard';
import { FaRegFileAlt } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FaArrowTrendUp } from 'react-icons/fa6';
import Courses from '@/components/ui/Courses';
import Users from '@/components/users/UsersTable';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getAdminDashboard } from '@/services/apis/dashboard';

function AdminDashBoard() {
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getAdminDashboard,
  });

  if (isLoading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Loading dashboard…</p>;
  }

  if (isError || !dashboardData) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Could not load dashboard data. Please refresh the page.
      </p>
    );
  }

  return (
    <div className="mx-4 sm:mx-8 space-y-6 pb-10">
      <section className="mt-6 sm:mt-8">
        <div className="relative overflow-hidden rounded-3xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 backdrop-blur-xl shadow-sm">
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="inline-flex w-fit items-center rounded-full border border-gray-200/80 dark:border-gray-800 bg-white/60 dark:bg-gray-950/40 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                  Admin Console
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Admin Dashboard</h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Monitor growth, manage courses, and control access across the platform.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/approvals"
                  className="rounded-2xl bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                >
                  Review Approvals
                </Link>
                <Link
                  href="/admin/users"
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/30 px-4 py-2 text-sm font-medium hover:bg-white/80 dark:hover:bg-gray-950/50 transition"
                >
                  Manage Users
                </Link>
                <Link
                  href="/admin/courses"
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/30 px-4 py-2 text-sm font-medium hover:bg-white/80 dark:hover:bg-gray-950/50 transition"
                >
                  Manage Courses
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DashBoardCard
                title="Total Users"
                value={dashboardData.stats.totalUsers}
                icon={<BiBook className="text-[22px]" />}
              />
              <DashBoardCard
                title="Trainees"
                value={dashboardData.stats.totalTrainees}
                icon={<FaRegFileAlt className="text-[20px]" />}
              />
              <DashBoardCard
                title="Mentors"
                value={dashboardData.stats.totalMentors}
                icon={<IoMdCheckmarkCircleOutline className="text-[22px]" />}
              />
              <DashBoardCard
                title="Pending Approvals"
                value={dashboardData.pendingCourseApprovals}
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
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Latest Courses</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Recently created courses on the platform.
              </p>
            </div>
            <Link
              href="/admin/courses"
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="px-5 sm:px-6 pb-6">
            <Courses btnText="Manage Course" courses={dashboardData?.latestCourses ?? []} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-3xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Latest Users</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Recently joined users on the platform.
              </p>
            </div>
            <Link
              href="/admin/users"
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="px-5 sm:px-6 pb-6">
            <Users users={dashboardData?.latestUsers ?? []} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashBoard;
