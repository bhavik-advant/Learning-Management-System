import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma-client';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { uploadToCloudinary } from '@/services/external/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserDetails();

    const formData = await req.formData();
    const assignmentId = formData.get('assignmentId') as string;
    const file = formData.get('file') as File;

    if (!assignmentId || !file) {
      return NextResponse.json(new ApiResponse(400, 'Missing fields', {}), { status: 400 });
    }

    const allowedTypes = [
      'application/pdf',
      'application/zip',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(new ApiResponse(400, 'Invalid file type', {}), { status: 400 });
    }

    const upload = await uploadToCloudinary(file);

<<<<<<< HEAD
    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: user.id,
        fileUrl: upload.url,
        submittedAt: new Date(),
=======
    const submission = await prisma.submission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: user.id,
        },
      },
      update: {
        fileUrl: upload.url,
        status: 'RESUBMITTED',
        submittedAt: new Date(),
      },
      create: {
        assignmentId,
        studentId: user.id,
        fileUrl: upload.url,
>>>>>>> b5e82bb864556b29707b3e941df9d8548886f784
      },
    });

    return NextResponse.json(new ApiResponse(200, 'Submitted successfully', submission), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(new ApiResponse(500, 'Submission failed', {}), { status: 500 });
  }
}
