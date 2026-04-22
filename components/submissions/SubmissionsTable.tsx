// components/submissions/SubmissionsTable.tsx

import Link from 'next/link';
import React from 'react';

type Submission = {
  id: string;
  status: string;
  fileUrl: string;
  score: number | null;
  submittedAt: string;
  student: {
    name: string;
    mentorName: string;
  };
  assignment: {
    title: string;
  };
  course: {
    title: string;
  };
};

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'graded':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'late':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }
};

const SubmissionsTable: React.FC<{ submissions: Submission[] }> = ({ submissions }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900 backdrop-blur z-10">
          <tr className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide">
            <th className="p-4 text-left">Student</th>
            <th className="p-4 text-left">Mentor</th>
            <th className="p-4 text-left">Course</th>
            <th className="p-4 text-left">Assignment</th>
            <th className="p-4 text-left">Score</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Submitted</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {submissions.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">
                No submissions found
              </td>
            </tr>
          ) : (
            submissions.map((s, index) => (
              <tr
                key={s.id}
                className={`
                  border-t border-gray-200 dark:border-gray-800
                  ${index % 2 === 0 ? 'bg-white dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-900'}
                  hover:bg-gray-100 dark:hover:bg-gray-800 transition
                `}
              >
                <td className="p-4">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {s.student.name}
                  </div>
                </td>

                <td className="p-4 text-gray-600 dark:text-gray-400">{s.student.mentorName}</td>

                {/* <td className="p-4 text-gray-700 dark:text-gray-300">{s.course.title}</td> */}

                <td className="p-4 text-gray-700 dark:text-gray-300">{s.assignment.title}</td>

                <td className="p-4">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {s.score !== null ? s.score : '-'}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                      s.status
                    )}`}
                  >
                    {s.status}
                  </span>
                </td>

                <td className="p-4 text-gray-500 dark:text-gray-400 text-xs">
                  {new Date(s.submittedAt).toLocaleString()}
                </td>
                <td className=" text-blue-600 dark:text-blue-400 text-sm hover:underline">
                  <Link href={`${s.fileUrl}`}>View File</Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsTable;
