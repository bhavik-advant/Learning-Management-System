import { Role } from '@/generated/prisma/enums';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextResponse } from 'next/server';

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
    return NextResponse.json(new ApiResponse(404, 'Course not found', {}), {
      status: 404,
    });
  }

  return courseDetails.enrollments;
};

export const getMyCourses = async ({
  userRole,
  userId,
  limit,
}: {
  userRole: Role;
  userId: string;
  limit?: number;
}) => {
  const include = {
    author: {
      select: {
        username: true,
        image: true,
      },
    },
    thumbnail: { select: { url: true } },
    _count: {
      select: {
        modules: true,
      },
    },
  } as const;

  let courses;

  if (userRole === 'ADMIN') {
    courses = await prisma.course.findMany({
      include,
      orderBy: { createdAt: 'desc' },
      ...(typeof limit === 'number' ? { take: limit } : {}),
    });
  } else if (userRole === 'MENTOR') {
    courses = await prisma.course.findMany({
      where: { authorId: userId },
      include,
      orderBy: { createdAt: 'desc' },
      ...(typeof limit === 'number' ? { take: limit } : {}),
    });
  } else {
    courses = await prisma.course.findMany({
      where: {
        status: 'APPROVED',
        enrollments: {
          some: {
            studentId: userId,
          },
        },
      },
      include,
      orderBy: { createdAt: 'desc' },
      ...(typeof limit === 'number' ? { take: limit } : {}),
    });
  }

  const formattedCourse = courses.map(c => ({
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

  return formattedCourse;
};

//to be used later
export const getAllCourses = async () => {
  const courses = await prisma.course.findMany();

  return courses;
};

export const pendingCourses = async () => {
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
