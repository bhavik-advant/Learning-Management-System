// api/course/route.ts
import { FileType } from '@/generated/prisma/enums';
import getUserDetails from '@/lib/isAuth';
import { uploadToCloudinary } from '@/services/external/cloudinary';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(new ApiResponse(401, 'Please Login First', {}), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(new ApiResponse(401, 'Please login first', {}), { status: 401 });
    }

    const include = {
      author: { select: { username: true } },
      thumbnail: { select: { url: true } },
    } as const;

    let courses;

    if (user.role === 'ADMIN') {
      courses = await prisma.course.findMany({
        include,
        orderBy: { createdAt: 'desc' },
      });
    } else if (user.role === 'MENTOR') {
      courses = await prisma.course.findMany({
        where: { authorId: user.id },
        include,
        orderBy: { createdAt: 'desc' },
      });
    } else {
      courses = await prisma.course.findMany({
        where: { status: 'APPROVED' },
        include,
        orderBy: { createdAt: 'desc' },
      });
    }

    const payload = courses.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      thumbnail: c.thumbnail?.url ?? '',
      author: c.author.username,
    }));

    return NextResponse.json(new ApiResponse(200, 'Courses fetched successfully', payload), {
      status: 200,
    });
  } catch (error) {
    console.error('GET courses error:', error);

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', {}), { status: 500 });
  }
};

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
