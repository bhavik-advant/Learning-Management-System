// api/course/[courseId]/module/route.ts
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  try {
    let user;
    try {
      user = await getUserDetails();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please login first';

      return NextResponse.json(new ApiResponse(401, message, {}), { status: 401 });
    }

    if (user.role === 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

    const { courseId } = await params;

    const courseDetails = await prisma.course.findUnique({
      where: { id: courseId },
      select: { authorId: true },
    });

    if (user.role != 'ADMIN' && user.id != courseDetails?.authorId) {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

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
