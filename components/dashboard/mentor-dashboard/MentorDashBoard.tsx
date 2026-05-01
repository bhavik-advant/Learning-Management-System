'use client';
import { BiBook } from 'react-icons/bi';
import DashBoardCard from './DashboardCard';
import { PiStudent } from 'react-icons/pi';
import { IoDocumentTextOutline } from 'react-icons/io5';
import Courses from '@/components/ui/Courses';
import { useCourses } from '@/hooks/courses/useCourses';
import Loading from '@/components/ui/loading';

function MentorDashBoard() {
  const { courses, isFetching } = useCourses(3);

  if (isFetching) {
    return <Loading text="Fetching Courses" />;
  }

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
          <DashBoardCard title="Course Created" value={0} icon={<BiBook />} />
          <DashBoardCard title="Total Students" value={0} icon={<PiStudent />} />
          <DashBoardCard title="Pending Review" value={0} icon={<IoDocumentTextOutline />} />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold md:text-3xl">Your Courses</h2>
          <p className="text-sm font-medium text-blue-500">View all</p>
        </div>
        {isFetching ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-14 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <p className="text-lg font-medium">Fetching Courses...</p>
          </div>
        ) : (
          <Courses btnText="Manage Course" courses={courses || []} />
        )}
      </section>
    </div>
  );
}

export default MentorDashBoard;
