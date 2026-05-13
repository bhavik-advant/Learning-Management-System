import { sendRequest } from '@/utils/sendRequest';

export const getNotification = async (status?: 'read' | 'unread') => {
  const query = status ? `?status=${status}` : '';
  const response = await sendRequest(`/api/notification${query}`);
  // console.log(response);

  return response.data;
};
