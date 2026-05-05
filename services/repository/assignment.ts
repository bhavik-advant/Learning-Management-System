import { prisma } from '@/utils/prisma-client';

export const createAssignment = async ({
  title,
  description,
  maxScore,
  moduleId,
  userId,
}: {
  title: string;
  description: string;
  maxScore: number;
  moduleId: string;
  userId: string;
}) => {
  const createdAssignment = await prisma.assignment.create({
    data: { title, description, maxScore, moduleId, createdById: userId },
  });

  return createdAssignment;
};

export const getAssignmentById = async ({ assignmentId }: { assignmentId: string }) => {
  const lessonDetails = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: {
      id: true,
      title: true,
      description: true,
      dueDate: true,
      maxScore: true,
    },
  });

  return lessonDetails;
};

export const deleteAssignment = async ({ assignmentId }: { assignmentId: string }) => {
  const deletedAssignment = await prisma.assignment.delete({
    where: { id: assignmentId },
  });

  return deletedAssignment;
};

export const updateAssignment = async ({
  assignmentId,
  data,
}: {
  assignmentId: string;
  data: {
    title?: string;
    description?: string;
    maxScore?: number;
    dueDate?: Date | null;
  };
}) => {
  const updatedAssignment = await prisma.assignment.update({
    where: { id: assignmentId },
    data,
    select: {
      id: true,
      title: true,
      description: true,
      dueDate: true,
      maxScore: true,
      moduleId: true,
    },
  });

  return updatedAssignment;
};

export const getAssignmentsWithSubmissions = async (userId: string, role: string) => {
  const isAdmin = role === 'ADMIN';

  const whereCondition = isAdmin
    ? {}
    : {
        module: {
          course: {
            enrollments: {
              some: {
                studentId: userId,
              },
            },
          },
        },
      };

  const assignments = await prisma.assignment.findMany({
    where: whereCondition,
    select: {
      id: true,
      title: true,
      description: true,
      dueDate: true,
      maxScore: true,
      createdAt: true,

      module: {
        select: {
          title: true,
          course: {
            select: {
              title: true,
            },
          },
        },
      },

      submissions: {
        select: {
          id: true,
          studentId: true,
          score: true,
          status: true,
          submittedAt: true,
        },
        orderBy: {
          submittedAt: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formatted = assignments.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description,
    dueDate: a.dueDate,
    maxScore: a.maxScore,
    moduleTitle: a.module.title,
    courseTitle: a.module.course.title,

    submission: isAdmin ? a.submissions : (a.submissions[0] ?? null),
  }));

  return formatted;
};
