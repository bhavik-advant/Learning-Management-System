import { useState } from 'react';
import CourseAssignGrid from './CourseAssignGrid';
import { useAssignCourse } from '@/hooks/courses/useAssignCourses';
import useGetAssignableCourses from '@/hooks/courses/useGetAssignableCourses';

const AssignableCourses = ({ selectedUserId }: { selectedUserId: string }) => {
  const limit = 4;
  const [page, setPage] = useState(1);

  const { courses, paginationData, isFetching } = useGetAssignableCourses({
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

  return (
    <CourseAssignGrid
      title={`Available Courses `}
      submitText="Assign"
      pendingtext="Assigning..."
      emptyText={`Available to assign`}
      isFetching={isFetching}
      courses={courses}
      paginationData={paginationData}
      isLoading={isAssigning}
      getNextPage={() => setPage(prev => prev + 1)}
      userId={selectedUserId}
      getPreviousPage={() => setPage(prev => prev - 1)}
      func={handleAssignCourse}
    />
  );
};

export default AssignableCourses;
