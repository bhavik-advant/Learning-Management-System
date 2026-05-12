import { useQuery } from '@tanstack/react-query';
import { getSubmissionsByTrainee, SubmissionType } from '@/services/apis/submissions';
import { PaginationDataType } from '@/types/types';

export const useSubmissions = ({
  page,
  filters,
}: {
  page?: number;
  filters: {
    search?: string;
    status?: string;
  };
}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['submission', filters, page],
    queryFn: () => getSubmissionsByTrainee({ filters, page: page }),
  });

  return {
    submissions: (data?.submissions as SubmissionType[]) ?? [],
    paginationData: data?.pagination as PaginationDataType,
    isLoading,
    isError,
    error,
  };
};
