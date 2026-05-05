import { NextRequest, NextResponse } from 'next/server';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';

import {
  getSubmissionMentorId,
  getSubmissionById,
  updateSubmissionByMentor,
} from '@/services/repository/submission';

const sendResponse = (status: number, message: string, data: unknown) =>
  NextResponse.json(new ApiResponse(status, message, data), { status });

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await params;

    const user = await getUserDetails();

    if (!user) return sendResponse(401, 'Please login first', {});

    if (user.role === 'TRAINEE') {
      return sendResponse(403, 'Unauthorised', {});
    }

    const validation = await getSubmissionMentorId(submissionId);

    if (!validation) {
      return sendResponse(404, 'Submission not found', {});
    }

    if (validation.student.mentorId !== user.id) {
      return sendResponse(403, 'Not authorised to view Submission', {});
    }

    const submission = await getSubmissionById(submissionId);

    return sendResponse(200, 'Submission fetched successfully', submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    return sendResponse(500, 'Error fetching submission', {});
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await params;

    const user = await getUserDetails();
    const body = await req.json();
    const { feedback, score } = body;

    if (!user) return sendResponse(401, 'Please login first', {});

    const validation = await getSubmissionMentorId(submissionId);

    if (!validation) {
      return sendResponse(404, 'Submission not found', {});
    }

    if (validation.student.mentorId !== user.id) {
      return sendResponse(403, 'Unauthorised', {});
    }

    const updatedSubmission = await updateSubmissionByMentor({
      submissionId,
      feedback,
      score,
    });

    return sendResponse(200, 'Submission updated successfully', updatedSubmission);
  } catch (error) {
    console.error('Error updating submission:', error);
    return sendResponse(500, 'Error updating submission', {});
  }
}
