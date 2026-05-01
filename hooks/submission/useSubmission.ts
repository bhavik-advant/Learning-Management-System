import { getSubmissionById, SubmissionType } from '@/services/apis/submissions';
import { useQuery } from '@tanstack/react-query';

const useSubmission = ({ submissionId }: { submissionId: string }) => {
  const {
    data ,
    isPending,
    error,
    isError,
  } = useQuery<SubmissionType>({
    queryKey: ['submission', submissionId],
    queryFn: () => getSubmissionById(submissionId),
    enabled: !!submissionId,
  });

  return {
    submission: data,
    isPending,
    error,
    isError,
  };
};

export default useSubmission;
