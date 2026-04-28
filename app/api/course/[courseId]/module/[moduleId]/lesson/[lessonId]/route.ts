import getUserDetails from '@/lib/isAuth';
import { deleteFromCloudinary } from '@/services/external/cloudinary';
import ApiResponse from '@/utils/api-response';
import { FileTypeToResourceType } from '@/utils/file-type-map';
import { extractEmbeddedFileIds } from '@/utils/getIdsFromMarkdown';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> }
) => {
  try {
    const user = await getUserDetails();

    if (user.role === 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

    const { lessonId, courseId, moduleId } = await params;

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
        new ApiResponse(403, 'You do not have access to modify course content', {}),
        { status: 403 }
      );
    }

    const lessonDetails = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        id: true,
        content: true,
        moduleId: true,
        module: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (
      !lessonDetails ||
      lessonDetails.module.courseId !== courseId ||
      lessonDetails.moduleId !== moduleId
    ) {
      return NextResponse.json(new ApiResponse(404, 'Lesson not found', {}), {
        status: 404,
      });
    }

    const embeddedFileIds = extractEmbeddedFileIds(lessonDetails.content);

    const deletedLesson = await prisma.lesson.delete({
      where: {
        id: lessonId,
      },
      select: {
        id: true,
      },
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

    return NextResponse.json(new ApiResponse(200, 'Lesson Deleted Successfully', deletedLesson), {
      status: 200,
    });
  } catch (error) {
    console.error('Failed To Delete Lesson', error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), {
      status: 500,
    });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> }
) => {
  try {
    const user = await getUserDetails();

    if (user.role === 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

    const { lessonId, courseId } = await params;

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
        new ApiResponse(403, 'You do not have access to modify course content', {}),
        { status: 403 }
      );
    }

    const body = await req.json();

    const { title, content } = body;

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title,
        content,
      },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    return NextResponse.json(new ApiResponse(200, 'Lesson Updated Successfully', updatedLesson), {
      status: 200,
    });
  } catch (error) {
    console.error('Failed To Update Lesson', error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), {
      status: 500,
    });
  }
};
