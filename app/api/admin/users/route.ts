import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import getUserDetails from '@/lib/isAuth';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const currentUser = await getUserDetails();

    if (!currentUser || currentUser.role === 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    const data = {
      users,
    };
    // console.log(data);

    return NextResponse.json(new ApiResponse(200, 'Dashboard data fetched successfully', data), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error('ADMIN DASHBOARD ERROR:', error);

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', null), { status: 500 });
  }
};
