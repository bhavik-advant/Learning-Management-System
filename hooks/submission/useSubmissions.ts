import { useQuery } from '@tanstack/react-query';
import { getSubmissionsByTrainee, SubmissionType } from '@/services/apis/submissions';

export const useSubmissions = ({
  filters,
}: {
  filters: {
    search?: string;
    status?: string;
  };
}) => {
  const { data, isLoading, isError, error } = useQuery<SubmissionType[]>({
    queryKey: ['submission', filters],
    queryFn: () => getSubmissionsByTrainee({ filters }),
  });

  return {
    submissions: data ?? [],
    isLoading,
    isError,
    error,
  };
};
