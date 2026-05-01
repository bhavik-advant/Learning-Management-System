import { useState } from 'react';
import CourseAssignGrid from './CourseAssignGrid';
import useGetAssignedCourses from '@/hooks/courses/useGetAssignedCourses';
import useRestrictCourse from '@/hooks/courses/useRestrictCourse';

const AssignedCourses = ({ traineeId }: { traineeId: string }) => {
  const [page, setPage] = useState(1);
  const limit = 4;

  const { courseData, isLoading } = useGetAssignedCourses({
    selectedTraineeId: traineeId,
    limit,
    page,
  });
  const { restrictCourse, isTakingAccess } = useRestrictCourse({ traineeId });

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
    if (courseIds.length === 0) {
      return;
    }
    await restrictCourse({ courseIds, traineeId });
  };

  return (
    <CourseAssignGrid
      title={'Already Assigned Courses'}
      submitText="Restrict"
      pendingtext="Taking Access.."
      isFetching={isLoading}
      data={courseData}
      isLoading={isTakingAccess}
      getNextPage={handlePagination.bind(null, 'next')}
      traineeId={traineeId}
      getPreviousPage={handlePagination.bind(null, 'previous')}
      func={handleRestrict}
    />
  );
};

export default AssignedCourses;
