import getUserDetails from '@/lib/isAuth';
import { FileType } from '@/generated/prisma/enums';
import { deleteFromCloudinary, uploadToCloudinary } from '@/services/external/cloudinary';
import ApiResponse from '@/utils/api-response';
import { FileTypeToResourceType } from '@/utils/file-type-map';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  let user;
  try {
    user = await getUserDetails();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Please login first';

    return NextResponse.json(new ApiResponse(401, message, {}), { status: 401 });
  }

  const { courseId } = await params;

  if (!courseId) {
    return NextResponse.json(new ApiResponse(401, 'Please Provide CourseId', {}), {
      status: 401,
    });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      thumbnail: {
        select: {
          url: true,
        },
      },
      modules: {
        orderBy: {
          order: 'asc',
        },
        select: {
          id: true,
          title: true,
          lessons: {
            orderBy: {
              order: 'asc',
            },
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
          },
        },
      },
    },
  });

  if (!course) {
    return NextResponse.json(new ApiResponse(401, 'Failed to fetch Coursr', {}), {
      status: 401,
    });
  }

  const formattedCourse = {
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail?.url || null,
    status: course.status,
    modules: course.modules.map(module => ({
      id: module.id,
      title: module.title,
      lessons: module.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        url: lesson.videoFile?.url || lesson.videoUrl || null,
      })),
    })),
  };

  return NextResponse.json(new ApiResponse(200, 'Course Fetched SuccessFully', formattedCourse), {
    status: 200,
  });
};

export const PATCH = async (
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

    const availableCourse = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        authorId: true,
        thumbnail: {
          select: {
            id: true,
            public_id: true,
            type: true,
          },
        },
      },
    });

    if (!availableCourse) {
      return NextResponse.json(new ApiResponse(404, 'Course not found', {}), { status: 404 });
    }

    if (user.role !== 'ADMIN' && availableCourse.authorId !== user.id) {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const thumbnail = formData.get('thumbnail') as File | null;

    if (!title || !description) {
      return NextResponse.json(new ApiResponse(400, 'Please Provide All Details', {}), {
        status: 400,
      });
    }

    let thumbnailIdToUpdate: string | undefined;

    if (thumbnail && thumbnail.size > 0) {
      if (!thumbnail.type.startsWith('image/')) {
        return NextResponse.json(new ApiResponse(400, 'Only image files are acceptable', {}), {
          status: 400,
        });
      }

      const uploadResult = await uploadToCloudinary(thumbnail);

      if (!uploadResult) {
        return NextResponse.json(new ApiResponse(500, 'Failed to upload the Thumbnail', {}), {
          status: 500,
        });
      }

      const file = await prisma.file.create({
        data: {
          url: uploadResult.url,
          public_id: uploadResult.public_id,
          size: uploadResult.bytes,
          type: FileType.IMAGE,
          uploadedBy: user.id,
        },
      });

      thumbnailIdToUpdate = file.id;
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        ...(thumbnailIdToUpdate ? { thumbnailId: thumbnailIdToUpdate } : {}),
      },
    });

    if (thumbnailIdToUpdate && availableCourse.thumbnail) {
      try {
        await deleteFromCloudinary(
          availableCourse.thumbnail.public_id,
          FileTypeToResourceType[availableCourse.thumbnail.type]
        );
      } catch {}

      try {
        await prisma.file.delete({
          where: {
            id: availableCourse.thumbnail.id,
          },
        });
      } catch {}
    }

    return NextResponse.json(new ApiResponse(200, 'Course Updated SuccessFully', updatedCourse), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(new ApiResponse(400, 'Internal server error', {}), {
      status: 400,
    });
  }
};
