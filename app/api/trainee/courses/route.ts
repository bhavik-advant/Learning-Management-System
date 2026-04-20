import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma-client';
import getUserDetails from '@/lib/isAuth';

export async function GET() {
  try {
    const user = await getUserDetails();

    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        course: {
          include: {
            thumbnail: true,
            author: {
              select: {
                username: true,
              },
            },
            modules: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const courses = enrollments.map(e => ({
      id: e.course.id,
      title: e.course.title,
      description: e.course.description,
      thumbnail: e.course.thumbnail?.url || '/default.jpg',
      author: e.course.author.username,
      status: e.course.status,
      createdAt: e.course.createdAt,
      modulesCount: e.course.modules.length,
      authorId: e.course.authorId,
      thumbnailId: e.course.thumbnailId,
    }));

    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
