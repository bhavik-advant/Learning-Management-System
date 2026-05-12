import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllSubmissionsForReview } from '@/services/apis/submissions';
import { SubmissionStatus } from '@/types/types';
import { DEFAULT_PAGINATION_DATA } from '@/utils/constant';

export const useSubmissionsForReview = ({
  filters,
  page,
}: {
  filters: { search: string; status: SubmissionStatus[] };
  page: number;
}) => {
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['submissions', filters , page],
    queryFn: () => getAllSubmissionsForReview({ filters, page }),
    placeholderData: keepPreviousData,
  });
  
  return {
    submissions: data?.submissions ?? [],
    paginationData: data?.pagination ?? DEFAULT_PAGINATION_DATA,
    isLoading,
    isFetching,
    isError,
    error,
  };
};
