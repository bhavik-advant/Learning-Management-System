import { NextRequest, NextResponse } from 'next/server';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { uploadToCloud } from '@/services/external/cloudinary';
import { createSubmission } from '@/services/repository/submission';
import { createFile } from '@/services/repository/file';
import { createNotification } from '@/services/repository/notification';
import { getAssignmentById } from '@/services/repository/assignment';
import { FileType } from '@/types/file';
import ApiError from '@/utils/api-error';
import sendError from '@/utils/send-error';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserDetails();

    const formData = await req.formData();

    const assignmentId = formData.get('assignmentId') as string;
    const file = formData.get('file') as File | null;
    const githubLink = formData.get('githubLink') as string | null;
    const type = formData.get('type') as 'FILE' | 'LINK';

    if (!assignmentId || !type) {
      throw new ApiError(400, 'Assignment ID and submission type are required');
    }

    const assignemntDetails = await getAssignmentById({ assignmentId });

    if (!assignemntDetails) {
      throw new ApiError(404, 'Assignment not found');
    }

    if (type === 'FILE') {
      if (!file) {
        throw new ApiError(400, 'File is required for file submission');
      }

      const allowedTypes = [
        'application/pdf',
        'application/zip',
        'application/x-zip-compressed',
        'multipart/x-zip',
        'application/octet-stream',
        'image/png',
        'image/jpeg',
        'image/jpg',
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new ApiError(400, 'Unsupported file type');
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

      if (user.mentorId) {
        await createNotification({
          userId: user.mentorId,
          message: `New Submission of Assignment ${assignemntDetails.title} for Review`,
          link: `/app/review-submission/${submission.id}`,
        });
      }

      return NextResponse.json(new ApiResponse(200, 'File submitted successfully', submission), {
        status: 200,
      });
    }

    // LINK SUBMISSION
    if (type === 'LINK') {
      if (!githubLink || !githubLink.trim()) {
        throw new ApiError(400, 'GitHub link is required for link submission');
      }

      if (!githubLink.includes('github.com')) {
        throw new ApiError(400, 'Invalid GitHub link');
      }

      const submission = await createSubmission({
        assignmentId,
        studentId: user.id,
        githubLink: githubLink.trim(),
      });

      if (user.mentorId) {
        await createNotification({
          userId: user.mentorId!,
          message: `New Submission of Assignment ${assignemntDetails.title} for Review`,
          link: `/app/review-submission/${submission.id}`,
        });
      }

      return NextResponse.json(new ApiResponse(200, 'Link submitted successfully', submission), {
        status: 200,
      });
    }

    return NextResponse.json(new ApiResponse(400, 'Invalid submission type', {}), { status: 400 });
  } catch (error) {
    return sendError(error, 'Failed to submit assignment');
  }
}
