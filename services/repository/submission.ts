import { prisma } from '@/utils/prisma-client';
import { FileType, SubmissionStatus } from '@/generated/prisma/enums';

export const getAllSubmissionsForAdmin = async () => {
  return prisma.submission.findMany({
    orderBy: { submittedAt: 'desc' },
    include: {
      file: true,
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
      file: true,
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

  fileId: string | null;

  file: {
    id: string;
    url: string;
    public_id: string;
    type: FileType;
  } | null;

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
    include: {
      file: true,
    },
    orderBy: {
      submittedAt: 'desc',
    },
  });
};

export type StudentSubmissionWithAssignment = {
  id: string;
  fileId: string | null;

  file: {
    id: string;
    url: string;
    public_id: string;
    type: FileType;
  } | null;
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

export const getStudentSubmissions = async ({
  studentId,
  search = '',
  status = 'ALL',
}: {
  studentId: string;
  search?: string;
  status?: SubmissionStatus | 'ALL';
}): Promise<StudentSubmissionWithAssignment[]> => {
  return prisma.submission.findMany({
    where: {
      studentId,
      assignment: {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      status: status === 'ALL' ? undefined : status,
    },
    orderBy: {
      submittedAt: 'desc',
    },
    include: {
      file: true,

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
  fileId: string | null;

  file: {
    id: string;
    url: string;
    public_id: string;
    type: FileType;
    size: number;
  } | null;

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
      file: true,

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
      file: true,

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

type CreateFilePayload = {
  url: string;
  public_id: string;
  size: number;
  uploadedBy: string;
  type: FileType;
};

export const createFile = async ({ url, public_id, size, uploadedBy, type }: CreateFilePayload) => {
  return prisma.file.create({
    data: {
      url,
      public_id,
      size,
      uploadedBy,
      type,
    },
  });
};

type CreateSubmissionPayload = {
  assignmentId: string;
  studentId: string;
  fileId?: string | null;
  githubLink?: string | null;
};

export const createSubmission = async ({
  assignmentId,
  studentId,
  fileId = null,
  githubLink = null,
}: CreateSubmissionPayload) => {
  return prisma.submission.create({
    data: {
      assignmentId,
      studentId,
      fileId,
      githubLink,
      submittedAt: new Date(),
    },
    include: {
      file: true,
    },
  });
};

export const getAssignmentWithSubmission = async ({
  assignmentId,
  studentId,
}: {
  assignmentId: string;
  studentId: string;
}) => {
  return prisma.assignment.findUnique({
    where: {
      id: assignmentId,
    },
    include: {
      submissions: {
        where: {
          studentId,
        },

        include: {
          file: true,
        },

        orderBy: {
          submittedAt: 'desc',
        },
      },
    },
  });
};
