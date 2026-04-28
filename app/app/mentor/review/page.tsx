'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllSubmissions } from '@/services/apis/submissions';
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
import { SubmissionStatus } from '@/generated/prisma/enums';

type submission = {
  assignment: { title: string };
  course: { title: string };
  fileUrl: string;
  id: string;
  score: number | null;
  maxScore: number;
  status: SubmissionStatus;
  student: { name: string; mentorName: string };
  submittedAt: string;
};

const ReviewAssignment = () => {
  const {
    data: submissions = [],
    isPending: loading,
    error,
  } = useQuery<submission[]>({
    queryKey: ['submissions'],
    queryFn: getAllSubmissions,
  });

  console.log(submissions);

  if (loading) {
    return <Loading text="Submissions" />;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Failed to fetch submissions</div>;
  }

  return (
    <div className="mx-4">
      <h2 className="text-2xl font-bold mb-6">All Submissions</h2>

      <Table className="border rounded-xl">
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Assignment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Submitted On</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length > 0 ? (
            submissions.map(submission => (
              <TableRow key={submission.id}>
                <TableCell>
                  <p className="font-medium">{submission.student.name}</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{submission.course.title}</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{submission.course.title}</p>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      submission.status === 'GRADED'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : submission.status === 'RESUBMITTED'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}
                  >
                    {submission.status}
                  </span>
                </TableCell>
                <TableCell>
                  <p className="font-medium">
                    {submission.score ?? '-'} / {submission.maxScore}
                  </p>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  {new Date(submission.submittedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  <Link href={`/mentor/review/${submission.id}`}>
                    {submission.score ? 'View' : 'Review'}
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                No submissions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReviewAssignment;
