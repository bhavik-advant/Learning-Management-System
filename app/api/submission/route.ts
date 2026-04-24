import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma-client';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';

export async function GET() {
  try {
    const user = await getUserDetails();

    if (user.role != 'MENTOR') {
      return NextResponse.json(new ApiResponse(400, 'Not authorised', {}), { status: 400 });
    }

    const submissions = await prisma.submission.findMany({
      where: {
        assignment: {
          module: {
            course: {
              enrollments: {
                some: {
                  student: {
                    mentorId: user.id,
                  },
                },
              },
            },
          },
        },
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
            mentor: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    const formatted = submissions.map(s => ({
      id: s.id,
      status: s.status,
      fileUrl: s.fileUrl,
      score: s.score,
      maxScore: s.assignment.maxScore,
      submittedAt: s.submittedAt,
      student: {
        name: s.student.username,
        mentorName: s.student.mentor?.username || 'N/A',
      },
      course: {
        title: s.assignment.module.course.title,
      },
      assignment: {
        title: s.assignment.title,
      },
    }));

    return NextResponse.json(
      new ApiResponse(200, 'All submissions fetched successfully', formatted),

      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching submissions:', err);
    return NextResponse.json(new ApiResponse(500, 'Error fetching submissions', {}), {
      status: 500,
    });
  }
}
