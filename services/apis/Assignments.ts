export type AssignmentType = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Submitted';
  maxScore: number;
};

const assignments: AssignmentType[] = [
  {
    id: 'a1',
    courseId: 'c1',
    title: 'React Mini Project',
    description: 'Build a todo app',
    dueDate: 'Apr 15, 2026',
    status: 'Pending',
    maxScore: 100,
  },
  {
    id: 'a2',
    courseId: 'c2',
    title: 'Next.js Blog',
    description: 'Create blog app',
    dueDate: 'Apr 18, 2026',
    status: 'Pending',
    maxScore: 100,
  },
  {
    id: 'a3',
    courseId: 'c3',
    title: 'TS Practice',
    description: 'Write typed functions',
    dueDate: 'Apr 12, 2026',
    status: 'Submitted',
    maxScore: 100,
  },
  {
    id: 'a4',
    courseId: 'c4',
    title: 'REST API',
    description: 'Build CRUD API',
    dueDate: 'Apr 20, 2026',
    status: 'Pending',
    maxScore: 100,
  },
  {
    id: 'a5',
    courseId: 'c5',
    title: 'Design Case Study',
    description: 'Create UI case study',
    dueDate: 'Apr 25, 2026',
    status: 'Pending',
    maxScore: 100,
  },
];

export const getAllAssignments = (): AssignmentType[] => {
  return assignments;
};

export const getAssignmentById = (id: string) => assignments.find(a => a.id === id);

export const getAssignmentsByCourse = (courseId: string) => {
  return assignments.filter(a => a.courseId === courseId);
};
