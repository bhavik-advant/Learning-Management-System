import { sendRequest } from '@/utils/sendRequest';

export const getNotification = async () => {
  const response = await sendRequest('/api/notification');
  return response.data;
};
