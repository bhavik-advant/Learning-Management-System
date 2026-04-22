'use client';

import Link from 'next/link';
import { SubmissionType } from '@/services/apis/submissions';

const Submissions: React.FC<{ submissions: SubmissionType[] }> = ({ submissions }) => {
  return (
    <div className="w-full overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700 my-5 shadow-sm bg-white/70 dark:bg-gray-900/60 backdrop-blur">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100/70 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-6 py-3">Course</th>
            <th className="px-6 py-3">Assignment</th>
            <th className="px-6 py-3">Submitted On</th>
            <th className="px-6 py-3">Score</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">File</th>
          </tr>
        </thead>

        <tbody>
          {submissions.map(item => (
            <tr
              key={item.id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50/70 dark:hover:bg-gray-800/60 transition"
            >
              <td className="px-6 py-4 font-medium">{item.assignment.module.course.title}</td>

              <td className="px-6 py-4">
                <Link
                  href={`./assignments/${item.assignment.id}`}
                  className="hover:underline font-medium"
                >
                  {item.assignment.title}
                </Link>
              </td>

              <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                {new Date(item.submittedAt).toLocaleString()}
              </td>

              <td className="px-6 py-4">
                <span className="font-medium">
                  {item.score ?? '--'} / {item.assignment.maxScore}
                </span>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'GRADED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {item.status}
                </span>
              </td>

              <td className="px-6 py-4 text-right">
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View File
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {submissions.length === 0 && (
        <div className="text-center py-12 text-gray-500">No submissions yet</div>
      )}
    </div>
  );
};

export default Submissions;
