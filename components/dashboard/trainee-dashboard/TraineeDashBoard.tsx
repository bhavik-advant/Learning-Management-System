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
    <div className="mx-8 space-y-5">
      <section className="mt-8 space-y-5">
        <div>
          <h2 className="text-3xl font-bold">Trainee Dashboard</h2>
          <p>Here’s an overview of your learning progress</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
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

      <section>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Your Courses</h2>
          <p className="text-blue-500 cursor-pointer">View all</p>
        </div>
        <Courses btnText="Continue Learning" courses={courses} />
      </section>

      <section>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Assignments</h2>
          <p className="text-blue-500 cursor-pointer">View all</p>
        </div>

        <Assignments assignments={assignments} />
      </section>
    </div>
  );
}

export default TraineeDashBoard;
