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

export const submissions: SubmissionType[] = [
  {
    id: 's1',
    fileId: 'file_101',
    feedback: 'Good implementation, improve UI.',
    isActive: true,
    submittedAt: '2026-04-10T10:00:00Z',
    assignmentId: 'a1', // React Mini Project
    studentId: 'stu1',
  },
  {
    id: 's2',
    fileId: 'file_102',
    score: 92,
    feedback: 'Excellent work, clean code.',
    isActive: true,
    submittedAt: '2026-04-14T14:30:00Z',
    assignmentId: 'a1',
    studentId: 'stu2',
  },
  {
    id: 's3',
    fileId: 'file_103',
    score: 78,
    feedback: 'Functionality is correct but needs optimization.',
    isActive: true,
    submittedAt: '2026-04-16T09:20:00Z',
    assignmentId: 'a2', // Next.js Blog
    studentId: 'stu1',
  },
  {
    id: 's4',
    fileId: 'file_104',
    score: 88,
    feedback: 'Nice blog design and routing.',
    isActive: true,
    submittedAt: '2026-04-17T18:45:00Z',
    assignmentId: 'a2',
    studentId: 'stu3',
  },
  {
    id: 's5',
    fileId: 'file_105',
    score: 95,
    feedback: 'Perfect TypeScript usage.',
    isActive: true,
    submittedAt: '2026-04-11T12:10:00Z',
    assignmentId: 'a3', // TS Practice (already submitted)
    studentId: 'stu2',
  },
  {
    id: 's6',
    fileId: 'file_106',
    score: 70,
    feedback: 'API works but lacks validation.',
    isActive: true,
    submittedAt: '2026-04-19T16:00:00Z',
    assignmentId: 'a4', // REST API
    studentId: 'stu1',
  },
  {
    id: 's7',
    fileId: 'file_107',
    score: 82,
    feedback: 'Good API structure, add error handling.',
    isActive: true,
    submittedAt: '2026-04-19T17:30:00Z',
    assignmentId: 'a4',
    studentId: 'stu3',
  },
  {
    id: 's8',
    fileId: 'file_108',
    score: 90,
    feedback: 'Great UI/UX thinking and presentation.',
    isActive: true,
    submittedAt: '2026-04-24T11:15:00Z',
    assignmentId: 'a5', // Design Case Study
    studentId: 'stu2',
  },
];

export const getSubmissionsByAssignment = (assignmentId: string) => {
  return submissions.filter(s => s.assignmentId === assignmentId);
};

export const getSubmissionsByStudent = (studentId: string) => {
  return submissions.filter(s => s.studentId === studentId);
};

export const getSubmission = (assignmentId: string, studentId: string) => {
  return submissions.find(s => s.assignmentId === assignmentId && s.studentId === studentId);
};
