import getUserDetails from '@/lib/isAuth';
import { deleteFromCloudinary } from '@/services/external/cloudinary';
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
