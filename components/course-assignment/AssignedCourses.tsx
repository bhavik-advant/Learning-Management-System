'use client';
import { useState } from 'react';
import CourseAssignGrid from './CourseAssignGrid';
import useGetAssignedCourses from '@/hooks/courses/useGetAssignedCourses';
import useRestrictCourse from '@/hooks/courses/useRestrictCourse';

const AssignedCourses = ({ selectedUserId }: { selectedUserId: string }) => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { courses, paginationData, isFetching } = useGetAssignedCourses({
    userId: selectedUserId,
    limit,
    page,
  });

  const { restrictCourse, isTakingAccess } = useRestrictCourse({
    userId: selectedUserId,
  });

  const handleRestrict = async (courseIds: string[]) => {
    if (courseIds.length === 0) return;

    await restrictCourse({
      courseIds,
    });
  };

  return (
    <CourseAssignGrid
      title={`Assigned Courses `}
      submitText="Restrict"
      pendingtext="Taking Access.."
      isFetching={isFetching}
      courses={courses}
      paginationData={paginationData}
      isLoading={isTakingAccess}
      getNextPage={() => setPage(prev => prev + 1)}
      userId={selectedUserId}
      getPreviousPage={() => setPage(prev => prev - 1)}
      func={handleRestrict}
    />
  );
};

export default AssignedCourses;
