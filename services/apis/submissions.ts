import { SubmissionStatus } from '@/generated/prisma/enums';

export type SubmissionType = {
  id: string;
  fileUrl: string;
  score?: number | null;
  feedback?: string | null;
  status: SubmissionStatus;
  isActive: boolean;
  submittedAt: string;
  gradedAt?: string | null;
  assignmentId: string;
  studentId: string;
  assignment: {
    id: string;
    title: string;
    description: string;
    dueDate?: string | null;
    maxScore: number;
    module: {
      id: string;
      title: string;
      course: {
        id: string;
        title: string;
      };
    };
  };
  student: {
    id: string;
    username: string;
    email: string;
    image: string;
  };
};

export const getAllSubmissions = async () => {
  const res = await fetch(`/api/submission`);
  const data = await res.json();
  return data.data;
};

export const getSubmissionsByAssignment = async (id: string) => {
  const res = await fetch(`/api/submission/${id}`);
  const data = await res.json();
  return data.data;
};

export const getSubmissionById = async (submissionId: string) => {
  const res = await fetch(`/api/submission/view/${submissionId}`);
  const data = await res.json();
  return data.data;
};

export const submitAssignment = async (formData: FormData) => {
  const res = await fetch(`/api/assignments/submit`, {
    method: 'POST',
    body: formData,
  });

  return await res.json();
};

export const updateFeedback = async ({
  feedback,
  score,
  submissionId,
}: {
  feedback: string;
  score: number | null;
  submissionId: string;
}) => {
  const response = await fetch(`/api/submission/view/${submissionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ feedback, score, submissionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to save feedback');
  }

  return response.json();
};

export const getSubmissionsByTrainee = async () => {
  const res = await fetch(`/api/submission/trainee`);
  const data = await res.json();
  return data.data;
};

// services/apis/submissions.ts

export const getAllSubmissionsAdmin = async () => {
  const res = await fetch('/api/admin/submissions', {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch submissions');
  }

  const result = await res.json();
  return result.data;
};
