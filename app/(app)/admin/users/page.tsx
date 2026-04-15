'use client';
import Users from '@/components/users/UsersTable';
import { fetchAdminUsersWithStats } from '@/services/apis/users';
import { useQuery } from '@tanstack/react-query';

export default function UsersPage() {
  const {
    data: usersPayload,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ['admin', 'users-with-stats'],
    queryFn: fetchAdminUsersWithStats,
  });

  const loading = usersLoading || usersLoading;
  const hasError = usersError || usersError;

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Loading Users</p>;
  }

  if (hasError && !loading) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Could not load Users data. Please refresh the page.
      </p>
    );
  }
  return (
    <div className="mx-8 space-y-5">
      <section>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Users</h2>
        </div>
        <Users users={usersPayload?.users ?? []} />
      </section>
    </div>
  );
}
