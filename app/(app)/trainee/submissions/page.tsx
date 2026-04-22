'use client';
import AssignmentCards from '@/components/assignments/AssignmentCards';
import Submissions from '@/components/submissions/Submissions';
import { getSubmissionsByTrainee, SubmissionType } from '@/services/apis/submissions';
import { useQuery } from '@tanstack/react-query';

import { FaRegFileAlt } from 'react-icons/fa';

export default function SubmissionsPage() {
  const { data: submission = [], isLoading } = useQuery<SubmissionType[]>({
    queryKey: ['submission'],
    queryFn: getSubmissionsByTrainee,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          Loading Submissions...
        </div>
      </div>
    );
  }

  // console.log(submission);
  const total = submission.length;

  const pending = submission.filter(s => s.status === 'PENDING').length;

  const completed = submission.filter(s => s.status === 'GRADED').length;

  return (
    <section className="mx-8 space-y-5 mt-5">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Submissions</h1>
        <p>Explore and Submit Submissions</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <AssignmentCards
          title="Total Submissions"
          value={total}
          icon={<FaRegFileAlt className="text-blue-700" />}
        />
        <AssignmentCards
          title="Pending"
          value={pending}
          icon={<FaRegFileAlt className="text-orange-700" />}
        />
        <AssignmentCards
          title="Completed"
          value={completed}
          icon={<FaRegFileAlt className="text-green-800" />}
        />
      </div>
      <div>
        <Submissions submissions={submission} />
      </div>
    </section>
  );
}
