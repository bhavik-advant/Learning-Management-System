import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(new ApiResponse(401, 'Please login first', {}), { status: 401 });
    }

    if (user.role === 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }


    const { courseId } = await params;

    const body = await req.json();
    const { title } = body;

    const moduleCount = await prisma.module.count({
      where: { courseId },
    });

    const createdModule = await prisma.module.create({
      data: {
        title,
        order: moduleCount + 1,
        courseId,
      },
    });

    return NextResponse.json(new ApiResponse(201, 'Module Created Successfully', createdModule), {
      status: 201,
    });
  } catch (error) {
    console.error('Module creation error:', error);

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};
