import { NextResponse } from 'next/server';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import getUserDetails from '@/lib/isAuth';

export const GET = async () => {
  try {
    const currentUser = await getUserDetails();

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), { status: 403 });
    }

    const mentors = await prisma.user.findMany({
      where: { role: 'MENTOR' },
      orderBy: { username: 'asc' },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return NextResponse.json(new ApiResponse(200, 'Mentors fetched successfully', mentors), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error('GET MENTORS ERROR:', error);

    if (error && typeof error === 'object' && 'code' in error) {
      return NextResponse.json(new ApiResponse(400, 'Database error occurred', null), {
        status: 400,
      });
    }

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', null), { status: 500 });
  }
};
