import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma-client';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';

export async function GET() {
  try {
    const user = await getUserDetails();

    const submissions = await prisma.submission.findMany({
      where: {
        studentId: user.id,
      },
      orderBy: {
        submittedAt: 'desc',
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            maxScore: true,
            module: {
              select: {
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
      },
    });
    // console.log(submissions);

    return NextResponse.json(new ApiResponse(200, 'Submissions fetched', submissions), {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json(new ApiResponse(500, 'Error fetching submissions', {}), {
      status: 500,
    });
  }
}
