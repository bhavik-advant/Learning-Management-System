import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) => {
  try {
    let user;
    try {
      user = await getUserDetails();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please login first';

      return NextResponse.json(new ApiResponse(401, message, {}), { status: 401 });
    }

    const { moduleId } = await params;

    const moduleDetails = await prisma.module.findUnique({
      where: { id: moduleId },
      select: {
        course: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (user.role != 'ADMIN' && moduleDetails?.course.authorId != user.id) {
      return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
    }

    const body = await req.json();
    const { title, description, maxScore } = await body;

    if (!title || !description || !maxScore) {
      return NextResponse.json(new ApiResponse(401, 'Provide All Details', {}), { status: 401 });
    }

    const createdAssignment = await prisma.assignment.create({
      data: {
        title,
        description,
        maxScore: Number(maxScore),
        moduleId: moduleId,
        createdById: user.id,
      },
    });

    return NextResponse.json(
      new ApiResponse(201, 'Assignment Created SuccessFully', createdAssignment),
      { status: 201 }
    );
  } catch {
    return NextResponse.json(new ApiResponse(401, 'Failed to create Assignment ', {}), {
      status: 401,
    });
  }
};
