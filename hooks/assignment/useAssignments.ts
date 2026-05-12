import { getTraineeAssignments } from '@/services/apis/assignments';
import { AssignmentFilter, PaginationDataType } from '@/types/types';
import { DEFAULT_PAGINATION_DATA } from '@/utils/constant';
import { useQuery } from '@tanstack/react-query';

type AssignmentType = {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  maxScore: number;
  moduleTitle: string;
  courseTitle: string;
  submission: {
    status: 'PENDING' | 'GRADED' | 'RESUBMITTED';
    score?: number | null;
  } | null;
};

const useAssignments = ({ filters, page }: { filters: AssignmentFilter; page: number }) => {
  const { data, isLoading } = useQuery<{
    assignments: AssignmentType[];
    pagination: PaginationDataType;
  }>({
    queryKey: ['assignments', filters, page],
    queryFn: () =>
      getTraineeAssignments({
        page,
        search: filters.search,
        statusFilter: filters.statusFilter,
      }),
  });

  return {
    assignments: data?.assignments ?? [],
    isLoading,
    paginationData: data?.pagination ?? DEFAULT_PAGINATION_DATA,
  };
};

export default useAssignments;
