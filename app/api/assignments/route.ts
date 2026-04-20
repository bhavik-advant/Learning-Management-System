import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma-client';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';

export async function GET() {
  try {
    const user = await getUserDetails();

    const assignments = await prisma.assignment.findMany({
      where: {
        module: {
          course: {
            enrollments: {
              some: {
                studentId: user.id,
              },
            },
          },
        },
      },
      include: {
        module: {
          select: {
            title: true,
            course: {
              select: {
                title: true,
              },
            },
          },
        },
        submissions: {
          where: {
            studentId: user.id,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formatted = assignments.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      dueDate: a.dueDate,
      maxScore: a.maxScore,
      moduleTitle: a.module.title,
      courseTitle: a.module.course.title,
      submission: a.submissions[0] || null,
    }));

    return NextResponse.json(new ApiResponse(200, 'Assignments fetched', formatted), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(new ApiResponse(500, 'Failed to fetch assignments', {}), {
      status: 500,
    });
  }
}
