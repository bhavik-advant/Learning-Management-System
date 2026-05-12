import { getAssignedCourses } from '@/services/apis/courses';
import { PaginationDataType } from '@/types/types';
import { DEFAULT_PAGINATION_DATA } from '@/utils/constant';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  image: string;
  status: string;
  authorId: string;
  thumbnailId: string | null;
  createdAt: string;
  modulesCount: number;
  authorInitials?: string;
};

type AssignableCoursesData = {
  courses: Course[];
  pagination: PaginationDataType;
};

export const useGetAssignedCourses = ({
  userId,
  limit,
  page,
}: {
  userId: string;
  limit?: number;
  page: number;
}) => {
  const { data, isLoading } = useQuery<AssignableCoursesData>({
    queryKey: ['assigned-courses', userId, page, limit],
    queryFn: () =>
      getAssignedCourses({
        limit,
        page,
        userId,
      }),
    enabled: !!userId,
  });

  console.log(data);

  return {
    courses: data?.courses ?? [],
    paginationData: data?.pagination ?? DEFAULT_PAGINATION_DATA,
    isFetching: isLoading,
  };
};

export default useGetAssignedCourses;
