'use client';

// import AssignmentActionButton from './AssignmentActionButton';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SubmissionType } from '@/services/apis/submissions';

const Submissions: React.FC<{ submissions: SubmissionType[] }> = ({ submissions }) => {
  // const isOverdue = (date: string) => new Date(date) < new Date();

  function handleSubmit(id: unknown) {
    redirect(`submissions/${id}`);
  }

  return (
    <div className="w-full overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700 my-5 shadow-sm bg-white/70 dark:bg-gray-900/60 backdrop-blur">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100/70 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-6 py-3 font-medium">Assignment</th>
            <th className="px-6 py-3 font-medium">Submitted On</th>
            <th className="px-6 py-3 font-medium">Score</th>
            <th className="px-6 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {submissions.map(item => (
            <tr
              key={item.id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50/70 dark:hover:bg-gray-800/60 transition"
            >
              <td className="px-6 py-4">
                <Link href={`assignments/${item.id}`} className="hover:underline">
                  <p className="font-medium">{item.assignmentId}</p>
                  {/* <p className="text-xs text-gray-500">{item.description}</p> */}
                </Link>
              </td>

              <td className={`px-6 py-4 text-gray-600 dark:text-gray-400`}>{item.submittedAt}</td>

              <td className="px-6 py-4">
                <p className="font-medium">{item?.score}</p>
              </td>

              <td className="px-6 py-4">{/* <StatusBadge status={item.status} /> */}</td>

              {/* <td className="px-6 py-4 text-right">
                <AssignmentActionButton
                  status={item.status}
                  onSubmit={() => handleSubmit(item.id)}
                  // onView={() => console.log('View', item.id)}
                />
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {submissions.length === 0 && (
        <div className="text-center py-12 text-gray-500">No submissions yet </div>
      )}
    </div>
  );
};

export default Submissions;
