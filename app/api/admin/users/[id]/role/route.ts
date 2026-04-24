import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma-client';
import ApiResponse from '@/utils/api-response';
import getUserDetails from '@/lib/isAuth';

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const currentUser = await getUserDetails();

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), { status: 403 });
    }

    const body = await req.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(new ApiResponse(400, 'Role is required', null), { status: 400 });
    }

    const { id } = await params;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(new ApiResponse(200, 'User role updated', updatedUser), {
      status: 200,
    });
  } catch (error) {
    console.error('UPDATE ROLE ERROR:', error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', null), { status: 500 });
  }
};
