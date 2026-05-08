import { updateUserDetails } from '@/services/apis/users';
import createToast from '@/utils/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      username: string;
      image: string;
      role: 'ADMIN' | 'MENTOR' | 'TRAINEE';
      mentorId: string | null;
    }) => updateUserDetails(userId, payload),

    onSuccess: updated => {
      queryClient.setQueryData(['admin', 'user', userId], updated);
      createToast('User Details updated successfully!', 'success');
    },
    onError: error => {
      createToast(error.message || 'Failed to update user Details', 'error');
    },
  });
};
