'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import Loading from '@/components/ui/loading';
import useMyTraineeSubmissions from '@/hooks/submission/useMyTraineeSubmissions';

const ReviewAssignment = () => {
  const { submissions, error, isError, isPending } = useMyTraineeSubmissions();

  if (isPending) {
    return <Loading text="Submissions" />;
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-600">
        {error?.message || ' Failed to fetch submissions'}
      </div>
    );
  }

  return (
    <div className="mx-auto mt-2 w-full max-w-8xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Submissions</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Review trainee submissions and assign scores.
          </p>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{submissions.length} total</div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <Table className="w-full">
          <TableHeader className="bg-gray-50 dark:bg-gray-900">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
                Student
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
                Course
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
                Assignment
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
                Status
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
                Score
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
                Submitted
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length > 0 ? (
              submissions.map(submissionItem => (
                <TableRow
                  key={submissionItem.id}
                  className="odd:bg-white even:bg-gray-50/50 dark:odd:bg-gray-950 dark:even:bg-gray-900/40"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    {submissionItem.student.name}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {submissionItem.course.title}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {submissionItem.assignment.title}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        submissionItem.status === 'GRADED'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : submissionItem.status === 'RESUBMITTED'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}
                    >
                      {submissionItem.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    {submissionItem.score ?? '-'} / {submissionItem.maxScore}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {new Date(submissionItem.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Link
                      className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                      href={`/app/review-submission/${submissionItem.id}`}
                    >
                      {submissionItem.score !== null ? 'View' : 'Review'}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-10">
                  No submissions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReviewAssignment;
