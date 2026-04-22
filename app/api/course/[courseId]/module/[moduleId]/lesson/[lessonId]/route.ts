import { FileType } from '@/generated/prisma/enums';
import getUserDetails from '@/lib/isAuth';
import { deleteFromCloudinary, uploadToCloudinary } from '@/services/external/cloudinary';
import ApiResponse from '@/utils/api-response';
import { FileTypeToResourceType } from '@/utils/file-type-map';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) => {
  try {
    let user;
    try {
      user = await getUserDetails();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please login first';

      return NextResponse.json(new ApiResponse(401, message, {}), { status: 401 });
    }

    const { lessonId } = await params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        videoUrl: true,
        videoFile: {
          select: {
            id: true,
            public_id: true,
            type: true,
          },
        },
      },
    });

    if (lesson?.videoFile) {
      await deleteFromCloudinary(
        lesson.videoFile.public_id,
        FileTypeToResourceType[lesson.videoFile.type]
      );

      const deletedFile = await prisma.file.delete({
        where: {
          id: lesson.videoFile.id,
        },
      });
    }

    const deletedLesson = await prisma.lesson.delete({
      where: {
        id: lessonId,
      },
    });

    return NextResponse.json(new ApiResponse(200, 'Lesson Deleted Successfully', deletedLesson), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
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

    const { lessonId } = await params;

    const formData = await req.formData();

    const title = (formData.get('title') as string | null)?.trim();
    const lessonFile = formData.get('file') as File | null;
    const incomingUrl = (formData.get('url') as string | null)?.trim();

    const hasTitle = !!title;
    const hasFile = lessonFile instanceof File && lessonFile.size > 0;
    const hasUrl = !!incomingUrl;

    if (!lessonId) {
      return NextResponse.json(new ApiResponse(400, 'Lesson ID is required', {}), { status: 400 });
    }

    if (!hasTitle && !hasFile && !hasUrl) {
      return NextResponse.json(
        new ApiResponse(400, 'Provide at least one field: title, file, or URL', {}),
        { status: 400 }
      );
    }

    if (hasUrl) {
      try {
        new URL(incomingUrl!);
      } catch {
        return NextResponse.json(new ApiResponse(400, 'Invalid URL provided', {}), { status: 400 });
      }
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        title: true,
        videoFile: {
          select: {
            id: true,
            public_id: true,
            url: true,
            type: true,
          },
        },
        videoUrl: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(new ApiResponse(404, 'Lesson not found', {}), { status: 404 });
    }

    if (hasTitle && !hasFile && !hasUrl) {
      await prisma.lesson.update({ where: { id: lessonId }, data: { title } });

      return NextResponse.json(
        new ApiResponse(200, 'Lesson Updated Successfully', {
          id: lesson.id,
          title: lesson.title,
          url: lesson.videoUrl ?? lesson.videoFile?.url,
        }),
        {
          status: 200,
        }
      );
    }

    const dataToUpdate: {
      title?: string;
      videoFileId?: string | null;
      videoUrl?: string | null;
    } = {};

    if (hasTitle) {
      dataToUpdate.title = title;
    }

    if (hasFile) {
      const result = await uploadToCloudinary(lessonFile as File);

      if (!result) {
        return NextResponse.json(new ApiResponse(400, 'Failed to upload resource', {}), {
          status: 400,
        });
      }

      const { public_id, bytes, url, resource_type } = result;

      let fileType: FileType;

      if (resource_type === 'image') {
        fileType = FileType.IMAGE;
      } else if (resource_type === 'video') {
        fileType = FileType.VIDEO;
      } else {
        fileType = FileType.DOCUMENT;
      }

      if (lesson.videoFile) {
        await prisma.file.update({
          where: { id: lesson.videoFile.id },
          data: {
            public_id,
            size: bytes,
            url,
            type: fileType,
            uploadedBy: user.id,
          },
        });

        dataToUpdate.videoFileId = lesson.videoFile.id;
      } else {
        const createdFile = await prisma.file.create({
          data: {
            public_id,
            size: bytes,
            url,
            type: fileType,
            uploadedBy: user.id,
          },
        });

        dataToUpdate.videoFileId = createdFile.id;
      }

      dataToUpdate.videoUrl = null;
    } else if (hasUrl) {
      dataToUpdate.videoUrl = incomingUrl!;
      dataToUpdate.videoFileId = null;
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: dataToUpdate,
      select: {
        id: true,
        title: true,
        videoUrl: true,
        videoFile: {
          select: {
            url: true,
          },
        },
      },
    });

    if (hasFile && lesson.videoFile) {
      await deleteFromCloudinary(
        lesson.videoFile.public_id,
        FileTypeToResourceType[lesson.videoFile.type]
      );
    } else if (hasUrl && lesson.videoFile) {
      await deleteFromCloudinary(
        lesson.videoFile.public_id,
        FileTypeToResourceType[lesson.videoFile.type]
      );

      await prisma.file.delete({
        where: {
          id: lesson.videoFile.id,
        },
      });
    }

    const formattedLesson = {
      id: updatedLesson.id,
      title: updatedLesson.title,
      url: updatedLesson.videoUrl ?? updatedLesson.videoFile?.url ?? null,
    };

    return NextResponse.json(new ApiResponse(200, 'Lesson Updated Successfully', formattedLesson), {
      status: 200,
    });
  } catch (error) {
    console.error('Failed To Update Lesson', error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), {
      status: 500,
    });
  }
};
