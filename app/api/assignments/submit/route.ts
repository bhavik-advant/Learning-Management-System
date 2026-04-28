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
    const file = formData.get('file') as File | null;
    const githubLink = formData.get('githubLink') as string | null;
    const type = formData.get('type') as 'FILE' | 'LINK';

    if (!assignmentId || !type) {
      return NextResponse.json(new ApiResponse(400, 'Missing fields', {}), { status: 400 });
    }

    if (type === 'FILE') {
      if (!file) {
        return NextResponse.json(new ApiResponse(400, 'File is required', {}), {
          status: 400,
        });
      }

      const allowedTypes = [
        'application/pdf',
        'application/zip',
        'image/png',
        'image/jpeg',
        'image/jpg',
      ];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(new ApiResponse(400, 'Invalid file type', {}), {
          status: 400,
        });
      }

      const upload = await uploadToCloudinary(file);

      const submission = await prisma.submission.create({
        data: {
          assignmentId,
          studentId: user.id,
          fileUrl: upload.url,
          githubLink: null,
          submittedAt: new Date(),
        },
      });

      return NextResponse.json(new ApiResponse(200, 'File submitted successfully', submission), {
        status: 200,
      });
    }

    if (type === 'LINK') {
      if (!githubLink || !githubLink.trim()) {
        return NextResponse.json(new ApiResponse(400, 'GitHub link is required', {}), {
          status: 400,
        });
      }

      if (!githubLink.includes('github.com')) {
        return NextResponse.json(new ApiResponse(400, 'Invalid GitHub link', {}), {
          status: 400,
        });
      }

      const submission = await prisma.submission.create({
        data: {
          assignmentId,
          studentId: user.id,
          fileUrl: null,
          githubLink: githubLink.trim(),
          submittedAt: new Date(),
        },
      });

      return NextResponse.json(new ApiResponse(200, 'Link submitted successfully', submission), {
        status: 200,
      });
    }

    return NextResponse.json(new ApiResponse(400, 'Invalid submission type', {}), {
      status: 400,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(new ApiResponse(500, 'Submission failed', {}), {
      status: 500,
    });
  }
}
