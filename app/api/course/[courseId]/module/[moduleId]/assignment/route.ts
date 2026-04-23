import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) => {
  try {
    const user = await getUserDetails();

    const { moduleId, courseId } = await params;

    const courseDetails = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!courseDetails) {
      return NextResponse.json(new ApiResponse(404, 'Course not found', {}), {
        status: 404,
      });
    }

    if (user.role !== 'ADMIN' && courseDetails.authorId !== user.id) {
      return NextResponse.json(
        new ApiResponse(403, 'You do not have access to Add Assignmnets', {}),
        { status: 403 }
      );
    }

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
