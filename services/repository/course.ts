import { CourseStatus, Role } from '@/generated/prisma/enums';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextResponse } from 'next/server';

//basic CRUD operations for course

export const createCourse = async ({
  title,
  description,
  thumbnailId,
  authorId,
}: {
  title: string;
  description: string;
  thumbnailId: string;
  authorId: string;
}) => {
  const course = await prisma.course.create({
    data: {
      title,
      description,
      thumbnailId,
      authorId,
    },
  });

  return course;
};

export const updateCourse = async ({
  courseId,
  title,
  description,
  thumbnailId,
}: {
  courseId: string;
  title?: string;
  description?: string;
  thumbnailId?: string;
}) => {
  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: {
      title,
      description,
      thumbnailId,
    },
  });

  return updatedCourse;
};

export const getCourseById = async ({ courseId, userId }: { courseId: string; userId: string }) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
      authorId: true,
      status: true,
      thumbnail: {
        select: { url: true },
      },
      modules: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,

          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              content: true,
            },
          },

          assignments: {
            select: {
              id: true,
              title: true,
              description: true,
              dueDate: true,
              maxScore: true,

              submissions: {
                where: {
                  studentId: userId,
                },
                select: {
                  status: true,
                  score: true,
                  submittedAt: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return NextResponse.json(new ApiResponse(404, 'Course not found', {}), {
      status: 404,
    });
  }

  const formattedCourse = {
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail?.url || null,
    authorId: course.authorId,
    status: course.status,

    modules: course.modules.map(module => ({
      id: module.id,
      title: module.title,

      lessons: module.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
      })),

      assignments: module.assignments.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        maxScore: a.maxScore,

        submission: a.submissions[0] || null,
      })),
    })),
  };

  return formattedCourse;
};

export const getCourseDetailsById = async ({ courseId }: { courseId: string }) => {
  return prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });
};

export const getCourseDetails = async ({ courseId }: { courseId: string }) => {
  const courseDetails = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnail: {
        select: { url: true },
      },
    },
  });

  if (!courseDetails) {
    throw new Error('Course not found');
  }

  const formattedCourseDetails = {
    id: courseDetails.id,
    title: courseDetails.title,
    description: courseDetails.description,
    thumbnail: courseDetails.thumbnail?.url || null,
  };

  return formattedCourseDetails;
};

export const getEnrolledStudentIds = async ({ courseId }: { courseId: string }) => {
  const courseDetails = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      enrollments: {
        select: {
          studentId: true,
        },
      },
    },
  });

  if (!courseDetails) {
    throw new Error('Course not found');
  }

  return courseDetails.enrollments || [];
};

export const getAllCourses = async ({
  userRole,
  userId,
  limit,
  search,
  statusFilter = 'ALL',
}: {
  userRole: Role;
  userId: string;
  limit?: number;
  search?: string;
  statusFilter?: CourseStatus | 'ALL';
}) => {
  const include = {
    author: {
      select: {
        username: true,
        image: true,
      },
    },
    thumbnail: {
      select: {
        url: true,
      },
    },
    _count: {
      select: {
        modules: true,
      },
    },
  } as const;

  let courses;

  if (userRole === 'ADMIN' || userRole === 'MENTOR') {
    const [courseData, pendingCourseApprovals] = await Promise.all([
      prisma.course.findMany({
        where: {
          title: {
            contains: search,
            mode: 'insensitive',
          },
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
        },
        include,
        orderBy: {
          createdAt: 'desc',
        },
        ...(typeof limit === 'number' ? { take: limit } : {}),
      }),

      prisma.course.count({
        where: {
          status: 'PENDING',
        },
      }),
    ]);

    courses = {
      courses: courseData,
      stats: {
        pendingCourseApprovals,
      },
    };
  } else {
    const courseData = await prisma.course.findMany({
      where: {
        status: 'APPROVED',
        enrollments: {
          some: {
            studentId: userId,
          },
        },
      },
      include,
      orderBy: {
        createdAt: 'desc',
      },
      ...(typeof limit === 'number' ? { take: limit } : {}),
    });

    courses = {
      courses: courseData,
      stats: {
        pendingCourseApprovals: 0,
      },
    };
  }

  const formattedCourses = courses.courses.map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    thumbnail: c.thumbnail?.url ?? '',
    author: c.author.username,
    image: c.author.image,
    status: c.status,
    authorId: c.authorId,
    thumbnailId: c.thumbnailId,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    modulesCount: c._count.modules,
  }));

  return {
    courses: formattedCourses,
    stats: courses.stats,
  };
};

export const getPendingCourses = async () => {
  const courses = await prisma.course.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      thumbnail: {
        select: {
          url: true,
        },
      },
      author: {
        select: {
          username: true,
        },
      },
      modules: {
        select: {
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedCourses = courses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    image: course.thumbnail?.url,
    mentor: course.author?.username,
    submittedAt: course.createdAt,
    modules: course.modules.length,
    lessons: course.modules.reduce((acc, module) => acc + module._count.lessons, 0),
  }));

  return formattedCourses;
};

export const getCourseAuthorId = async ({ courseId }: { courseId: string }) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { authorId: true },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  return course.authorId;
};

