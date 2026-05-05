import { User } from '@/generated/prisma/client';
import { prisma } from '@/utils/prisma-client';

export const createUserWebhook = async ({
  id,
  image_url,
  email,
  username,
}: {
  id: string;
  image_url: string;
  email: string;
  username?: string;
}) => {
  const createUser = await prisma.user.create({
    data: {
      clerkId: id!,
      email,
      image: image_url,
      username: username!,
    },
  });
  return createUser;
};

export const getTraineeMentor = async (traineeId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: traineeId },
    select: {
      mentor: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return user?.mentor;
};

export const getTraineeMentorId = async (traineeId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: traineeId },
    select: {
      mentorId: true,
    },
  });

  return user?.mentorId;
};

export const getUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });
  return users;
};

// Get user by ID with mentor details
export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      image: true,
      username: true,
      email: true,
      role: true,
      mentorId: true,
      mentor: {
        select: {
          username: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
};

// Get user by Clerk ID
export const getUserByClerkId = async (clerkId: string) => {
  return prisma.user.findUnique({
    where: { clerkId },
  });
};

// Validate mentor
export const getMentorById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

// Update user
export const updateUserById = async (id: string, data: Partial<User>) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const getAllMentors = async () => {
  return prisma.user.findMany({
    where: { role: 'MENTOR' },
    orderBy: { username: 'asc' },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });
};

export const getAdminDashboardData = async () => {
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

  const [
    totalUsers,
    totalTrainees,
    totalMentors,
    pendingCourseApprovals,
    latestUsers,
    latestCoursesRaw,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'TRAINEE' } }),
    prisma.user.count({ where: { role: 'MENTOR' } }),
    prisma.course.count({ where: { status: 'PENDING' } }),

    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),

    prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      include,
    }),
  ]);

  return {
    totalUsers,
    totalTrainees,
    totalMentors,
    pendingCourseApprovals,
    latestUsers,
    latestCoursesRaw,
  };
};
