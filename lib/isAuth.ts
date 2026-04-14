import { prisma } from '@/utils/prisma-client';
import { auth } from '@clerk/nextjs/server';

const getUserDetails = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
};

export default getUserDetails;
