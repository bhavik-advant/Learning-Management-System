import { useState } from 'react';
import CourseAssignGrid from './CourseAssignGrid';
import useGetAssignedCourses from '@/hooks/courses/useGetAssignedCourses';
import useRestrictCourse from '@/hooks/courses/useRestrictCourse';

const AssignedCourses = ({ selectedUserId }: { selectedUserId: string }) => {
  const [page, setPage] = useState(1);
  const limit = 4;

  const { courseData, isLoading } = useGetAssignedCourses({
    userId: selectedUserId,
    limit,
    page,
  });

  const { restrictCourse, isTakingAccess } = useRestrictCourse({
    userId: selectedUserId,
  });

  const handlePagination = (ident: 'previous' | 'next') => {
    if (ident === 'previous') {
      if (page <= 1) return;
      setPage(prev => prev - 1);
      return;
    }

    if (!courseData?.pagination?.hasNextPage) return;
    setPage(prev => prev + 1);
  };

  const handleRestrict = async (courseIds: string[]) => {
    if (courseIds.length === 0) return;

    await restrictCourse({
      courseIds,
    });
  };

  return (
    <CourseAssignGrid
      title={`Assigned Courses User`}
      submitText="Restrict"
      pendingtext="Taking Access.."
      isFetching={isLoading}
      data={courseData}
      isLoading={isTakingAccess}
      getNextPage={handlePagination.bind(null, 'next')}
      userId={selectedUserId}
      getPreviousPage={handlePagination.bind(null, 'previous')}
      func={handleRestrict}
    />
  );
};

export default AssignedCourses;
