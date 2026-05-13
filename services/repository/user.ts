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

  if (!user) {
    throw new Error(' Mentor not found');
  }

  return user.mentor;
};

export const getTraineeMentorId = async (traineeId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: traineeId },
    select: {
      mentorId: true,
    },
  });

  if (!user) {
    throw new Error('Mentor not found');
  }

  return user.mentorId;
};

import { Role } from '@/generated/prisma/enums';

export const getUsers = async (limit?: number) => {
  const [users, totalUsers, totalMentors, totalTrainees] = await Promise.all([
    prisma.user.findMany({
      ...(limit ? { take: limit } : {}),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    }),

    prisma.user.count(),

    prisma.user.count({
      where: {
        role: Role.MENTOR,
      },
    }),

    prisma.user.count({
      where: {
        role: Role.TRAINEE,
      },
    }),
  ]);

  return {
    users,
    stats: {
      totalUsers,
      totalMentors,
      totalTrainees,
    },
  };
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

export const getUserRoleById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
    },
  });

  return user?.role ?? null;
};

export const getAllAdminsID = async () => {
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    orderBy: { username: 'asc' },
    select: {
      id: true,
    },
  });

  return admins.map(admin => admin.id);
};
