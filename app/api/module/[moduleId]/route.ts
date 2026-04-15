import getUserDetails from '@/lib/isAuth';
import { deleteFromCloudinary } from '@/services/external/cloudinary';
import ApiResponse from '@/utils/api-response';
import { FileTypeToResourceType } from '@/utils/file-type-map';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) => {
  let user;
  try {
    user = await getUserDetails();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Please login first';

    return NextResponse.json(new ApiResponse(401, message, {}), { status: 401 });
  }

  if (user.role == 'TRAINEE') {
    return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
  }

  const body = await req.json();

  const { title } = body;
  const { moduleId } = await params;

  if (!title) {
    return NextResponse.json(new ApiResponse(401, 'Provide Valid Title', {}), { status: 401 });
  }

  const updatedModule = await prisma.module.update({
    where: { id: moduleId },
    data: {
      title,
    },
  });

  return NextResponse.json(new ApiResponse(200, 'Updated Module', updatedModule), { status: 200 });
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) => {
  let user;
  try {
    user = await getUserDetails();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Please login first';
    return NextResponse.json(new ApiResponse(401, message, {}), { status: 401 });
  }

  if (user.role == 'TRAINEE') {
    return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
  }

  const { moduleId } = await params;

  try {
    const moduleData = await prisma.module.findUnique({
      where: {
        id: moduleId,
      },
      select: {
        id: true,
        course: {
          select: {
            authorId: true,
          },
        },
        lessons: {
          select: {
            videoFile: {
              select: {
                id: true,
                public_id: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!moduleData) {
      return NextResponse.json(new ApiResponse(404, 'Please Provide Valid id', {}), {
        status: 404,
      });
    }

    if (user.role !== 'ADMIN' && moduleData.course.authorId !== user.id) {
      return NextResponse.json(
        new ApiResponse(403, 'You do not have access to modify course content', {}),
        { status: 403 }
      );
    }

    const videoFiles = [];
    for (const lesson of moduleData.lessons) {
      if (lesson.videoFile) {
        videoFiles.push(lesson.videoFile);
      }
    }

    await prisma.module.delete({
      where: {
        id: moduleId,
      },
    });

    for (const file of videoFiles) {
      try {
        await deleteFromCloudinary(file.public_id, FileTypeToResourceType[file.type]);
      } catch {}
    }

    for (const file of videoFiles) {
      try {
        await prisma.file.delete({
          where: {
            id: file.id,
          },
        });
      } catch {}
    }

    return NextResponse.json(new ApiResponse(200, 'Module Deleted Successfully', {}), {
      status: 200,
    });
  } catch {
    return NextResponse.json(
      new ApiResponse(500, 'Unable to delete module right now. Please try again.', {}),
      { status: 500 }
    );
  }
};
