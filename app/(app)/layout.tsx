import DashboardLayout from '@/components/layout/DashboardLayout';
import type { Role } from '@/generated/prisma/enums';
import type { UserRole } from '@/types/types';
import { prisma } from '@/utils/prisma-client';
import { auth } from '@clerk/nextjs/server';

const prismaRoleToSidebarRole: Record<Role, UserRole> = {
  ADMIN: 'admin',
  MENTOR: 'mentor',
  TRAINEE: 'trainee',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const formattedUser = {
    name: user.username,
    email: user.email,
    image: user.image,
    role: prismaRoleToSidebarRole[user.role],
  };

  return (
    <DashboardLayout role={formattedUser.role} user={formattedUser}>
      {children}
    </DashboardLayout>
  );
}
