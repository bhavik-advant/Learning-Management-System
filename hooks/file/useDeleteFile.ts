import { deleteFile } from '@/services/apis/file';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useDeleteFile = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      createToast('File deleted successfully!', 'success');
    },
    onError: error => {
      createToast(error.message || 'Failed to delete File!', 'error');
    },
  });

  return {
    deleteFile: mutateAsync,
    isDeleting: isPending,
  };
};
