import Link from 'next/link';
import { Bell, Clock3, CalendarDays, Link2, ExternalLink, CheckCheck } from 'lucide-react';
import { Notification } from '@/generated/prisma/client';
import { useMarkNotificationAsRead } from '@/hooks/notification/useMarkNotificationAsRead';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

type NotificationItemProps = {
  isSelected: boolean;
  notification: Notification;
  selectMultiple?: boolean;
  onSelect: (notificationId: string) => void;
};

export const NotificationItem = ({
  isSelected,
  notification,
  selectMultiple,
  onSelect,
}: NotificationItemProps) => {
  const { markAsRead, isPending } = useMarkNotificationAsRead({ notificationId: notification.id });

  return (
    <div className="rounded-3xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-6 py-7 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-5">
          {selectMultiple && (
            <Checkbox checked={isSelected} onClick={() => onSelect(notification.id)} />
          )}
          <div className="relative mt-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4f4f5] shadow-sm">
              <Bell className="h-6 w-6 text-[#444]" />
            </div>
            {!notification.isRead && (
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-black" />
            )}
          </div>

          <div>
            <h3 className="text-base font-semibold md:text-xl">{notification.message}</h3>

            {notification.link && (
              <Link
                href={notification.link}
                className="mt-3 flex items-center gap-2 text-base font-medium hover:underline"
              >
                <Link2 className="h-4 w-4" />
                View details
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {new Date(notification.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {new Date(notification.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>

              {notification.link && (
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Includes link
                </div>
              )}
            </div>
          </div>
        </div>

        {!notification.isRead && (
          <div className="flex gap-4">
            <div className="w-fit rounded-full bg-black dark:bg-white px-4 py-1.5 text-sm font-semibold text-white dark:text-black shadow">
              New
            </div>
            <Button
              content="Mark as Read"
              disabled={isPending}
              variant="outline"
              onClick={() => markAsRead()}
            >
              <CheckCheck className="h-5 w-5 text-gray-500" />
              Mark as Read
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
