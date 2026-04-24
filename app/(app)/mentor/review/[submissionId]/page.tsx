'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getSubmissionById, SubmissionType } from '@/services/apis/submissions';
import Link from 'next/link';
import FeedbackSection from '@/components/submissions/FeedbackSection';
import queryClient from '@/utils/query-client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Loading from '@/components/ui/loading';
import { BiRightArrowAlt } from 'react-icons/bi';

const SubmissionReviewPage = () => {
  const params = useParams();
  const submissionId = params.submissionId as string;

  const {
    data: submission,
    isPending: loading,
    error,
  } = useQuery<SubmissionType>({
    queryKey: ['submission', submissionId],
    queryFn: () => getSubmissionById(submissionId),
    enabled: !!submissionId,
  });

  if (loading) {
    return <Loading text="Submission" />;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Failed to fetch submission data. Please try again.
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="p-8 text-center">
        <p>Submission not found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GRADED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'RESUBMITTED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl flex font-bold mb-8">
        <span className="flex items-center">
          <Link href="./"> Review</Link> <BiRightArrowAlt />
        </span>{' '}
        {submission.assignment.title}
      </h1>

      <div className="space-y-4">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Assignment Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Course</p>
                <p className="font-medium text-lg">{submission.assignment.module.course.title}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Module</p>
                <p className="font-medium text-lg">{submission.assignment.module.title}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Assignment</p>
                <p className="font-medium text-lg">{submission.assignment.title}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Description</p>
                <p className="text-base">{submission.assignment.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Student Information</h2>
            <div className="flex items-center gap-6">
              {submission.student.image && (
                <Avatar>
                  <AvatarImage
                    src={submission.student.image}
                    alt={submission.student.username}
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                </Avatar>
              )}
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Name</p>
                <p className="font-medium text-lg">{submission.student.username}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Email</p>
                <p className="font-medium">{submission.student.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Submission Status</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(submission.status)}`}
                >
                  {submission.status}
                </span>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Score</p>
                <p className="font-medium text-lg">
                  {submission.score !== null && submission.score !== undefined
                    ? `${submission.score} / ${submission.assignment.maxScore}`
                    : 'Not graded yet'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Submitted On</p>
                <p className="font-medium text-lg">
                  {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Submitted File</h2>
            <Link
              href={submission.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              View Submission
            </Link>
          </CardContent>
        </Card>

        <div className="mb-6">
          <FeedbackSection
            score={submission.score || null}
            feedback={submission.feedback}
            submissionId={submission.id}
            maxScore={submission.assignment.maxScore}
            onFeedbackSubmitted={() => {
              queryClient.invalidateQueries({ queryKey: ['submission', submissionId] });
            }}
          />
        </div>

        {submission.status === 'PENDING' && (
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Grade Submission</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Use the admin panel or API to grade this submission.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SubmissionReviewPage;
