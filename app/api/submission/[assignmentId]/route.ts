import { NextRequest, NextResponse } from 'next/server';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';

import { getSubmissionsByAssignmentAndStudent } from '@/services/repository/submission';

const sendResponse = (status: number, message: string, data: unknown) =>
  NextResponse.json(new ApiResponse(status, message, data), { status });

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const user = await getUserDetails();

    if (!user) {
      return sendResponse(401, 'Please login first', {});
    }

    const { assignmentId } = await params;

    const submissions = await getSubmissionsByAssignmentAndStudent(assignmentId, user.id);

    return sendResponse(200, 'Submissions fetched', submissions);
  } catch (error) {
    console.error('GET STUDENT SUBMISSIONS ERROR:', error);
    return sendResponse(500, 'Error fetching submissions', {});
  }
}
