import getStatusColor from '@/utils/getStatusColor';
import Link from 'next/link';
import React from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { HiArrowTopRightOnSquare } from 'react-icons/hi2';
import CustomPagination from '../ui/CustomPagination';
import { PaginationDataType } from '@/types/types';
import { DEFAULT_PAGINATION_DATA } from '@/utils/constant';

type Submission = {
  id: string;
  status: string;
  file: {
    id: string;
    url: string;
    public_id: string;
  } | null;
  githubLink: string | null;
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

const SubmissionsTable: React.FC<{
  getNextPage: () => void;
  getPreviousPage: () => void;
  submissions: Submission[];
  showMentorColumn?: boolean;
  isFetching?: boolean;
  paginationData: PaginationDataType;
}> = ({
  getNextPage,
  getPreviousPage,
  submissions,
  showMentorColumn = true,
  isFetching,
  paginationData = DEFAULT_PAGINATION_DATA,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <table className={`w-full text-sm ${isFetching && 'animate-pulse'}`}>
        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900 backdrop-blur z-10">
          <tr className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide">
            <th className="p-4 text-left">Student</th>
            {showMentorColumn && <th className="p-4 text-left">Mentor</th>}
            <th className="p-4 text-left">Course</th>
            <th className="p-4 text-left">Assignment</th>
            <th className="p-4 text-left">Score</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Submitted</th>
            <th className="p-4 text-center">Actions</th>
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

                {showMentorColumn && (
                  <td className="p-4 text-gray-600 dark:text-gray-400">{s.student.mentorName}</td>
                )}

                <td className="p-4 text-gray-700 dark:text-gray-300">{s.course.title}</td>

                <td className="p-4 text-gray-700 dark:text-gray-300">{s.assignment.title}</td>

                <td className="p-4">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {s.score !== null ? s.score : '-'}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      s.status
                    )}`}
                  >
                    {s.status}
                  </span>
                </td>

                <td className="p-4 text-gray-500 dark:text-gray-400 text-xs">
                  {new Date(s.submittedAt).toLocaleString()}
                </td>
                <td className="flex justify-center items-center gap-2 p-2">
                  <div>
                    {s.file ? (
                      <a
                        href={s.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-150"
                        title="View submitted file"
                      >
                        <HiArrowTopRightOnSquare className="text-sm" />
                        File
                      </a>
                    ) : s.githubLink ? (
                      <a
                        href={s.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-150"
                        title="Open GitHub repository"
                      >
                        <HiArrowTopRightOnSquare className="text-sm" />
                        GitHub
                      </a>
                    ) : null}
                  </div>

                  <div>
                    <Link
                      href={`/app/review-submission/${s.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    >
                      Details
                      <HiArrowRight className="text-xs" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          )}

          <tr className="border-t border-gray-200 dark:border-gray-800">
            <td colSpan={8} className="p-2 text-center text-gray-500 dark:text-gray-400">
              <div className="flex justify-end">
                <CustomPagination
                  paginationData={paginationData}
                  getNextPage={getNextPage}
                  getPreviousPage={getPreviousPage}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsTable;
