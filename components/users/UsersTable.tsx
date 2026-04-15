'use client';

import Link from 'next/link';
import StatusBadge from '../assignments/StatusBadge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserRole } from '@/services/apis/users';
import { useState } from 'react';

type UserRow = {
  id: string;
  image: string | null;
  username: string;
  email: string;
  role: string;
};

const roles = ['ADMIN', 'MENTOR', 'TRAINEE'];

const Users: React.FC<{ users: UserRow[] }> = ({ users }) => {
  const queryClient = useQueryClient();
  const [activeUser, setActiveUser] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      updateUserRole(userId, role),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users-with-stats'] });
      setActiveUser(null);
    },
  });

  const handleRoleChange = (userId: string, role: string) => {
    mutate({ userId, role });
  };

  return (
    <div className="w-full overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700 my-5 shadow-sm bg-white/70 dark:bg-gray-900/60 backdrop-blur">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100/70 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-6 py-3 font-medium">Username</th>
            <th className="px-6 py-3 font-medium">Email</th>
            <th className="px-6 py-3 font-medium">Role</th>
            <th className="px-6 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(item => (
            <tr
              key={item.id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50/70 dark:hover:bg-gray-800/60 transition"
            >
              <td className="px-6 py-4">
                <p className="font-medium">{item.username}</p>
              </td>

              <td className="px-6 py-4">
                <p className="font-medium text-gray-600 dark:text-gray-300">{item.email}</p>
              </td>

              <td className="px-6 py-4 relative">
                <div
                  onClick={() => setActiveUser(prev => (prev === item.id ? null : item.id))}
                  className="inline-block cursor-pointer"
                >
                  <StatusBadge status={item.role} />
                </div>

                {activeUser === item.id && (
                  <div className="absolute left-0 top-full z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg w-32">
                    {roles.map(role => (
                      <button
                        key={role}
                        disabled={isPending}
                        onClick={() => handleRoleChange(item.id, role)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </td>

              <td className="px-6 py-4 text-right">
                <Link
                  href={`users/${item.id}`}
                  className="bg-gray-900 text-white rounded-xl px-4 py-2 text-sm hover:opacity-90 transition"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && <div className="text-center py-12 text-gray-500">No Users yet</div>}
    </div>
  );
};

export default Users;
