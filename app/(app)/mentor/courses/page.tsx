import Courses from '@/components/ui/Courses';
import { getAllCourses } from '@/services/apis/courses';
import Link from 'next/link';

async function page() {
  const allCourses = getAllCourses();
  return (
    <div className="mx-8 space-y-5 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Your Courses</h2>
        <Link href="/add-course">
          <button className="bg-blue-500 text-white rounded-md px-2 py-1 ">+ Add Course</button>
        </Link>
      </div>
      <Courses btnText="Manage Course" courses={allCourses} />
    </div>
  );
}

export default page;
