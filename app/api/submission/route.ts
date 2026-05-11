import { NextResponse } from 'next/server';
import getUserDetails from '@/lib/isAuth';
import ApiResponse from '@/utils/api-response';

import {
  getAllSubmissionsForAdmin,
  getSubmissionsForMentor,
} from '@/services/repository/submission';

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

const roleHandlers: Record<Role, (userId: string) => Promise<SubmissionWithRelations[]>> = {
  ADMIN: async () => getAllSubmissionsForAdmin(),
  MENTOR: async (userId: string) => getSubmissionsForMentor(userId),
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

export async function GET() {
  try {
    const user = await getUserDetails();

    if (!user) {
      return sendResponse(401, 'Please login first', {});
    }

    const handler = roleHandlers[user.role as Role];

    if (!handler) {
      return sendResponse(403, 'Not authorised', {});
    }

    const submissionsRaw = await handler(user.id);
    const submissions = submissionsRaw.map(mapSubmission);

    return sendResponse(200, 'Submissions fetched successfully', submissions);
  } catch (error) {
    console.error('GET SUBMISSIONS ERROR:', error);
    return sendResponse(500, 'Error fetching submissions', {});
  }
}
