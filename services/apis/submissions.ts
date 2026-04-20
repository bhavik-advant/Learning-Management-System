export type SubmissionType = {
  id: string;
  fileId: string;
  score?: number;
  feedback: string;
  isActive: boolean;
  submittedAt: string;
  assignmentId: string;
  studentId: string;
};

export const getSubmissionsByAssignment = async (id: string) => {
  const res = await fetch(`/api/submission/${id}`);
  const data = await res.json();
  return data.data;
};

export const submitAssignment = async (formData: FormData) => {
  const res = await fetch(`/api/assignments/submit`, {
    method: 'POST',
    body: formData,
  });

  return res.json();
};
