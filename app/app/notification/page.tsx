'use client';

import { useNotification } from '@/hooks/notification/useNotifications';

const Notifications = () => {
  const { notifications, isLoading, isError } = useNotification();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching notifications</div>;

  return (
    <>
      {notifications?.map((notification: { id: string; message: string }) => (
        <div key={notification.id}>{notification.message}</div>
      ))}
    </>
  );
};

export default Notifications;
