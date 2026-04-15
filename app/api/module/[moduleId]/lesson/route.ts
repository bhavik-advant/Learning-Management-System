import { FileType } from '@/generated/prisma/client';
import getUserDetails from '@/lib/isAuth';
import { uploadToCloudinary } from '@/services/external/cloudinary';
import ApiResponse from '@/utils/api-response';
import { ResourceTypeToPrisma } from '@/utils/file-type-map';
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

    if (user.role === 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

    const { moduleId } = await params;
    const formData = await req.formData();

    const title = (formData.get('title') as string)?.trim();
    const lessonFile = formData.get('lesson');
    const incomingUrl = (formData.get('url') as string)?.trim();

    if (!moduleId || !title) {
      return NextResponse.json(new ApiResponse(400, 'Module ID and title are required', {}), {
        status: 400,
      });
    }

    const hasFile = lessonFile instanceof File;
    const hasUrl = !!incomingUrl;

    if (!hasFile && !hasUrl) {
      return NextResponse.json(new ApiResponse(400, 'Provide either a file or a URL', {}), {
        status: 400,
      });
    }

    let fileId: string | null = null;
    let lessonUrl: string | null = null;

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

      const file = await prisma.file.create({
        data: {
          public_id,
          size: bytes,
          url,
          type: fileType,
          uploadedBy: user.id,
        },
      });

      fileId = file.id;
      lessonUrl = url;
    }

    if (hasUrl) {
      try {
        new URL(incomingUrl!);
      } catch {
        return NextResponse.json(new ApiResponse(400, 'Invalid URL provided', {}), { status: 400 });
      }

      lessonUrl = incomingUrl!;
    }

    const lessonCount = await prisma.lesson.count({
      where: { moduleId },
    });

    const createdLesson = await prisma.lesson.create({
      data: {
        title,
        videoFileId: fileId,
        videoUrl: fileId ? null : lessonUrl,
        order: lessonCount + 1,
        moduleId,
      },
    });

    const formattedLesson = {
      id: createdLesson.id,
      title: createdLesson.title,
      url: lessonUrl,
    };

    return NextResponse.json(
      new ApiResponse(201, 'Lesson Uploaded Successfully', formattedLesson),
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed To Add Lesson', error);
    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};
