import { Bell } from 'lucide-react';

export const EmptyNotificationState = () => {
  return (
    <div className="rounded-3xl mt-5 border border-dashed border-gray-300 bg-white dark:bg-gray-800 p-10 text-center">
      <Bell className="mx-auto h-10 w-10 text-gray-400" />
      <h3 className="mt-4 text-xl font-semibold">No notifications</h3>
      <p className="mt-2 text-gray-500">You don&apos;t have any notifications yet.</p>
    </div>
  );
};
