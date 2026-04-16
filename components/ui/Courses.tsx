import React from 'react';
import Course from './Course';

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  status: string;
  authorId: string;
  thumbnailId: string | null;
  createdAt: string;
  updatedAt: string;
  modulesCount: number;
};

const Courses: React.FC<{ courses: Course[]; btnText: string }> = ({ courses, btnText }) => {
  return (
    <section className="space-y-5 my-5 ">
      {courses.length === 0 ? (
        <div className=" overflow-hidden rounded-3xl border border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-950/30 backdrop-blur-xl">
          <div className=" flex flex-col items-center justify-center py-16 text-center text-gray-600 dark:text-gray-300 px-6">
            <div className="mb-4 grid place-items-center h-12 w-12 rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-gray-700 dark:text-gray-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M4 6.5C4 5.12 5.12 4 6.5 4H20v15.5c0 1.1-.9 2-2 2H6.5C5.12 21.5 4 20.38 4 19V6.5z" />
                <path d="M8 8h8" />
                <path d="M8 12h8" />
                <path d="M8 16h5" />
              </svg>
            </div>
            <p className="text-lg font-semibold">No courses found</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Once courses are added, they will appear here with quick actions and status.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <Course btnText={btnText} key={course.id} {...course} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Courses;
