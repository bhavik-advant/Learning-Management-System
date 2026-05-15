import { sendRequest } from '@/utils/sendRequest';

export const getNotification = async (status?: 'read' | 'unread') => {
  const query = status ? `?status=${status}` : '';
  const response = await sendRequest(`/api/notification${query}`);
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const reponse = await sendRequest(`/api/notification/${notificationId}`, 'patch');
  return reponse.data;
};

export const deleteNotification = async (notificationId: string) => {
  const reponse = await sendRequest(`/api/notification/${notificationId}`, 'delete');
  return reponse.data;
};

export const deleteAllNotifications = async ({
  notificationIds,
  deleteAll = false,
}: {
  notificationIds: string[];
  deleteAll?: boolean;
}) => {
  const response = await sendRequest(
    `/api/notification${deleteAll ? '?deleteAll=true' : ''}`,
    'delete',
    {
      notificationIds,
    }
  );
  return response.data;
};

export const markAllNotificationsAsRead = async ({
  notificationIds,
  markReadAll = false,
}: {
  notificationIds: string[];
  markReadAll?: boolean;
}) => {
  const response = await sendRequest(
    `/api/notification${markReadAll ? '?markReadAll=true' : ''}`,
    'patch',
    {
      notificationIds,
    }
  );

  console.log(response);

  return response.data;
};

export const getNotificationCount = async () => {
  const response = await sendRequest('/api/notification?count=true');
  return response.data;
};
