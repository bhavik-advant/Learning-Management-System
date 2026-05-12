import { AssignmentFilter } from '@/types/types';
import { sendRequest } from '@/utils/sendRequest';
import axios from 'axios';

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
  const response = await sendRequest(
    `/api/course/${courseId}/module/${moduleId}/assignment`,
    'post',
    JSON.stringify({ title, description, maxScore })
  );

  return response.data;
};

export const getTraineeAssignments = async ({
  search = '',
  statusFilter = 'ALL',
  page = 1,
}: AssignmentFilter & { page: number }) => {
  const response = await sendRequest(
    `/api/assignments?search=${search}&filter=${statusFilter}&page=${page}`
  );

  return response.data;
};

export const submitAssignment = async (formData: FormData) => {
  const response = await sendRequest('/api/assignments/submit', 'post', formData);
  return response.data;
};

export const getAssignmentById = async (id: string) => {
  const response = await sendRequest(`/api/assignments/${id}`);
  return response.data;
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
  const response = await sendRequest(
    `/api/course/${courseId}/module/${moduleId}/assignment/${assignmentId}`,
    'patch',
    JSON.stringify({ title, description, maxScore })
  );
  return response.data;
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
  const response = await sendRequest(
    `/api/course/${courseId}/module/${moduleId}/assignment/${assignmentId}`,
    'delete'
  );
  return response.data;
};
