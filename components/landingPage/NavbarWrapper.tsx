import { prisma } from '@/utils/prisma-client';
import Navbar from './Navbar';
import { auth } from '@clerk/nextjs/server';

export default async function NavbarWrapper() {
  const { userId } = await auth();

  let role;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    role = user?.role?.toLowerCase();
  }

  return <Navbar role={role} />;
}
