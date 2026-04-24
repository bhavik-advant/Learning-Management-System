import { useState } from 'react';

import { getAssignableCourses, assignCourse } from '@/services/apis/courses';
import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '@/utils/query-client';
import CourseAssignGrid from './CourseAssignGrid';

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  status: string;
  authorId: string;
  thumbnailId: string | null;
  createdAt: string;
  updatedAt: string;
  modulesCount: number;
};

const AssignableCourses = ({ selectedTraineeId }: { selectedTraineeId: string }) => {
  const limit = 4;
  const [page, setPage] = useState(1);

  const { data, isLoading: courseFetching } = useQuery({
    queryKey: ['assignable-courses', selectedTraineeId],
    queryFn: () => getAssignableCourses({ limit, page, traineeId: selectedTraineeId }),
    enabled: selectedTraineeId != '',
  });

  const { mutateAsync } = useMutation({
    mutationFn: getAssignableCourses,
    onSuccess: (data: { courses: Course[] }) => {
      queryClient.setQueryData(['assignable-courses', selectedTraineeId], old => {
        if (!old) {
          return old;
        }
        return data;
      });
    },
  });

  const { mutateAsync: assignCourseToTrainee, isPending } = useMutation({
    mutationFn: assignCourse,
    onSuccess: (data, variable) => {
      queryClient.setQueryData(
        ['assignable-courses', selectedTraineeId],
        (old: { courses: Course[] }) => {
          if (!old.courses) {
            return old;
          }

          return {
            ...old,
            courses: old.courses.filter(course => !variable.courseIds.includes(course.id)),
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ['assigned-courses', selectedTraineeId] });
    },
  });

  const handleAssignCourse = async (courseIds: string[]) => {
    if (courseIds.length == 0) {
      return;
    }
    await assignCourseToTrainee({ courseIds: courseIds, traineeId: selectedTraineeId });
  };

  const handlePagination = async (ident: string) => {
    if (ident == 'previous' || page >= 2) {
      await mutateAsync({ limit, page: page - 1, traineeId: selectedTraineeId });
      setPage(prev => prev - 1);
    } else {
      if (page >= data.pagination.totalPages) {
        return;
      }
      await mutateAsync({ limit, page: page + 1, traineeId: selectedTraineeId });
      setPage(prev => prev + 1);
    }
  };

  return (
    <CourseAssignGrid
      title={'Availabel courses to assign'}
      submitText="Assign"
      pendingtext="Assigning"
      isFetching={courseFetching}
      data={data}
      isLoading={isPending}
      getNextPage={() => handlePagination('next')}
      traineeId={selectedTraineeId}
      getPreviousPage={() => handlePagination('previous')}
      func={handleAssignCourse}
    />
  );
};

export default AssignableCourses;
