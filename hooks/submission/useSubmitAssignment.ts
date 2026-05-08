import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitAssignment } from '@/services/apis/submissions';
import createToast from '@/utils/toast';

export const useSubmitAssignment = (assignmentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fd: FormData) => submitAssignment(fd),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['submissions', assignmentId],
      });

      queryClient.invalidateQueries({
        queryKey: ['assignment', assignmentId],
      });
      createToast('Assignment Submitted successfully!', 'success');
    },
    onError: error => {
      createToast(error.message || 'Assignment Submission Failed! Try Again', 'error');
    },
  });
};
