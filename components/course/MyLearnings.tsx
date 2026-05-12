'use client';
import useGetAssignedCourses from '@/hooks/courses/useGetAssignedCourses';
import CoursesLayout from './CoursesLayout';
import Courses from '../ui/Courses';
import CustomPagination from '../ui/CustomPagination';
import { useState } from 'react';

const MyLearningsPage = ({ selectedUserId }: { selectedUserId: string }) => {
  const [page, setPage] = useState(1);
  const { courses, paginationData, isFetching } = useGetAssignedCourses({
    userId: selectedUserId,
    page: page,
  });

  return (
    <CoursesLayout title="My Learnings" count={courses.length || 0}>
      {isFetching ? (
        <p className="h-full">Loading....</p>
      ) : (
        <>
          {courses.length > 0 && <Courses courses={courses} btnText="View Course" />}
          <CustomPagination
            getNextPage={() => setPage(prev => prev + 1)}
            getPreviousPage={() => setPage(prev => prev - 1)}
            paginationData={paginationData}
          />
        </>
      )}
    </CoursesLayout>
  );
};

export default MyLearningsPage;
