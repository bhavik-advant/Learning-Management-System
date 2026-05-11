import { NextRequest, NextResponse } from 'next/server';

import getUserDetails from '@/lib/isAuth';

import ApiResponse from '@/utils/api-response';

import { getAssignmentWithSubmission } from '@/services/repository/submission';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const user = await getUserDetails();

    const { assignmentId } = await params;

    const assignment = await getAssignmentWithSubmission({
      assignmentId,
      studentId: user.id,
    });

    if (!assignment) {
      return NextResponse.json(new ApiResponse(404, 'Assignment not found', {}), { status: 404 });
    }

    let status = 'NOT_SUBMITTED';

    let latestSubmission = null;
    if (assignment.submissions.length > 0) {
      latestSubmission = assignment.submissions[0];

      status = latestSubmission.score !== null ? 'GRADED' : latestSubmission.status;
    }

    const formatted = {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      maxScore: assignment.maxScore,
      status,
      latestSubmission: latestSubmission
        ? {
            id: latestSubmission.id,

            githubLink: latestSubmission.githubLink,

            score: latestSubmission.score,

            feedback: latestSubmission.feedback,

            submittedAt: latestSubmission.submittedAt,

            file: latestSubmission.file
              ? {
                  id: latestSubmission.file.id,
                  url: latestSubmission.file.url,
                  public_id: latestSubmission.file.public_id,
                  type: latestSubmission.file.type,
                  size: latestSubmission.file.size,
                }
              : null,
          }
        : null,
    };

    return NextResponse.json(new ApiResponse(200, 'Assignment fetched', formatted), {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(new ApiResponse(500, 'Error fetching assignment', {}), {
      status: 500,
    });
  }
}
