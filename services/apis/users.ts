export type AdminUserRow = {
  id: string;
  image: string | null;
  username: string;
  email: string;
  role: string;
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
