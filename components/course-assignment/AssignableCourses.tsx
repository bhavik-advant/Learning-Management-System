import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertCircle } from 'lucide-react';
import SelectableCourses from './SelectableCourses';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getAssignableCourses, assignCourse } from '@/services/apis/courses';
import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '@/utils/query-client';
import Summery from './Summery';

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
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const limit = 4;
  const page = 1;

  const {
    data,
    isLoading: courseFetching,
    isError: courseHasError,
    error: courseError,
  } = useQuery({
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

  const { mutateAsync: assignCourseToTrainee } = useMutation({
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

      setSelectedCourses([]);
    },
  });

  const handleSelectCourse = (course: Course) => {
    setSelectedCourses(prev => {
      const isSelected = prev.some(c => c.id === course.id);
      if (isSelected) {
        return prev.filter(c => c.id !== course.id);
      }
      return [...prev, course];
    });
  };

  const handleAssignCourse = async () => {
    const selectedCourseIds = selectedCourses.map(course => course.id);
    await assignCourseToTrainee({ courseIds: selectedCourseIds, traineeId: selectedTraineeId });
  };

  const handlePagination = async (ident: string) => {
    if (ident == 'previous' || page >= 2) {
      await mutateAsync({ limit, page: page - 1, traineeId: selectedTraineeId });
    } else {
      if (page >= data.pagination.totalPages) {
        return;
      }
      await mutateAsync({ limit, page: page + 1, traineeId: selectedTraineeId });
    }
  };

  const isTraineeSelected = !!selectedTraineeId;
  const isLoading = courseFetching;
  const isError = courseHasError;
  const hasNoCourses = !data?.courses || data.courses.length === 0;
  const hasCoursesWithData = data?.courses && data.courses.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        {!isTraineeSelected && (
          <Card className="shadow-md border border-dashed border-border">
            <CardContent className="pt-16 pb-16 flex items-center justify-center min-h-96">
              <div className="text-center space-y-2">
                <Users className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Select a trainee</p>
                  <p className="text-xs text-muted-foreground">
                    Choose a trainee from the left to view and assign courses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isTraineeSelected && isLoading && (
          <Card className="shadow-md border border-border">
            <CardHeader className="border-b border-border py-2 px-4">
              <CardTitle className="text-sm">Assignable Courses</CardTitle>
              <CardDescription className="text-xs">Loading courses...</CardDescription>
            </CardHeader>
            <CardContent className="h-24"></CardContent>
          </Card>
        )}

        {isTraineeSelected && isError && (
          <Card className="shadow-md border border-red-200 dark:border-red-900">
            <CardHeader className="border-b border-border py-2 px-4">
              <CardTitle className="text-sm">Unable to Load Courses</CardTitle>
              <CardDescription className="text-xs">
                {(courseError as Error)?.message || 'Something went wrong while fetching courses.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  Please try refreshing the page or contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isTraineeSelected && !isLoading && !isError && hasNoCourses && (
          <Card className="shadow-md border border-border">
            <CardHeader className="border-b border-border py-2 px-4">
              <CardTitle className="text-sm">Assignable Courses</CardTitle>
              <CardDescription className="text-xs">Viewing 0 course(s)</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex items-center justify-center min-h-64">
              <div className="text-center space-y-2">
                <Users className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
                <div>
                  <p className="text-sm font-semibold text-foreground">No courses available</p>
                  <p className="text-xs text-muted-foreground">
                    There are no courses to assign at this time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isTraineeSelected && !isLoading && !isError && hasCoursesWithData && (
          <Card className="shadow-md border border-border">
            <CardHeader className="border-b border-border py-2 px-4">
              <CardTitle className="text-sm">Assignable Courses</CardTitle>
              <CardDescription className="text-xs">
                Viewing {data?.courses.length} course(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <SelectableCourses
                func={handleSelectCourse}
                courses={data?.courses || []}
                selectedCourses={selectedCourses}
              />
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    {data?.pagination.hasPreviousPage && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => handlePagination('previous')} />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <span className="text-xs">
                        Page {data?.pagination.currentPage} of {data?.pagination.totalPages}
                      </span>
                    </PaginationItem>

                    {data?.pagination.hasNextPage && (
                      <PaginationItem>
                        <PaginationNext onClick={() => handlePagination('next')} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {isTraineeSelected && !isLoading && !isError && (
        <Summery
          selectedTraineeId={selectedTraineeId}
          selectedCourses={selectedCourses}
          onAction={handleAssignCourse}
          actionLabel="Assign"
        />
      )}
    </div>
  );
};

export default AssignableCourses;
