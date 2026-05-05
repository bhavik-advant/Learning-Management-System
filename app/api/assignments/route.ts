import { NextResponse } from 'next/server';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { getAssignmentsWithSubmissions } from '@/services/repository/assignment';

export async function GET() {
  try {
    const user = await getUserDetails();

    if (!user) {
      return NextResponse.json(new ApiResponse(401, 'Unauthorized', null), { status: 401 });
    }

    const assignments = await getAssignmentsWithSubmissions(user.id, user.role);

    return NextResponse.json(new ApiResponse(200, 'Assignments fetched', assignments), {
      status: 200,
    });
  } catch (error) {
    console.error('ASSIGNMENTS API ERROR:', error);

    return NextResponse.json(new ApiResponse(500, 'Failed to fetch assignments', {}), {
      status: 500,
    });
  }
}
