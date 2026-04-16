'use client'
import { BiBook } from 'react-icons/bi';
import DashBoardCard from './DashboardCard';
import { PiStudent } from 'react-icons/pi';
import { IoDocumentTextOutline } from 'react-icons/io5';
import Courses from '@/components/ui/Courses';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '@/services/apis/courses';

function MentorDashBoard() {
  const { data, isPending } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  return (
    <div className="mx-8 space-y-5">
      <section className="mt-8 space-y-5 ">
        <div>
          <h2 className="text-3xl font-bold">Mentor DashBoard</h2>
          <p>Manage your courses and review student submissions</p>
        </div>

        <div className="grid md:grid-cols-3  gap-4">
          <DashBoardCard title="Course Created" value={0} icon={<BiBook className="text-5xl " />} />
          <DashBoardCard
            title="Total Students"
            value={0}
            icon={<PiStudent className="text-5xl " />}
          />
          <DashBoardCard
            title="Pending Review"
            value={0}
            icon={<IoDocumentTextOutline className="text-5xl " />}
          />
        </div>
      </section>

      
      <section>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Your Courses</h2>
          <p className="text-blue-500">View all</p>
        </div>
        {isPending ? <p>Fetching Courses</p> : 
        <Courses btnText="Manage Course" courses={data} />}
      </section>
    </div>
  );
}

export default MentorDashBoard;
