import getUserDetails from '@/lib/isAuth';
import { NextRequest, NextResponse } from 'next/server';
import ApiResponse from '@/utils/api-response';
import { auth } from '@clerk/nextjs/server';
import {
  getUserByClerkId,
  getMentorById,
  updateUserById,
  getUserById,
} from '@/services/repository/user';
import { userRoleCheck } from '@/utils/checkUserRole';
import { createNotification } from '@/services/repository/notification';

export const GET = async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const currentUser = await getUserDetails();

    if (userRoleCheck.isTrainee(currentUser.role)) {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(new ApiResponse(400, 'User ID is required', null), { status: 400 });
    }

    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json(new ApiResponse(404, 'User not found', null), { status: 404 });
    }

    const payload = {
      ...user,
      mentorName: user.mentor?.username ?? null,
    };

    return NextResponse.json(new ApiResponse(200, 'User fetched successfully', payload), {
      status: 200,
    });
  } catch (error) {
    console.error('GET USER DETAILS ERROR:', error);

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', null), {
      status: 500,
    });
  }
};

// PATCH /api/users/:id — admin can update user details

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(new ApiResponse(401, 'Please login first', null), { status: 401 });
    }

    const currentUser = await getUserByClerkId(clerkId);

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(new ApiResponse(403, 'Forbidden', null), { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(new ApiResponse(400, 'User ID is required', null), { status: 400 });
    }

    const body = await req.json();
    const { role, mentorId } = body;

    const existingUser = await getUserById(id);

    if (!existingUser) {
      return NextResponse.json(new ApiResponse(404, 'User not found', null), { status: 404 });
    }

    const nextRole = role ?? existingUser.role;
    let nextMentorId = mentorId;

    if (!userRoleCheck.isTrainee(nextRole)) {
      nextMentorId = null;
    } else if (nextMentorId) {
      const mentor = await getMentorById(nextMentorId);

      if (!mentor || mentor.role !== 'MENTOR') {
        return NextResponse.json(new ApiResponse(400, 'Invalid mentor selected', null), {
          status: 400,
        });
      }
    }

    const updatedUser = await updateUserById(id, {
      role: nextRole,
      mentorId: userRoleCheck.isTrainee(nextRole) ? (nextMentorId ?? existingUser.mentorId) : null,
    });

    const mentor =
      updatedUser.mentorId && userRoleCheck.isTrainee(updatedUser.role)
        ? await getMentorById(updatedUser.mentorId)
        : null;

    const payload = {
      ...updatedUser,
      mentorName: mentor?.username ?? null,
    };

    if (role) {
      await createNotification({
        userId: updatedUser.id,
        message: `Your role has been updated to ${role}`,
       
      });
    }

    return NextResponse.json(new ApiResponse(200, 'User updated successfully', payload), {
      status: 200,
    });
  } catch (error) {
    console.error('UPDATE USER DETAILS ERROR:', error);

    return NextResponse.json(new ApiResponse(500, 'Internal Server Error', null), {
      status: 500,
    });
  }
};
