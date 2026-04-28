import { FileType } from '@/generated/prisma/enums';
import getUserDetails from '@/lib/isAuth';
import {  uploadToCloudinary } from '@/services/external/cloudinary';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  try {
    const user = await getUserDetails();

    const { courseId } = await params;

    const courseDetails = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        authorId: true,
      },
    });

    if (!courseDetails) {
      return NextResponse.json(new ApiResponse(500, 'Course Not Found', {}), { status: 500 });
    }

    if (courseDetails?.authorId != user.id && user.role !== 'ADMIN') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

    const formData = await req.formData();

    const file = formData.get('resource') as File;

    if (!file || file.size <= 0) {
      return NextResponse.json(new ApiResponse(402, 'Please provide Valid File', {}), {
        status: 403,
      });
    }

    const result = await uploadToCloudinary(file);

    const { url, bytes, public_id, resource_type } = result;

    let fileType: FileType;

    if (resource_type === 'image') {
      fileType = FileType.IMAGE;
    } else if (resource_type === 'video') {
      fileType = FileType.VIDEO;
    } else {
      fileType = FileType.DOCUMENT;
    }

    const createdFile = await prisma.file.create({
      data: {
        url,
        public_id,
        size: bytes,
        type: fileType,
        uploadedBy: user.id,
      },
      select: {
        url: true,
        id: true,
      },
    });

    return NextResponse.json(new ApiResponse(201, 'Resource Uploaded Successfully', createdFile), {
      status: 201,
    });
  } catch (error) {
    const errorMessge = error instanceof Error ? error.message : 'Failed to upload File';
    return NextResponse.json(new ApiResponse(500, errorMessge, {}), {
      status: 500,
    });
  }
};

