'use client';
import { BiBook } from 'react-icons/bi';
import DashBoardCard from '../mentor-dashboard/DashboardCard';
import { FaRegFileAlt } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FaArrowTrendUp } from 'react-icons/fa6';
import Courses from '@/components/ui/Courses';
import Assignments from '@/components/assignments/Assignments';
import { getAllAssignments } from '@/services/apis/Assignments';
import { useQuery } from '@tanstack/react-query';
import { getTraineeCourses } from '@/services/apis/courses';

function TraineeDashBoard() {
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['trainee-courses'],
    queryFn: getTraineeCourses,
  });

  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAllAssignments,
  });

  if (coursesLoading || assignmentsLoading) {
    return <div className="p-6">Loading...</div>;
  }

  const totalCourses = courses.length;

  const pendingAssignments =
    assignments?.filter((a: any) => a.submissions?.some((s: any) => s.status === 'PENDING'))
      .length || 0;

  const completedAssignments =
    assignments?.filter((a: any) => a.submissions?.some((s: any) => s.status === 'GRADED'))
      .length || 0;

  const avgScore =
    assignments?.reduce((acc: number, a: any) => {
      const scores = a.submissions?.filter((s: any) => s.score !== null) || [];

      if (!scores.length) return acc;

      const avg = scores.reduce((sum: number, s: any) => sum + s.score, 0) / scores.length;

      return acc + avg;
    }, 0) / (assignments.length || 1);

  return (
    <div className="mx-4 space-y-8 pb-8 md:mx-8">
      <section className="space-y-5 pt-6 md:pt-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Trainee Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here’s an overview of your learning progress
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashBoardCard title="Course Enrolled" value={totalCourses} icon={<BiBook />} />
          <DashBoardCard
            title="Pending Assignments"
            value={pendingAssignments}
            icon={<FaRegFileAlt />}
          />
          <DashBoardCard
            title="Completed Assignments"
            value={completedAssignments}
            icon={<IoMdCheckmarkCircleOutline />}
          />
          <DashBoardCard
            title="Average Score"
            value={Math.round(avgScore || 0)}
            icon={<FaArrowTrendUp />}
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold md:text-3xl">Your Courses</h2>
        </div>
        <Courses btnText="Continue Learning" courses={courses} />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold md:text-3xl">Assignments</h2>
        <Assignments assignments={assignments} />
      </section>
    </div>
  );
}

export default TraineeDashBoard;
