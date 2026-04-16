
import Image from 'next/image';
import Link from 'next/link';
import StatusBadge from '../assignments/StatusBadge';

type UserRow = {
  id: string;
  image: string | null;
  username: string;
  email: string;
  role: string;
};

const Users: React.FC<{ users: UserRow[] }> = ({ users }) => {
  const getInitials = (value: string) =>
    value
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('');

  return (
    <div className="space-y-6">
      {users.length === 0 ? (
        <div className=" overflow-hidden rounded-3xl border border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-950/30 backdrop-blur-xl">
          <div className=" flex flex-col items-center justify-center py-16 text-center text-gray-600 dark:text-gray-300 px-6">
            <div className="mb-4 grid place-items-center h-12 w-12 rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold">No users yet</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Users will appear here once they sign up.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {users.map(item => {
            const initials = getInitials(item.username || item.email);
            return (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-3xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 backdrop-blur-xl shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
            
                <div className="relative p-6 space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-950/30 shadow-sm">
                      {item.image ? (
                        <Image src={item.image} alt={item.username} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-sm font-bold text-gray-900 dark:text-white bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                          {initials}
                        </div>
                      )}
                    </div>

                    <div>
                        <StatusBadge status={item.role} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-[18px] font-semibold text-gray-900 dark:text-white truncate">
                      {item.username}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{item.email}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span>ID: {item.id.slice(0, 8)}...</span>
                  </div>

                  <Link
                    href={`users/${item.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/30 text-sm font-medium hover:bg-white/80 dark:hover:bg-gray-950/50 transition"
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Users;
