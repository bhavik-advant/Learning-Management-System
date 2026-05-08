'use client';

import { updateFeedback } from '@/services/apis/submissions';
import queryClient from '@/utils/query-client';
import { SubmissionStatus } from '@/generated/prisma/enums';
import { useMutation } from '@tanstack/react-query';
import { Submission } from '@/generated/prisma/client';
import createToast from '@/utils/toast';

interface UpdateFeedbackPayload {
  feedback: string;
  score: number | null;
  submissionId: string;
}

export const useUpdateFeedback = (
  submissionId: string,
  feedbackText: string,
  score: number | null,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
  setFormError: React.Dispatch<React.SetStateAction<string>>
) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateFeedback,

    onSuccess: () => {
      setIsEditing(false);

      queryClient.setQueryData(['submission', submissionId], (old: Submission | undefined) => {
        if (!old) {
          return old;
        }

        return {
          ...old,
          status: SubmissionStatus.GRADED,
          feedback: feedbackText,
          score,
        };
      });

      queryClient.invalidateQueries({
        queryKey: ['submission', submissionId],
      });
      createToast('Feedback updated successfully!', 'success');
    },

    onError: error => {
      setFormError(error instanceof Error ? error.message : 'Failed to save feedback');
      createToast(error.message || 'Failed to update feedback', 'error');
    },
  });

  const submitFeedback = async ({ feedback, score, submissionId }: UpdateFeedbackPayload) => {
    await mutateAsync({
      feedback,
      score,
      submissionId,
    });
  };

  return {
    submitFeedback,
    isPending,
  };
};
