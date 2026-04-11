'use client';
import type { AssignmentType } from '@/services/apis/Assignments';
import AssignmentActionButton from './AssignmentActionButton';
import StatusBadge from './StatusBadge';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Assignments: React.FC<{ assignments: AssignmentType[] }> = ({ assignments }) => {
  const isOverdue = (date: string) => new Date(date) < new Date();

  function handleSubmit(id: unknown) {
    redirect(`assignments/${id}`);
  }

  return (
    <div className="w-full overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700 my-5 shadow-sm bg-white/70 dark:bg-gray-900/60 backdrop-blur">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100/70 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-6 py-3 font-medium">Assignment</th>
            <th className="px-6 py-3 font-medium">Due Date</th>
            <th className="px-6 py-3 font-medium">Max Score</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map(item => (
            <tr
              key={item.id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50/70 dark:hover:bg-gray-800/60 transition"
            >
              <td className="px-6 py-4">
                <Link href={`assignments/${item.id}`} className="hover:underline">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </Link>
              </td>

              <td
                className={`px-6 py-4 ${
                  isOverdue(item.dueDate) && item.status !== 'Submitted'
                    ? 'text-red-500 font-medium'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {item.dueDate}
              </td>

              <td className="px-6 py-4">
                <p className="font-medium">{item.maxScore}</p>
              </td>

              <td className="px-6 py-4">
                <StatusBadge status={item.status} />
              </td>

              <td className="px-6 py-4 text-right">
                <AssignmentActionButton
                  status={item.status}
                  onSubmit={() => handleSubmit(item.id)}
                  // onView={() => console.log('View', item.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {assignments.length === 0 && (
        <div className="text-center py-12 text-gray-500">No assignments yet 📭</div>
      )}
    </div>
  );
};

export default Assignments;
