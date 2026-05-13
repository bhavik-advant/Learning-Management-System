import { Bell } from 'lucide-react';

export const NotificationHeader = () => {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2c2c31] text-white shadow-md">
          <Bell className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-3xl">Notifications</h1>
          <p className="mt-2 text-base text-gray-500 md:text-lg">
            Stay updated with all your activities and alerts
          </p>
        </div>
      </div>
    </div>
  );
};
