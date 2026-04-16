import { BiBook } from 'react-icons/bi';
import DashBoardCard from '../mentor-dashboard/DashboardCard';
import { FaRegFileAlt } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FaArrowTrendUp } from 'react-icons/fa6';
import Courses from '@/components/ui/Courses';
import { getAllCourses } from '@/services/apis/courses';
import Assignments from '@/components/assignments/Assignments';

import { getAllAssignments } from '@/services/apis/Assignments';
async function TraineeDashBoard() {
  const courses = await getAllCourses();
  const assignments = await getAllAssignments();

  return (
    <div className="mx-4 space-y-8 pb-8 md:mx-8">
      <section className="space-y-5 pt-6 md:pt-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Trainee Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Here’s an overview of your learning progress</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashBoardCard title="Course Enrolled" value={0} icon={<BiBook />} />
          <DashBoardCard title="Pending Assignments" value={0} icon={<FaRegFileAlt />} />
          <DashBoardCard
            title="Completed Assignments"
            value={0}
            icon={<IoMdCheckmarkCircleOutline />}
          />
          <DashBoardCard title="Average Score" value={0} icon={<FaArrowTrendUp />} />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold md:text-3xl">Your Courses</h2>
          <p className="cursor-pointer text-sm font-medium text-blue-500">View all</p>
        </div>
        <Courses btnText="Continue Learning" courses={courses} />
      </section>

      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold md:text-3xl">Assignments</h2>
          <p className="cursor-pointer text-sm font-medium text-blue-500">View all</p>
        </div>

        <Assignments assignments={assignments} />
      </section>
    </div>
  );
}

export default TraineeDashBoard;
