'use client';

import { BiBook } from 'react-icons/bi';
import DashBoardCard from '../mentor-dashboard/DashboardCard';
import { FaRegFileAlt } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FaArrowTrendUp } from 'react-icons/fa6';
import Courses from '@/components/ui/Courses';
import { fetchCourses } from '@/services/apis/courses';
import { fetchAdminUsersWithStats } from '@/services/apis/users';
import Users from '@/components/users/UsersTable';
import { useQuery } from '@tanstack/react-query';

function AdminDashBoard() {
  const {
    data: courses = [],
    isLoading: coursesLoading,
    isError: coursesError,
  } = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: fetchCourses,
  });

  const {
    data: usersPayload,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchAdminUsersWithStats,
  });

  const loading = coursesLoading || usersLoading;
  const hasError = coursesError || usersError;
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
    <div className="mx-8 space-y-5">
      <section className="mt-8 space-y-5">
        <div>
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <p>Monitor and manage your LMS platform</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <DashBoardCard
            title="Total Users"
            value={usersPayload?.stats.totalUsers ?? 0}
            icon={<BiBook />}
          />
          <DashBoardCard
            title="Trainees"
            value={usersPayload?.stats.totalTrainees ?? 0}
            icon={<FaRegFileAlt />}
          />
          <DashBoardCard
            title="Mentors"
            value={usersPayload?.stats.totalMentors ?? 0}
            icon={<IoMdCheckmarkCircleOutline />}
          />
          <DashBoardCard
            title="Pending Course Approvals"
            value={usersPayload?.pendingCourseApprovals ?? 0}
            icon={<FaArrowTrendUp />}
          />
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Courses</h2>
          <p className="text-blue-500 cursor-pointer">View all</p>
        </div>
        <Courses btnText="Manage Course" courses={courses} />
      </section>
      <section>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Users</h2>
          <p className="text-blue-500 cursor-pointer">View all</p>
        </div>
        <Users users={usersPayload?.users ?? []} />
      </section>
    </div>
  );
}

export default AdminDashBoard;
