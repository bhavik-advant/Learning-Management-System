'use client';
import Courses from '@/components/ui/Courses';
import { fetchCourses } from '@/services/apis/courses';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
};

function Page() {
  const { data: course = [], isPending } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  if (isPending) {
    return <p>Loading</p>;
  }



  return (
    <div className="mx-8 space-y-5 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Your Courses</h2>
        <Link href="/add-course">
          <button className="bg-blue-500 text-white rounded-md px-2 py-1 ">+ Add Course</button>
        </Link>
      </div>
      <Courses btnText="Manage Course" courses={course} />
    </div>
  );
}

export default Page;
