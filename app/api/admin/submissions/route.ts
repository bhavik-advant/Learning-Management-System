import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { prisma } from '@/utils/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserDetails();
    const clerkId = user.clerkId;

    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!currentUser || currentUser.role === 'TRAINEE' || currentUser.role === 'MENTOR') {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), { status: 403 });
    }

    const submissionsRaw = await prisma.submission.findMany({
      orderBy: {
        submittedAt: 'desc',
      },
      include: {
        student: {
          select: {
            id: true,
            username: true,
            mentor: {
              select: {
                username: true,
              },
            },
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
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

    const submissions = submissionsRaw.map(s => ({
      id: s.id,
      fileUrl: s.fileUrl,
      score: s.score,
      feedback: s.feedback,
      status: s.status,
      submittedAt: s.submittedAt,
      gradedAt: s.gradedAt,

      student: {
        id: s.student.id,
        name: s.student.username,
        mentorName: s.student.mentor?.username ?? 'Not Assigned',
      },

      assignment: {
        id: s.assignment.id,
        title: s.assignment.title,
      },

      course: {
        id: s.assignment.module?.course?.id,
        title: s.assignment.module?.course?.title ?? 'Unknown',
      },
    }));
    // console.log(submissions);

    return NextResponse.json(
      new ApiResponse(200, 'Submissions fetched successfully', submissions),
      { status: 200 }
    );
  } catch (err) {
    console.error('GET SUBMISSIONS ERROR:', err);

    return NextResponse.json(new ApiResponse(500, 'Error fetching submissions', {}), {
      status: 500,
    });
  }
}
