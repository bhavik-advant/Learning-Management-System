import { NextRequest, NextResponse } from 'next/server';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';

import {
  getSubmissionMentorId,
  getSubmissionById,
  updateSubmissionByMentor,
} from '@/services/repository/submission';
import { userRoleCheck } from '@/utils/checkUserRole';
import { createNotification } from '@/services/repository/notification';

const sendResponse = (status: number, message: string, data: unknown) =>
  NextResponse.json(new ApiResponse(status, message, data), { status });

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await params;

    const user = await getUserDetails();

    if (userRoleCheck.isTrainee(user.role)) {
      return sendResponse(403, 'Unauthorised', {});
    }

    if (user.role === 'MENTOR') {
      const validation = await getSubmissionMentorId(submissionId);

      if (!validation) {
        return sendResponse(404, 'Submission not found', {});
      }

      if (validation.student.mentorId !== user.id) {
        return sendResponse(403, 'Not authorised to view Submission', {});
      }
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

    const submission = await getSubmissionById(submissionId);

    if (!submission) {
      return sendResponse(404, 'Submission not found', {});
    }

    if (score && score > submission.assignment.maxScore) {
      return sendResponse(
        400,
        `Score cannot be greater than ${submission.assignment.maxScore}`,
        {}
      );
    }

    if (userRoleCheck.isMentor(user.role)) {
      const submissionDetails = await getSubmissionMentorId(submissionId);

      if (!submissionDetails) {
        return sendResponse(404, 'Submission not found', {});
      }

      if (submissionDetails.student.mentorId !== user.id) {
        return sendResponse(403, 'Unauthorised', {});
      }
    }

    const updatedSubmission = await updateSubmissionByMentor({
      submissionId,
      feedback,
      score,
    });

    await createNotification({
      userId: updatedSubmission.studentId,
      message: `Your submission for ${updatedSubmission.assignment.title} has been reviewed.`,
      link: `/app/submissions/${updatedSubmission.id}`,
    });

    return sendResponse(200, 'Submission updated successfully', updatedSubmission);
  } catch (error) {
    console.error('Error updating submission:', error);
    return sendResponse(500, 'Error updating submission', {});
  }
}
