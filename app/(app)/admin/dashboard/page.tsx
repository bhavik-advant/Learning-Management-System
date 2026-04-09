import MentorDashBoard from '@/components/dashboard/mentor-dashboard/MentorDashBoard';
import TraineeDashBoard from '@/components/dashboard/trainee-dashboard/TraineeDashBoard';
import { prisma } from '@/utils/prisma-client';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

async function DashBoard() {
  const { userId } = await auth();

  const userData = await prisma.user.findUnique({
    where: {
      clerkId: userId!,
    },
  });

  if (!userData) {
    redirect('/');
  }

  if (userData.role == 'MENTOR') {
    return <MentorDashBoard />;
  }

  return <TraineeDashBoard />;
}

export default DashBoard;
