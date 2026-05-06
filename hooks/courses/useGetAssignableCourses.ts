import { getAssignableCourses } from '@/services/apis/courses';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

type AssignableCourse = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  status: string;
  modulesCount: number;
};

type AssignableCoursesData = {
  courses: AssignableCourse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
};

const emptyAssignableCoursesData = (page: number): AssignableCoursesData => ({
  courses: [],
  pagination: {
    currentPage: page,
    totalPages: 1,
    hasPreviousPage: page > 1,
    hasNextPage: false,
  },
});

const useGetAssignableCourses = ({
  userId,
  limit,
  page,
}: {
  userId: string;
  limit: number;
  page: number;
}) => {
  const { data, isLoading, isFetching } = useQuery<AssignableCoursesData>({
    queryKey: ['assigned-courses', userId, page, limit],
    queryFn: () =>
      getAssignableCourses({
        limit,
        page,
        userId,
      }),
    enabled: userId !== '',
    placeholderData: keepPreviousData,
  });

  return {
    courseData: data ?? emptyAssignableCoursesData(page),
    isLoading,
    isFetching,
  };
};

export default useGetAssignableCourses;
