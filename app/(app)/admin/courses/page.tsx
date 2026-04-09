import Courses from '@/components/ui/Courses';
import { getAllCourses } from '@/services/apis/courses';
import React from 'react';

async function page() {
 const allCourses = getAllCourses();
  return (
    <div className="mx-8 space-y-5">
      <h2>Your Courses</h2>
      <Courses btnText="Manage Course" courses={allCourses} />
    </div>
  );
}

export default page;
