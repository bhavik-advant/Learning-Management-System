import { NextRequest, NextResponse } from 'next/server';
import ApiResponse from '@/utils/api-response';
import { getFormattedAssignableCourses } from '@/services/repository/course';

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;

    const limit = Number(searchParams.get('limit')) || 3;
    const page = Number(searchParams.get('page')) || 1;
    const traineeId = searchParams.get('traineeId');
    const skip = (page - 1) * limit;

    if (!traineeId) {
      return NextResponse.json(new ApiResponse(401, 'Trainee Id is required', {}), { status: 401 });
    }

    const assignableCourses = await getFormattedAssignableCourses({ traineeId, page, limit, skip });

    return NextResponse.json(
      new ApiResponse(200, 'Assignable courses fetched successfully', assignableCourses),
      {
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch assignable courses';
    return NextResponse.json(new ApiResponse(500, errorMessage, {}), { status: 500 });
  }
};