export const inactiveCourse = async ({ courseId }: { courseId: string }) => {
  return prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      status: CourseStatus.INACTIVE,
    },
  });
};

export const reactivateCourse = async ({ courseId }: { courseId: string }) => {
  return prisma.course.update({
    where: {
      id: courseId,
    },

    data: {
      status: CourseStatus.APPROVED,
    },
  });
};

//Course Assigning to Trainee Related Repository Functions

export const getAssignableCourses = async ({
  userId,
  limit,
  skip,
}: {
  userId: string;
  limit?: number;
  skip?: number;
}) => {
  const courses = await prisma.course.findMany({
    where: {
      status: 'APPROVED',
      enrollments: {
        none: {
          studentId: userId,
        },
      },
    },
    include: {
      thumbnail: {
        select: {
          url: true,
        },
      },
      author: {
        select: {
          username: true,
        },
      },
      modules: {
        select: {
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: skip,
    take: limit,
  });

  const formattedCourses = courses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    status: course.status,
    thumbnail: course.thumbnail?.url || '',
    author: course.author?.username || 'Unknown',
    modulesCount: course.modules.length,
  }));

  return formattedCourses;
};

export const getAssignableCoursesCount = async ({ userId }: { userId: string }) => {
  const totalCourses = await prisma.course.count({
    where: {
      status: 'APPROVED',
      enrollments: {
        none: {
          studentId: userId,
        },
      },
    },
  });

  return totalCourses;
};

export const getFormattedAssignableCourses = async ({
  userId,
  page = 1,
  limit,
  skip,
}: {
  userId: string;
  page: number;
  limit: number;
  skip?: number;
}) => {
  const assignableCourseCount = await getAssignableCoursesCount({ userId });
  const courses = await getAssignableCourses({ userId, limit, skip });
  const totalPages = Math.ceil(assignableCourseCount / limit);

  const paginationData = {
    courses: courses,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalItems: assignableCourseCount,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };

  return paginationData;
};

export const assignCoursesToUser = async ({
  courseIds,
  userId,
}: {
  courseIds: string[];
  userId: string;
}) => {
  const assign = await prisma.enrollment.createMany({
    data: courseIds.map(courseId => ({
      courseId,
      studentId: userId,
    })),
    skipDuplicates: true,
  });
  return assign;
};

export const getAssignedCourses = async ({
  userId,
  limit,
  skip,
}: {
  userId: string;
  limit?: number;
  skip?: number;
}) => {
  const take = limit == 0 ? undefined : limit;

  const courses = await prisma.course.findMany({
    where: {
      enrollments: {
        some: {
          studentId: userId,
        },
      },
    },
    include: {
      thumbnail: { select: { url: true } },
      author: { select: { username: true, image: true } },
      modules: {
        select: {
          _count: { select: { lessons: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });

  const formattedCourses = courses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail?.url ?? '',
    author: course.author?.username ?? 'Unknown',
    image: course.author?.image ?? '',
    status: course.status,
    authorId: course.authorId,
    thumbnailId: course.thumbnailId,
    createdAt: course.createdAt,
    modulesCount: course.modules.length,
  }));

  return formattedCourses;
};

export const getAssignedCoursesCount = async ({ userId }: { userId: string }) => {
  const totalCourses = await prisma.course.count({
    where: {
      enrollments: {
        some: {
          studentId: userId,
        },
      },
    },
  });

  return totalCourses;
};

export const getFormattedAssignedCourses = async ({
  userId,
  page = 1,
  limit,
  skip,
}: {
  userId: string;
  page: number;
  limit: number;
  skip?: number;
}) => {
  const assignedCourseCount = await getAssignedCoursesCount({ userId });
  const courses = await getAssignedCourses({ userId, limit, skip });
  const totalPages = Math.ceil(assignedCourseCount / limit);

  const paginationData = {
    courses: courses,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalItems: assignedCourseCount,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };

  return paginationData;
};

export const restrictCoursesForTrainee = async ({
  courseIds,
  userId,
}: {
  courseIds: string[];
  userId: string;
}) => {
  await Promise.all(
    courseIds.map(async courseId => {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true },
      });

      if (!course) {
        throw new Error(`Course with ID ${courseId} not found`);
      }

      return prisma.enrollment.deleteMany({
        where: {
          studentId: userId,
          courseId: courseId,
        },
      });
    })
  );
};

export const changeCourseStatusToPending = async ({ courseId }: { courseId: string }) => {
  const updatedCourse = await prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      status: 'PENDING',
    },
  });

  return updatedCourse;
};

export const getCourseThumbnail = async ({ courseId }: { courseId: string }) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { thumbnail: true },
  });

  return course?.thumbnail;
};

//admin specific repository functions

export const approveCourse = async ({ courseId }: { courseId: string }) => {
  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: {
      status: 'APPROVED',
    },
  });

  return updatedCourse;
};

export const getTraineesByMentor = async (mentorId: string) => {
  const users = await prisma.user.findMany({
    where: { role: 'TRAINEE', mentorId },
  });
  return users;
};

export const getAllUsersForAdmin = async () => {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ['TRAINEE', 'MENTOR'],
      },
    },
  });
  return users;
};
