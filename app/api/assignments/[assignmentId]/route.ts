import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma-client';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const user = await getUserDetails();
    const { assignmentId } = await params;

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        submissions: {
          where: {
            studentId: user.id,
          },
          orderBy: {
            submittedAt: 'desc',
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(new ApiResponse(404, 'Assignment not found', {}), { status: 404 });
    }
    let status = 'NOT_SUBMITTED';
    if (assignment.submissions.length > 0) {
      const latest = assignment.submissions[0];
      status = latest.score !== null ? 'GRADED' : latest.status;
    }

    const formatted = {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      maxScore: assignment.maxScore,
      status,
    };

    return NextResponse.json(new ApiResponse(200, 'Assignment fetched', formatted), {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json(new ApiResponse(500, 'Error fetching assignment', {}), {
      status: 500,
    });
  }
}
