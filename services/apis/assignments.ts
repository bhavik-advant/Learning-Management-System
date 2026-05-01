export type AssignmentType = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Submitted';
  maxScore: number;
  submissions: Submission[];
  moduleTitle?: string;
  courseTitle?: string;
};

type Submission = {
  id: string;
  fileUrl: string;
  score?: number | null;
  feedback?: string | null;
  status: 'PENDING' | 'SUBMITTED' | 'RESUBMITTED' | 'GRADED';
  submittedAt: string;
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
  const response = await fetch(`/api/course/${courseId}/module/${moduleId}/assignment`, {
    method: 'POST',
    body: JSON.stringify({ title, description, maxScore }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.log(response);
    throw new Error('Failed to create assignment');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to create assignment');
  }

  return result.data;
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

export const editAssignment = async ({
  assignmentId,
  courseId,
  moduleId,
  title,
  description,
  maxScore,
}: {
  assignmentId: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  maxScore: number;
}) => {
  const response = await fetch(
    `/api/course/${courseId}/module/${moduleId}/assignment/${assignmentId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ title, description, maxScore }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    console.log(response);
    throw new Error('Failed to edit assignment');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to edit assignment');
  }

  return result.data;
};

export const deleteAssignment = async ({
  assignmentId,
  courseId,
  moduleId,
}: {
  assignmentId: string;
  courseId: string;
  moduleId: string;
}) => {
  const response = await fetch(
    `/api/course/${courseId}/module/${moduleId}/assignment/${assignmentId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    console.log(response);
    throw new Error('Failed to edit assignment');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to edit assignment');
  }

  return result.data;
};
