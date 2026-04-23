import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma-client';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const user = await getUserDetails();
    const { submissionId } = await params;

    if (user.role == 'TRAINEE') {
      return NextResponse.json(new ApiResponse(403, 'Unauthorised', {}), { status: 403 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            maxScore: true,
            module: {
              select: {
                id: true,
                title: true,
                course: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(new ApiResponse(404, 'Submission not found', {}), { status: 404 });
    }

    return NextResponse.json(new ApiResponse(200, 'Submission fetched successfully', submission), {
      status: 200,
    });
  } catch (err) {
    console.error('Error fetching submission:', err);
    return NextResponse.json(new ApiResponse(500, 'Error fetching submission', {}), {
      status: 500,
    });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const user = await getUserDetails();
    const { submissionId } = await params;
    const body = await req.json();
    const { feedback, score } = body;

    // Fetch submission to verify it exists
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(new ApiResponse(404, 'Submission not found', {}), { status: 404 });
    }

    // Update submission with feedback and/or score
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        feedback: feedback || submission.feedback,
        score: score !== undefined && score !== null ? score : submission.score,
        status: score !== undefined ? 'GRADED' : submission.status,
        gradedAt: score !== undefined ? new Date() : submission.gradedAt,
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            maxScore: true,
            module: {
              select: {
                id: true,
                title: true,
                course: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      new ApiResponse(200, 'Submission updated successfully', updatedSubmission),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating submission:', err);
    return NextResponse.json(new ApiResponse(500, 'Error updating submission', {}), {
      status: 500,
    });
  }
}
