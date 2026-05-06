import getUserDetails from '@/lib/isAuth';
import { getModuleById } from '@/services/repository/module';
import ApiResponse from '@/utils/api-response';
import { NextRequest, NextResponse } from 'next/server';
import { createLesson } from '@/services/repository/lesson';
import { checkCourseCrudAccess } from '@/utils/checkCourseCrudAccess';

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string; courseId: string }> }
) => {
  try {
    const { moduleId, courseId } = await params;
    const user = await getUserDetails();

    const haveAccess = await checkCourseCrudAccess({ courseId, user });

    if (!haveAccess) {
      return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
    }

    const moduleDetails = await getModuleById({ moduleId });

    if (!moduleDetails) {
      return NextResponse.json(new ApiResponse(403, 'Module Not Found', {}), { status: 403 });
    }

    const body = await req.json();

    const { title, content }: { title: string; content: string } = body;

    if (title.trim() == '' && content.trim() == '') {
      return NextResponse.json(new ApiResponse(403, 'Please Provide all Details', {}), {
        status: 403,
      });
    }

    const lesson = await createLesson({ title, content, moduleId });

    return NextResponse.json(new ApiResponse(201, 'Lesson Uploaded Successfully', lesson), {
      status: 201,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(new ApiResponse(500, errorMessage, {}), { status: 500 });
  }
};
