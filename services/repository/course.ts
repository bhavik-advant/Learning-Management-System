import { CourseStatus, Role } from '@/generated/prisma/enums';
import ApiResponse from '@/utils/api-response';
import { userRoleCheck } from '@/utils/checkUserRole';
import { prisma } from '@/utils/prisma-client';
import { handleBuildComplete } from 'next/dist/build/adapter/build-complete';
import { NextResponse } from 'next/server';

type CourseWithModuleCount = {
  id: string;
  title: string;
  description: string;
  thumbnail?: { url: string } | null;
  author: { username: string; image: string | null };
  status: CourseStatus;
  authorId: string;
  thumbnailId: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { modules: number };
};

const formatCoursesWithModuleCount = (courses: CourseWithModuleCount[]) =>
  courses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail?.url ?? '',
    author: course.author.username,
    image: course.author.image,
    status: course.status,
    authorId: course.authorId,
    thumbnailId: course.thumbnailId,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    modulesCount: course._count.modules,
  }));

const courseIncludeWithModuleCount = {
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
  skip,
  search,
  statusFilter = 'ALL',
}: {
  userRole: Role;
  skip: number;
  userId: string;
  limit?: number;
  search?: string;
  statusFilter?: CourseStatus | 'ALL';
}) => {
  const include = courseIncludeWithModuleCount;

  let courses;

  if (userRoleCheck.isAdmin(userRole)) {
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
        skip,
      }),

      prisma.course.count({
        where: {
          status: 'PENDING',
        },
      }),
    ]);

    const allCoursesCount = await prisma.course.count();

    courses = {
      courses: courseData,
      stats: {
        pendingCourseApprovals,
      },
      pagination: {
        totalPages: Math.ceil(allCoursesCount / (limit || allCoursesCount)),
        hasNextPage: skip + (limit || 0) < allCoursesCount,
        hasPreviousPage: skip > 0,
      },
    };
  } else if (userRoleCheck.isMentor(userRole)) {
    const [courseData, totalCourses, totalStudents, pendingSubmissions] = await Promise.all([
      prisma.course.findMany({
        where: {
          title: {
            contains: search,
            mode: 'insensitive',
          },
          OR: [{ status: 'APPROVED' }, { authorId: userId }],
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
        },
        include,
        orderBy: {
          createdAt: 'desc',
        },
        ...(typeof limit === 'number' ? { take: limit } : {}),
        skip,
      }),

      prisma.course.count({
        where: {
          authorId: userId,
        },
      }),

      prisma.user.count({
        where: {
          mentorId: userId,
        },
      }),

      prisma.submission.count({
        where: {
          student: {
            mentorId: userId,
          },
          status: 'PENDING',
        },
      }),
    ]);

    courses = {
      courses: courseData,
      stats: {
        totalCourses: totalCourses,
        totalStudents: totalStudents,
        pendingSubmissions: pendingSubmissions,
      },
      pagination: {
        totalPages: Math.ceil(totalCourses / (limit || totalCourses)),
        hasNextPage: skip + (limit || 0) < totalCourses,
        hasPreviousPage: skip > 0,
      },
    };
  } else {
    const courseData = await prisma.course.findMany({
      where: {
        title: {
          contains: search,
          mode: 'insensitive',
        },
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
      skip,
    });

    courses = {
      courses: courseData,
      stats: {},
      pagination: {
        totalPages: Math.ceil(courseData.length / (limit || courseData.length)),
        hasNextPage: skip + (limit || 0) < courseData.length,
        hasPreviousPage: skip > 0,
      },
    };
  }

  const formattedCourses = formatCoursesWithModuleCount(courses.courses);

  return {
    courses: formattedCourses,
    stats: courses.stats,
    pagination: courses.pagination,
  };
};

export const getMyCourses = async ({ userId }: { userId: string }) => {
  const courses = await prisma.course.findMany({
    where: {
      authorId: userId,
    },
    include: courseIncludeWithModuleCount,
    orderBy: { createdAt: 'desc' },
  });
  const formattedCourse = formatCoursesWithModuleCount(courses);
  return formattedCourse;
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
          image: true,
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
  const include = courseIncludeWithModuleCount;

  const courses = await prisma.course.findMany({
    where: {
      status: 'APPROVED',
      enrollments: {
        none: {
          studentId: userId,
        },
      },
    },
    include,
    orderBy: {
      createdAt: 'desc',
    },
    skip: skip,
    take: limit,
  });

  const formattedCourses = formatCoursesWithModuleCount(courses);

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

  const include = courseIncludeWithModuleCount;

  const courses = await prisma.course.findMany({
    where: {
      enrollments: {
        some: {
          studentId: userId,
        },
      },
    },
    include,
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });

  const formattedCourses = formatCoursesWithModuleCount(courses);

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
  limit = 6,
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
