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

    const submissions = await prisma.submission.findMany({
      where: {
        assignmentId,
        studentId: user.id,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
    console.log(submissions);

    return NextResponse.json(new ApiResponse(200, 'Submissions fetched', submissions), {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json(new ApiResponse(500, 'Error fetching submissions', {}), {
      status: 500,
    });
  }
}
