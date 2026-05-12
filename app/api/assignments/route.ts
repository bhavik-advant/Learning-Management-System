import { NextRequest, NextResponse } from 'next/server';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';
import { getAssignmentsWithSubmissions } from '@/services/repository/assignment';
import { AssignmentFilter } from '@/types/types';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserDetails();

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const filter = (searchParams.get('filter') as AssignmentFilter['statusFilter']) || 'ALL';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;

    const assignmentsWithPagination = await getAssignmentsWithSubmissions({
      userId: user.id,
      role: user.role,
      search,
      filter,
      limit: LIMIT,
      skip,
      page,
    });

    return NextResponse.json(
      new ApiResponse(200, 'Assignments fetched', assignmentsWithPagination),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('ASSIGNMENTS API ERROR:', error);

    return NextResponse.json(new ApiResponse(500, 'Failed to fetch assignments', {}), {
      status: 500,
    });
  }
}
