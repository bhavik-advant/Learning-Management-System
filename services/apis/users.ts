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

export async function getUsers() {
  const res = await fetch('/api/user/userlist');
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to fetch users');
  }

  return json.data;
}

export const getUserById = async (id: string) => {
  const res = await fetch(`/api/user/${id}`);

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to update role');
  }

  return json.data as AdminUserDetails;
};

export const getMentors = async () => {
  const res = await fetch('/api/user/mentors');
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
  const res = await fetch(`/api/user/${userId}`, {
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

export const getAssignableUsers = async () => {
  const res = await fetch('/api/user');

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await res.json();
  return data.data;
};
