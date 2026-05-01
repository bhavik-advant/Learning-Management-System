export const getAdminDashboard = async () => {
  const res = await fetch('/api/admin/dashboard', {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  const result = await res.json();
  return result.data;
};
