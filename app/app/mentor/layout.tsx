import { prisma } from '@/utils/prisma-client';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function layout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  const currentUser = await prisma.user.findUnique({
    where: { clerkId: userId! },
  });

  if (!currentUser) {
    return <div>User not found</div>;
  }

  if (currentUser.role !== 'MENTOR') {
    redirect(`${currentUser?.role.toLowerCase()}/dashboard`);
  }

  return <>{children}</>;
}
