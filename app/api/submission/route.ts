import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma-client';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserDetails();

    const submissions = await prisma.submission.findMany({
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
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return NextResponse.json(
      new ApiResponse(200, 'All submissions fetched successfully', submissions),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching submissions:', err);
    return NextResponse.json(
      new ApiResponse(500, 'Error fetching submissions', {}),
      { status: 500 }
    );
  }
}
