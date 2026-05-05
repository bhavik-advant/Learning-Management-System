import { prisma } from '@/utils/prisma-client';

export const getAllSubmissionsForAdmin = async () => {
  return prisma.submission.findMany({
    orderBy: { submittedAt: 'desc' },
    include: {
      student: {
        select: {
          id: true,
          username: true,
          mentor: { select: { username: true } },
        },
      },
      assignment: {
        select: {
          id: true,
          title: true,
          module: {
            select: {
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const getSubmissionsForMentor = async (mentorId: string) => {
  return prisma.submission.findMany({
    where: {
      student: {
        mentorId: mentorId,
      },
      assignment: {
        module: {
          course: {
            enrollments: {
              some: {
                student: {
                  mentorId: mentorId,
                },
              },
            },
          },
        },
      },
    },
    include: {
      assignment: {
        select: {
          id: true,
          title: true,
          description: true,
          dueDate: true,
          maxScore: true,
          module: {
            select: {
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
      student: {
        select: {
          id: true,
          username: true,
          email: true,
          image: true,
          mentor: {
            select: {
              username: true,
            },
          },
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });
};

export type SubmissionEntity = {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrl: string | null;
  githubLink: string | null;
  score: number | null;
  status: 'PENDING' | 'GRADED' | 'RESUBMITTED';
  submittedAt: Date;
};

export const getSubmissionsByAssignmentAndStudent = async (
  assignmentId: string,
  studentId: string
): Promise<SubmissionEntity[]> => {
  return prisma.submission.findMany({
    where: {
      assignmentId,
      studentId,
    },
    orderBy: {
      submittedAt: 'desc',
    },
  });
};

export type StudentSubmissionWithAssignment = {
  id: string;
  fileUrl: string | null;
  githubLink: string | null;
  score: number | null;
  status: 'PENDING' | 'GRADED' | 'RESUBMITTED';
  submittedAt: Date;

  assignment: {
    id: string;
    title: string;
    maxScore: number;

    module: {
      course: {
        id: string;
        title: string;
      } | null;
    } | null;
  };
};

export const getStudentSubmissions = async (
  studentId: string
): Promise<StudentSubmissionWithAssignment[]> => {
  return prisma.submission.findMany({
    where: {
      studentId,
    },
    orderBy: {
      submittedAt: 'desc',
    },
    include: {
      assignment: {
        select: {
          id: true,
          title: true,
          maxScore: true,
          module: {
            select: {
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

type SubmissionDetails = {
  id: string;
  feedback: string | null;
  score: number | null;
  status: 'PENDING' | 'GRADED' | 'RESUBMITTED';
  gradedAt: Date | null;

  assignment: {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date | null;
    maxScore: number;

    module: {
      id: string;
      title: string;
      course: {
        id: string;
        title: string;
      } | null;
    } | null;
  };

  student: {
    id: string;
    username: string;
    email: string;
    image: string | null;
  };
};

export const getSubmissionMentorId = async (submissionId: string) => {
  return prisma.submission.findUnique({
    where: { id: submissionId },
    select: {
      student: {
        select: {
          mentorId: true,
        },
      },
    },
  });
};

export const getSubmissionById = async (
  submissionId: string
): Promise<SubmissionDetails | null> => {
  return prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      assignment: {
        select: {
          id: true,
          title: true,
          description: true,
          dueDate: true,
          maxScore: true,
          module: {
            select: {
              id: true,
              title: true,
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
      student: {
        select: {
          id: true,
          username: true,
          email: true,
          image: true,
        },
      },
    },
  });
};

export const updateSubmissionByMentor = async ({
  submissionId,
  feedback,
  score,
}: {
  submissionId: string;
  feedback?: string;
  score?: number;
}) => {
  return prisma.submission.update({
    where: { id: submissionId },
    data: {
      ...(feedback !== undefined && { feedback }),
      ...(score !== undefined && {
        score,
        status: 'GRADED',
        gradedAt: new Date(),
      }),
    },
    include: {
      assignment: {
        select: {
          id: true,
          title: true,
          description: true,
          dueDate: true,
          maxScore: true,
          module: {
            select: {
              id: true,
              title: true,
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
      student: {
        select: {
          id: true,
          username: true,
          email: true,
          image: true,
        },
      },
    },
  });
};
