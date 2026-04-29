import getUserDetails from '@/lib/isAuth';
import { deleteFromCloudinary } from '@/services/external/cloudinary';
import ApiResponse from '@/utils/api-response';
import { FileTypeToResourceType } from '@/utils/file-type-map';
import { extractEmbeddedFileIds } from '@/utils/getIdsFromMarkdown';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string; assignmentId: string }> }
) => {
  try {
    const user = await getUserDetails();

    if (user.role === 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

    const { courseId, moduleId, assignmentId } = await params;

    const courseDetails = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, authorId: true },
    });

    if (!courseDetails) {
      return NextResponse.json(new ApiResponse(404, 'Course not found', {}), { status: 404 });
    }

    if (user.role !== 'ADMIN' && courseDetails.authorId !== user.id) {
      return NextResponse.json(
        new ApiResponse(403, 'You do not have access to modify course content', {}),
        { status: 403 }
      );
    }

    const assignmentDetails = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: {
        id: true,
        description: true,
        moduleId: true,
        module: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (
      !assignmentDetails ||
      assignmentDetails.module.courseId !== courseId ||
      assignmentDetails.moduleId !== moduleId
    ) {
      return NextResponse.json(new ApiResponse(404, 'Assignment not found', {}), { status: 404 });
    }

    const embeddedFileIds = extractEmbeddedFileIds(assignmentDetails.description);

    const deletedAssignment = await prisma.assignment.delete({
      where: { id: assignmentId },
      select: { id: true },
    });

    if (embeddedFileIds.length > 0) {
      const filesToDelete = await prisma.file.findMany({
        where: {
          id: {
            in: embeddedFileIds,
          },
        },
        select: {
          id: true,
          public_id: true,
          type: true,
        },
      });

      await Promise.allSettled(
        filesToDelete.map(file =>
          deleteFromCloudinary(file.public_id, FileTypeToResourceType[file.type])
        )
      );

      await prisma.file.deleteMany({
        where: {
          id: {
            in: filesToDelete.map(file => file.id),
          },
        },
      });
    }

    return NextResponse.json(
      new ApiResponse(200, 'Assignment Deleted Successfully', deletedAssignment),
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed To Delete Assignment', error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string; assignmentId: string }> }
) => {
  try {
    const user = await getUserDetails();

    if (user.role === 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

    const { courseId, moduleId, assignmentId } = await params;

    const courseDetails = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, authorId: true },
    });

    if (!courseDetails) {
      return NextResponse.json(new ApiResponse(404, 'Course not found', {}), { status: 404 });
    }

    if (user.role !== 'ADMIN' && courseDetails.authorId !== user.id) {
      return NextResponse.json(
        new ApiResponse(403, 'You do not have access to modify course content', {}),
        { status: 403 }
      );
    }

    const assignmentDetails = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: {
        id: true,
        moduleId: true,
        module: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (
      !assignmentDetails ||
      assignmentDetails.module.courseId !== courseId ||
      assignmentDetails.moduleId !== moduleId
    ) {
      return NextResponse.json(new ApiResponse(404, 'Assignment not found', {}), { status: 404 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(new ApiResponse(400, 'Invalid JSON body', {}), { status: 400 });
    }

    if (body === null || typeof body !== 'object') {
      return NextResponse.json(new ApiResponse(400, 'Invalid request body', {}), { status: 400 });
    }

    const { title, description, maxScore, dueDate } = body as {
      title?: string;
      description?: string;
      maxScore?: number | string;
      dueDate?: string | number | null;
    };

    const data: {
      title?: string;
      description?: string;
      maxScore?: number;
      dueDate?: Date | null;
    } = {
      title,
      description,
      maxScore: maxScore === undefined ? undefined : Number(maxScore),
      dueDate:
        dueDate === undefined
          ? undefined
          : dueDate === null || dueDate === ''
            ? null
            : new Date(dueDate),
    };

    const hasAnyField = Object.values(data).some(v => v !== undefined);
    if (!hasAnyField) {
      return NextResponse.json(new ApiResponse(400, 'No fields provided to update', {}), {
        status: 400,
      });
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        maxScore: true,
        moduleId: true,
      },
    });

    return NextResponse.json(
      new ApiResponse(200, 'Assignment Updated Successfully', updatedAssignment),
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed To Update Assignment', error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};
