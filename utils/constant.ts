import { SubmissionStatus } from '@/types/types';

export const SUBMISSION_STATUS = ['PENDING', 'GRADED', 'RESUBMITTED'] as SubmissionStatus[];

export const DEFAULT_PAGINATION_DATA = {
  totalPages: 1,
  currentPage: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};
