import { prisma } from '@/utils/prisma-client';
import { FileType, SubmissionStatus } from '@/generated/prisma/enums';
import { PaginationDataType } from '@/types/types';
import { Prisma } from '@/generated/prisma/client';
import { totalmem } from 'os';

const whereClauseForStatus = (
  status: SubmissionStatus[],
  search: string
): Prisma.SubmissionWhereInput => {
  return {
    OR: [
      {
        assignment: {
          is: {
            title: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        },
      },
      {
        student: {
          is: {
            username: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        },
      },
    ],
    status: status.length > 0 ? { in: status } : undefined,
  };
};

const getSubmissionsForReviewInclude = {
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
};

export const getAllSubmissionsForAdmin = async ({
  search,
  status,
  page,
  limit,
  skip,
}: {
  search: string;
  status: SubmissionStatus[];
  page: number;
  limit: number;
  skip: number;
}) => {
  const allSubmissions = await prisma.submission.findMany({
    where: whereClauseForStatus(status, search),
    orderBy: { submittedAt: 'desc' },
    include: getSubmissionsForReviewInclude,
    take: limit,
    skip,
  });

  const allSubmissionsCount = await prisma.submission.count({
    where: whereClauseForStatus(status, search),
  });

  const pagination = {
    totalPages: Math.ceil(allSubmissionsCount / limit),
    currentPage: page,
    hasNextPage: allSubmissionsCount > skip + limit,
    hasPreviousPage: skip > 0,
  };

  return { submissions: allSubmissions, pagination };
};

export const getSubmissionsForMentor = async ({
  userId,
  search,
  status,
  page,
  limit,
  skip,
}: {
  userId: string;
  search: string;
  status: SubmissionStatus[];
  page: number;
  limit: number;
  skip: number;
}) => {
  const whereClause = {
    student: {
      mentorId: userId,
    },
    assignment: {
      module: {
        course: {
          enrollments: {
            some: {
              student: {
                mentorId: userId,
              },
            },
          },
        },
      },
    },
    ...whereClauseForStatus(status, search),
  };

  const submissionsDetails = await prisma.submission.findMany({
    where: whereClause,
    include: getSubmissionsForReviewInclude,
    orderBy: { submittedAt: 'desc' },
    take: limit,
    skip,
  });

  const allSubmissionsCount = await prisma.submission.count({
    where: whereClause,
  });

  return {
    submissions: submissionsDetails,
    pagination: {
      totalPages: Math.ceil(allSubmissionsCount / limit),
      currentPage: page,
      hasNextPage: allSubmissionsCount > skip + limit,
      hasPreviousPage: skip > 0,
    },
  };
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
  limit,
  skip,
}: {
  studentId: string;
  search?: string;
  status?: SubmissionStatus | 'ALL';
  limit: number;
  skip: number;
}): Promise<{ submissions: StudentSubmissionWithAssignment[]; pagination: PaginationDataType }> => {
  const fetchedSubmissions = await prisma.submission.findMany({
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
    take: limit,
    skip,
  });

  const totalSubmissions = await prisma.submission.count({
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
  });

  return {
    submissions: fetchedSubmissions,
    pagination: {
      totalPages: Math.ceil(totalSubmissions / limit),
      currentPage: Math.floor(skip / limit) + 1,
      hasNextPage: totalSubmissions > skip + limit,
      hasPreviousPage: skip > 0,
    },
  };
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
