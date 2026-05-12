import { NextRequest, NextResponse } from 'next/server';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';

import {
  getAllSubmissionsForAdmin,
  getSubmissionsForMentor,
} from '@/services/repository/submission';
import { PaginationDataType, SubmissionStatus } from '@/types/types';

type Role = 'ADMIN' | 'MENTOR';

type SubmissionWithRelations = {
  id: string;
  fileId: string | null;

  file: {
    id: string;
    url: string;
    public_id: string;
  } | null;
  githubLink: string | null;
  score: number | null;
  status: 'PENDING' | 'GRADED' | 'RESUBMITTED';
  submittedAt: Date;

  student: {
    username: string;
    mentor?: {
      username: string;
    } | null;
  };

  assignment: {
    id: string;
    title: string;
    module?: {
      course?: {
        title: string;
      } | null;
    } | null;
  };
};

type SubmissionResponse = {
  id: string;
  file: {
    id: string;
    url: string;
    public_id: string;
  } | null;
  githubLink: string | null;
  score: number | null;
  status: string;
  submittedAt: Date;

  student: {
    name: string;
    mentorName: string;
  };

  assignment: {
    id: string;
    title: string;
  };

  course: {
    title: string;
  };
};

const sendResponse = (status: number, message: string, data: unknown) =>
  NextResponse.json(new ApiResponse(status, message, data), { status });

const roleHandlers: Record<
  Role,
  (
    userId: string,
    search: string,
    status: SubmissionStatus[],
    limit: number,
    skip: number,
    page: number
  ) => Promise<{ submissions: SubmissionWithRelations[]; pagination: PaginationDataType }>
> = {
  ADMIN: async (
    _userId: string,
    search: string,
    status: SubmissionStatus[],
    limit: number,
    skip: number,
    page: number
  ) => getAllSubmissionsForAdmin({ search, status, page, limit, skip }),
  MENTOR: async (
    userId: string,
    search: string,
    status: SubmissionStatus[],
    limit: number,
    skip: number,
    page: number
  ) => getSubmissionsForMentor({ userId, search, status, limit, skip, page }),
};

const mapSubmission = (s: SubmissionWithRelations): SubmissionResponse => ({
  id: s.id,
  file: s.file
    ? {
        id: s.file.id,
        url: s.file.url,
        public_id: s.file.public_id,
      }
    : null,
  githubLink: s.githubLink,
  score: s.score,
  status: s.status,
  submittedAt: s.submittedAt,

  student: {
    name: s.student.username,
    mentorName: s.student.mentor?.username ?? 'N/A',
  },

  assignment: {
    id: s.assignment.id,
    title: s.assignment.title,
  },

  course: {
    title: s.assignment.module?.course?.title ?? 'Unknown',
  },
});

export async function GET(req: NextRequest) {
  try {
    const user = await getUserDetails();

    const handler = roleHandlers[user.role as Role];

    if (!handler) {
      return sendResponse(403, 'Not authorised', {});
    }

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = searchParams.get('page') || '1';
    const status = searchParams.getAll('status') as SubmissionStatus[];

    const pageNumber = parseInt(page, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      return sendResponse(400, 'Invalid page number', {});
    }
    const LIMIT = 10;

    const skip = (pageNumber - 1) * LIMIT;
    const submissionsRaw = await handler(user.id, search, status, LIMIT, skip, pageNumber);
    const submissions = submissionsRaw.submissions.map(mapSubmission);
    const pagination = submissionsRaw.pagination;

    return sendResponse(200, 'Submissions fetched successfully', { submissions, pagination });
  } catch (error) {
    console.error('GET SUBMISSIONS ERROR:', error);
    return sendResponse(500, 'Error fetching submissions', {});
  }
}
