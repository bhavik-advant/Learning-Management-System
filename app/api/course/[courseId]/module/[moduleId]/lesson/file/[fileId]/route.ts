import getUserDetails from '@/lib/isAuth';
import { deleteFromCloudinary } from '@/services/external/cloudinary';
import ApiResponse from '@/utils/api-response';
import { FileTypeToResourceType } from '@/utils/file-type-map';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; fileId: string }> }
) => {
  try {
    const user = await getUserDetails();

    const { courseId, fileId } = await params;

    const courseDetails = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        authorId: true,
      },
    });

    if (!courseDetails) {
      return NextResponse.json(new ApiResponse(500, 'Course Not Found', {}), { status: 500 });
    }

    if (courseDetails.authorId != user.id && user.role !== 'ADMIN') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

    const fileDetails = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!fileDetails) {
      return NextResponse.json(new ApiResponse(500, 'File Not Found', {}), { status: 500 });
    }

    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    await deleteFromCloudinary(fileDetails.public_id, FileTypeToResourceType[fileDetails.type]);

    return NextResponse.json(new ApiResponse(201, 'Resource Uploaded Successfully', {}), {
      status: 201,
    });
  } catch (error) {
    const errorMessge = error instanceof Error ? error.message : 'Failed to Delete File';
    return NextResponse.json(new ApiResponse(500, errorMessge, {}), {
      status: 500,
    });
  }
};
