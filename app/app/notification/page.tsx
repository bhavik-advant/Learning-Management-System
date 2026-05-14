'use client';

import { useState } from 'react';
import { useNotification } from '@/hooks/notification/useNotifications';
import { NotificationFilterType } from '@/components/notifications/NotificationFilters';
import { NotificationHeader } from '@/components/notifications/NotificationHeader';
import { NotificationStats } from '@/components/notifications/NotificationStats';
import NotificationFilters from '@/components/notifications/NotificationFilters';
import { NotificationList } from '@/components/notifications/NotificationList';
import { Notification } from '@/generated/prisma/client';

const NotificationsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<NotificationFilterType>('all');
  const [selectMultiple, setSelectMultiple] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const apiFilter = selectedFilter === 'all' ? undefined : selectedFilter;
  const { notifications, meta, isLoading, isError } = useNotification(apiFilter);

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => {
      if (prev.includes(notificationId)) {
        return prev.filter(id => id !== notificationId);
      } else {
        return [...prev, notificationId];
      }
    });
  };

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error fetching notifications
      </div>
    );
  }

  const unreadCount = meta?.unreadCount || 0;
  const readCount = meta?.readCount || 0;
  const linkCount = notifications.filter((notification: Notification) => notification.link).length;

  return (
    <div className="min-h-screen text-black dark:text-white bg-[#f8f8f8] dark:bg-gray-900 p-8">
      <div className="mx-auto max-w-8xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <NotificationHeader />
          <NotificationStats unreadCount={unreadCount} linkCount={linkCount} />
        </div>

        <NotificationFilters
          selectedNotifications={selectedNotifications}
          selectMultiple={selectMultiple}
          enableMultipleSelect={() => setSelectMultiple(prev => !prev)}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          unreadCount={unreadCount}
          readCount={readCount}
        />

        <NotificationList
          selectedNotifications={selectedNotifications}
          onSelectNotification={handleSelectNotification}
          selectMultiple={selectMultiple}
          notifications={notifications}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default NotificationsPage;
