'use client';

import { use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssignmentById } from '@/services/apis/Assignments';
import { getSubmissionsByAssignment, submitAssignment } from '@/services/apis/submissions';

import AssignmentCards from '@/components/assignments/AssignmentCards';
import StatusBadge from '@/components/assignments/StatusBadge';
import SubmissionHistory from '@/components/submissions/SubmissionHistory';

import { BiCalendar } from 'react-icons/bi';
import { FaRegFileAlt } from 'react-icons/fa';
import { LuFileBadge } from 'react-icons/lu';
import Link from 'next/link';

type Params = {
  assignmentId: string;
};

type Props = {
  params: Promise<Params>;
};

type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  status: 'pending' | 'submitted' | 'graded';
};

type Submission = {
  id: string;
  fileUrl: string;
  score?: number;
  submittedAt: string;
};

export default function AssignmentDetailsPage({ params }: Props) {
  const { assignmentId } = use(params);
  const queryClient = useQueryClient();

  const { data: assignment, isLoading: isAssignmentLoading } = useQuery<Assignment>({
    queryKey: ['assignment', assignmentId],
    queryFn: () => getAssignmentById(assignmentId),
  });

  const { data: submissions = [], isLoading: isSubmissionsLoading } = useQuery<Submission[]>({
    queryKey: ['submissions', assignmentId],
    queryFn: () => getSubmissionsByAssignment(assignmentId),
  });

  const mutation = useMutation({
    mutationFn: (formData: FormData) => submitAssignment(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', assignmentId] });
      queryClient.invalidateQueries({ queryKey: ['assignment', assignmentId] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('assignmentId', assignmentId);
    formData.append('file', file);

    mutation.mutate(formData);
  };

  if (isAssignmentLoading) return <div>Loading...</div>;

  if (!assignment) return <div>Assignment not found</div>;

  return (
    <section className="mx-8 mt-5 space-y-5">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{assignment.title}</h1>
        <Link href="./">Back</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <AssignmentCards title="Due Date" value={assignment.dueDate} icon={<BiCalendar />} />

        <AssignmentCards title="Max Score" value={assignment.maxScore} icon={<LuFileBadge />} />

        <AssignmentCards
          title="Status"
          value={<StatusBadge status={assignment.status} />}
          icon={<FaRegFileAlt />}
        />
      </div>

      <div className="p-5 border rounded-xl">
        <h2 className="font-semibold">Description</h2>
        <p>{assignment.description}</p>
      </div>

      <div className="p-5 border rounded-xl space-y-3">
        <h2 className="font-semibold">Submit Assignment</h2>

        <input
          type="file"
          accept=".pdf,.zip,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="text-sm"
          disabled={mutation.isPending}
        />

        {mutation.isPending && <p className="text-sm text-gray-500">Uploading...</p>}
      </div>

      <SubmissionHistory submissions={submissions} maxScore={assignment.maxScore} />
    </section>
  );
}
