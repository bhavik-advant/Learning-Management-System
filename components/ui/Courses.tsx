import React from 'react';
import Course from './Course';

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
};

const Courses: React.FC<{ courses: Course[], btnText : string }> = ({ courses,btnText }) => {
  return (
    <section className="space-y-5">
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
          <p className="text-lg font-medium">No courses found</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <Course btnText={btnText} key={course.id} {...course} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Courses;
