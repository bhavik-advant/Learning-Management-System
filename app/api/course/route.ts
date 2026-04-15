// api/course/route.ts
import { FileType } from '@/generated/prisma/enums';
import getUserDetails from '@/lib/isAuth';
import { uploadToCloudinary } from '@/services/external/cloudinary';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
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

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const thumbnail = formData.get('thumbnail') as File | null;

    if (!title || !description || !thumbnail) {
      return NextResponse.json(new ApiResponse(400, 'Please Provide All Details', {}), {
        status: 400,
      });
    }

    if (!thumbnail.type.startsWith('image/')) {
      return NextResponse.json(new ApiResponse(400, 'Only image files are acceptable', {}), {
        status: 400,
      });
    }

    const result = await uploadToCloudinary(thumbnail);

    if (!result) {
      return NextResponse.json(new ApiResponse(500, 'Failed to upload the Thumbnail', {}), {
        status: 500,
      });
    }

    const { url, public_id, bytes } = result;

    const file = await prisma.file.create({
      data: {
        url,
        public_id,
        size: bytes,
        type: FileType.IMAGE,
        uploadedBy: user.id,
      },
    });

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnailId: file.id,
        authorId: user.id,
      },
    });

    return NextResponse.json(new ApiResponse(201, 'Course Created Successfully', course), {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating course:', error);

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};
