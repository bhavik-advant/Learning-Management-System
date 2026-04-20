export type AdminUserRow = {
  id: string;
  image: string | null;
  username: string;
  email: string;
  role: string;
};

export type AdminUserDetails = {
  id: string;
  image: string | null;
  username: string;
  email: string;
  role: 'ADMIN' | 'MENTOR' | 'TRAINEE';
  mentorId: string | null;
  mentorName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MentorOption = {
  id: string;
  username: string;
  email: string;
};

export type AdminUsersWithStatsResponse = {
  users: AdminUserRow[];
  stats: {
    totalUsers: number;
    totalTrainees: number;
    totalMentors: number;
  };
  pendingCourseApprovals: number;
};

export async function fetchAdminUsersWithStats(): Promise<AdminUsersWithStatsResponse> {
  const res = await fetch('/api/admin/users');
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to fetch users');
  }

  return json.data as AdminUsersWithStatsResponse;
}

export async function updateUserRole(userId: string, role: string) {
  const res = await fetch(`/api/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to update role');
  }

  return json.data;
}

export const getUserById = async (id: string) => {
  const res = await fetch(`/api/admin/users/${id}`);

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to update role');
  }

  return json.data as AdminUserDetails;
};

export const getMentors = async () => {
  const res = await fetch('/api/admin/users/mentors');
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to fetch mentors');
  }

  return json.data as MentorOption[];
};

export const updateUserDetails = async (
  userId: string,
  payload: {
    username: string;
    image: string;
    role: 'ADMIN' | 'MENTOR' | 'TRAINEE';
    mentorId: string | null;
  }
) => {
  const res = await fetch(`/api/admin/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to update user details');
  }

  return json.data as AdminUserDetails;
};

export const getAllTrainee = async () => {
  const res = await fetch(`/api/user/trainee`);

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to update role');
  }

  return json.data;
};
