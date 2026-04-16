'use client';
import { BiBook } from 'react-icons/bi';
import DashBoardCard from './DashboardCard';
import { PiStudent } from 'react-icons/pi';
import { IoDocumentTextOutline } from 'react-icons/io5';
import Courses from '@/components/ui/Courses';
import { useQuery } from '@tanstack/react-query';
import { getDashBoardData } from '@/services/apis/dashboard';

// type dashboardData = {
//   id: string;
//   title: string;
//   description: string;
//   thumbnail: string;
//   author: string;
// };

function MentorDashBoard() {
  const {
    data: dashboardData = {
      courses: [],
      stats: {
        courses: 0,
        students: 0,
        pendingReviews: 0,
      },
    },
    isPending,
  } = useQuery<{
    courses: [];
    stats: {
      courses: number;
      students: number;
      pendingReviews: number;
    };
  }>({
    queryKey: ['courses'],
    queryFn: getDashBoardData,
  });

  return (
    <div className="mx-4 space-y-8 pb-8 md:mx-8">
      <section className="space-y-5 pt-6 md:pt-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Mentor Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your courses and review student submissions
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DashBoardCard
            title="Course Created"
            value={dashboardData?.stats.courses || 0}
            icon={<BiBook />}
          />
          <DashBoardCard
            title="Total Students"
            value={dashboardData?.stats.students || 0}
            icon={<PiStudent />}
          />
          <DashBoardCard
            title="Pending Review"
            value={dashboardData?.stats.pendingReviews || 0}
            icon={<IoDocumentTextOutline />}
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold md:text-3xl">Your Courses</h2>
          <p className="text-sm font-medium text-blue-500">View all</p>
        </div>
        {isPending ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-14 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <p className="text-lg font-medium">Fetching Courses...</p>
          </div>
        ) : (
          <Courses btnText="Manage Course" courses={dashboardData.courses} />
        )}
      </section>
    </div>
  );
}

export default MentorDashBoard;
