import { NextRequest, NextResponse } from 'next/server';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';

import { getStudentSubmissions } from '@/services/repository/submission';
import { SubmissionStatus } from '@/generated/prisma/enums';

const sendResponse = (status: number, message: string, data: unknown) =>
  NextResponse.json(new ApiResponse(status, message, data), { status });

export async function GET(req: NextRequest) {
  try {
    const user = await getUserDetails();

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = (searchParams.get('status') as SubmissionStatus | 'ALL') || 'ALL';

    const submissions = await getStudentSubmissions({ studentId: user.id, search, status });

    return sendResponse(200, 'Submissions fetched', submissions);
  } catch (error) {
    console.error('GET STUDENT SUBMISSIONS ERROR:', error);

    return sendResponse(500, 'Error fetching submissions', {});
  }
}
