import { Notification } from '@/generated/prisma/client';
import { NotificationItem } from './NotificationItem';
import { NotificationSkeleton } from './NotificationSkeleton';
import { EmptyNotificationState } from './EmptyNotificationState';

type NotificationListProps = {
  selectedNotifications: string[];
  notifications: Notification[];
  onSelectNotification: (notificationId: string) => void;
  isLoading: boolean;
  selectMultiple?: boolean;
};

export const NotificationList = ({
  selectedNotifications,
  onSelectNotification,
  notifications,
  isLoading,
  selectMultiple,
}: NotificationListProps) => {
  if (isLoading) {
    return <NotificationSkeleton />;
  }

  if (notifications.length === 0) {
    return <EmptyNotificationState />;
  }

  return (
    <div className="mt-10 space-y-6">
      {notifications.map(notification => (
        <NotificationItem
          onSelect={onSelectNotification}
          selectMultiple={selectMultiple}
          key={notification.id}
          notification={notification}
          isSelected={selectedNotifications.includes(notification.id)}
        />
      ))}
    </div>
  );
};
