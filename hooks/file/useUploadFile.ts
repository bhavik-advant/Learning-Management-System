import { uploadFile } from '@/services/apis/file';
import createToast from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

export const useUploadFile = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      createToast('File uploaded successfully!', 'success');
    },
    onError: error => {
      createToast(error.message || 'Failed to upload file! Try again', 'error');
    },
  });

  return {
    uploadFile: mutateAsync,
    isUploading: isPending,
  };
};
