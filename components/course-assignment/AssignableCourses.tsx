import { useState } from 'react';
import CourseAssignGrid from './CourseAssignGrid';
import { useAssignCourse } from '@/hooks/courses/useAssignCourses';
import useGetAssignableCourses from '@/hooks/courses/useGetAssignableCourses';

const AssignableCourses = ({ selectedUserId }: { selectedUserId: string }) => {
  const limit = 4;
  const [page, setPage] = useState(1);

  const { courseData: data, isLoading } = useGetAssignableCourses({
    userId: selectedUserId,
    page,
    limit,
  });

  const { isAssigning, assignCourses } = useAssignCourse({
    userId: selectedUserId,
  });

  const handleAssignCourse = async (courseIds: string[]) => {
    if (courseIds.length === 0) return;

    await assignCourses({
      courseIds,
    });
  };

  const handlePagination = (ident: 'previous' | 'next') => {
    if (ident === 'previous') {
      if (page <= 1) return;
      setPage(prev => prev - 1);
      return;
    }

    if (!data?.pagination?.hasNextPage) return;
    setPage(prev => prev + 1);
  };

  return (
    <CourseAssignGrid
      title={`Available Courses for User`}
      submitText="Assign"
      pendingtext="Assigning..."
      isFetching={isLoading}
      data={data}
      isLoading={isAssigning}
      getNextPage={handlePagination.bind(null, 'next')}
      userId={selectedUserId}
      getPreviousPage={handlePagination.bind(null, 'previous')}
      func={handleAssignCourse}
    />
  );
};

export default AssignableCourses;
