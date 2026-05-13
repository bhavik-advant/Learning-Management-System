import { Notification } from '@/generated/prisma/client';
import { NotificationItem } from './NotificationItem';
import { NotificationSkeleton } from './NotificationSkeleton';
import { EmptyNotificationState } from './EmptyNotificationState';

type NotificationListProps = {
  notifications: Notification[];
  isLoading: boolean;
};

export const NotificationList = ({ notifications, isLoading }: NotificationListProps) => {
  if (isLoading) {
    return <NotificationSkeleton />;
  }

  if (notifications.length === 0) {
    return <EmptyNotificationState />;
  }

  return (
    <div className="mt-10 space-y-6">
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};
