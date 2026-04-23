export const getDashBoardData = async () => {
  try {
    const res = await fetch(`/api/mentor/dashboard`);

    const result = await res.json();

    console.log(result);

    if (!result.success || result.statusCode != 200) {
      throw new Error(result.message);
    }

    console.log(result);

    return result.data;
  } catch (error) {
    console.error('DashBaord Data fetching done:', error);
    throw error;
  }
};

// services/apis/admin.ts

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
