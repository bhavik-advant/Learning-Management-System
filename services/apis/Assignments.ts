export type AssignmentType = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Submitted';
  maxScore: number;
  submissions: Submission[];
};
type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'GRADED';

type Submission = {
  id: string;
  SubmissionStatus: SubmissionStatus;
  score: number | null;
};

export const createAssignment = async ({
  courseId,
  moduleId,
  title,
  description,
  maxScore,
}: {
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  maxScore: number;
}) => {
  // console.log(moduleId);

  const response = await fetch(`/api/course/${courseId}/module/${moduleId}/assignment`, {
    method: 'POST',
    body: JSON.stringify({ title, description, maxScore }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // console.log(response);
    throw new Error('Failed to create assignment');
  }

  return await response.json();
};

export const getTraineeAssignments = async () => {
  const res = await fetch('/api/assignments');

  if (!res.ok) throw new Error('Failed');

  const data = await res.json();
  return data.data;
};

export const submitAssignment = async (formData: FormData) => {
  const res = await fetch('/api/assignments/submit', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Submission failed');

  return res.json();
};

export const getAssignmentById = async (id: string) => {
  const res = await fetch(`/api/assignments/${id}`);
  const data = await res.json();
  return data.data;
};
