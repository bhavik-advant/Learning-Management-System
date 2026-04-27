import AddContent from '@/components/course/CourseContent';
import { prisma } from '@/utils/prisma-client';
import { auth } from '@clerk/nextjs/server';

const page = async () => {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: { clerkId: userId! },
    select: { role: true },
  });

  return (
    <>
      <AddContent role={user!.role} />
    </>
  );
};

export default page;
