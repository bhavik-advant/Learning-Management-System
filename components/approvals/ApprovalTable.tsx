'use client';

import React from 'react';
import Image from 'next/image';

type CourseType = {
  id: string;
  title: string;
  description: string;
  mentor: string;
  submittedAt: string;
  modules: number;
  lessons: number;
  image: string;
};

const courses: CourseType[] = [
  {
    id: '1',
    title: 'Data Science with Python',
    description: 'Complete guide to data science and analytics',
    mentor: 'Dr. Sarah Johnson',
    submittedAt: '10/03/2024',
    modules: 10,
    lessons: 58,
    image: '/course.jpg',
  },
];

export default function ApprovalTable() {
  return (
    <div className="w-full overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700 my-5 shadow-sm bg-white/70 dark:bg-gray-900/60 backdrop-blur">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100/70 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-6 py-3 font-medium">Course</th>
            <th className="px-6 py-3 font-medium">Mentor</th>
            <th className="px-6 py-3 font-medium">Submitted</th>
            <th className="px-6 py-3 font-medium">Content</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map(course => (
            <tr
              key={course.id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50/70 dark:hover:bg-gray-800/60 transition"
            >
              <td className="px-6 py-4 flex items-center gap-4">
                <div className="w-14 h-14 relative rounded-lg overflow-hidden">
                  <Image src={course.image} alt={course.title} fill className="object-cover" />
                </div>

                <div>
                  <p className="font-semibold">{course.title}</p>
                  <p className="text-gray-500 text-sm">{course.description}</p>
                </div>
              </td>

              <td className="px-6 py-4">
                <p className="font-medium">{course.mentor}</p>
              </td>

              <td className="px-6 py-4">
                <p>{course.submittedAt}</p>
              </td>

              <td className="px-6 py-4">
                <p className="font-medium">{course.modules} modules</p>
                <p className="text-gray-500 text-sm">{course.lessons} lessons</p>
              </td>

              <td className="px-6 py-4 text-right space-x-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700 transition">
                  ✓ Approve
                </button>

                <button className="bg-gray-100 text-red-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition">
                  ✕ Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {courses.length === 0 && (
        <div className="text-center py-12 text-gray-500">No pending approvals</div>
      )}
    </div>
  );
}
