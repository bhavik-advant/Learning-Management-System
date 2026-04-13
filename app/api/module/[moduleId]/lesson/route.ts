// api/module/[moduleId]/lesson/route.ts
import { uploadToCloudinary } from '@/services/external/cloudinary';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(new ApiResponse(401, 'Please login first', {}), { status: 401 });
    }

    if (user.role === 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

    const formData = await req.formData();

    const moduleId = formData.get('moduleId') as string;
    const lesson = formData.get('lesson') as File;

    if (!moduleId || !lesson) {
      return NextResponse.json(new ApiResponse(400, 'Please Provide All details', {}), {
        status: 400,
      });
    }

    console.log('lesson is ', lesson);

    const result = await uploadToCloudinary(lesson);

    if (!result) {
      return NextResponse.json(new ApiResponse(400, 'Failed to upload Given Resource', {}), {
        status: 400,
      });
    }

    const { public_id, bytes, url } = result;

    const file = await prisma.file.create({
      data: {
        public_id: public_id,
        size: bytes,
        url,
        type: 'VIDEO',
        uploadedBy: user.id,
      },
    });

    if (!file) {
      return NextResponse.json(new ApiResponse(400, 'Failed to upload file', {}), {
        status: 400,
      });
    }

    const lessonCount = await prisma.lesson.count({
      where: {
        moduleId,
      },
    });

    const createdLesson = await prisma.lesson.create({
      data: {
        title: lesson.name,
        description: '',
        videoFileId: file.id,
        order: lessonCount + 1,
        moduleId,
      },
    });

    if (!createdLesson) {
      return NextResponse.json(new ApiResponse(400, 'Failes to upload lesson', {}), {
        status: 400,
      });
    }

    return NextResponse.json(new ApiResponse(201, 'Lesson Uploaded Successfully', createdLesson), {
      status: 201,
    });
  } catch (error) {
    console.log('Failed To Add Lesson ', error);
  }
};
