import { NextRequest, NextResponse } from 'next/server';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { uploadToCloud } from '@/services/external/cloudinary';
import { createSubmission } from '@/services/repository/submission';
import { createFile } from '@/services/repository/file';
import { FileType } from '@/generated/prisma/enums';

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

    // FILE SUBMISSION
    if (type === 'FILE') {
      if (!file) {
        return NextResponse.json(new ApiResponse(400, 'File is required', {}), { status: 400 });
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

      const upload = await uploadToCloud(file);

      // store in File table
      const uploadedFile = await createFile({
        url: upload.url,
        public_id: upload.public_id,
        size: file.size,
        userId: user.id,
        type: FileType.DOCUMENT,
      });

      // create submission
      const submission = await createSubmission({
        assignmentId,
        studentId: user.id,
        fileId: uploadedFile.id,
      });

      return NextResponse.json(new ApiResponse(200, 'File submitted successfully', submission), {
        status: 200,
      });
    }

    // LINK SUBMISSION
    if (type === 'LINK') {
      if (!githubLink || !githubLink.trim()) {
        return NextResponse.json(new ApiResponse(400, 'GitHub link is required', {}), {
          status: 400,
        });
      }

      if (!githubLink.includes('github.com')) {
        return NextResponse.json(new ApiResponse(400, 'Invalid GitHub link', {}), { status: 400 });
      }

      const submission = await createSubmission({
        assignmentId,
        studentId: user.id,
        githubLink: githubLink.trim(),
      });

      return NextResponse.json(new ApiResponse(200, 'Link submitted successfully', submission), {
        status: 200,
      });
    }

    return NextResponse.json(new ApiResponse(400, 'Invalid submission type', {}), { status: 400 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(new ApiResponse(500, 'Submission failed', {}), { status: 500 });
  }
}
