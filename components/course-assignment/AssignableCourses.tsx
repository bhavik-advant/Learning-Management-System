import { useState } from 'react';

import CourseAssignGrid from './CourseAssignGrid';
import { useGetAssignableCourses } from '@/hooks/courses/useGetAssignableCourses';
import { useAssignCourse } from '@/hooks/courses/useAssignCourses';

const AssignableCourses = ({ selectedTraineeId }: { selectedTraineeId: string }) => {
  const limit = 4;
  const [page, setPage] = useState(1);

  const { courseData: data, isLoading } = useGetAssignableCourses({
    selectedTraineeId,
    page,
    limit,
  });
  const { isAssigning, assignCourses } = useAssignCourse({ selectedTraineeId });

  const handleAssignCourse = async (courseIds: string[]) => {
    if (courseIds.length == 0) {
      return;
    }
    await assignCourses({ courseIds: courseIds, traineeId: selectedTraineeId });
  };

  const handlePagination = (ident: 'previous' | 'next') => {
    if (ident === 'previous') {
      if (page <= 1) return;
      setPage(prev => prev - 1);
      return;
    }

    if (!data.pagination.hasNextPage) return;
    setPage(prev => prev + 1);
  };

  return (
    <CourseAssignGrid
      title={'Availabel courses to assign'}
      submitText="Assign"
      pendingtext="Assigning"
      isFetching={isLoading}
      data={data}
      isLoading={isAssigning}
      getNextPage={handlePagination.bind(null, 'next')}
      traineeId={selectedTraineeId}
      getPreviousPage={handlePagination.bind(null, 'previous')}
      func={handleAssignCourse}
    />
  );
};

export default AssignableCourses;
