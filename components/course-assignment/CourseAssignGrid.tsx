import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import SelectableCourses from './SelectableCourses';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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

const CourseAssignGrid = ({
  title,
  submitText,
  pendingtext,
  isFetching,
  traineeId,
  isLoading,
  data,
  getNextPage,
  getPreviousPage,
  func,
}: {
  traineeId: string;
  title: string;
  pendingtext: string;
  submitText: string;
  isFetching: boolean;
  data: {
    courses: Course[];
    pagination: {
      currentPage: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
  getNextPage: () => void;
  getPreviousPage: () => void;
  func: (courseIds: string[]) => Promise<void>;
  isLoading: boolean;
}) => {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourses(prev => {
      const isSelected = prev.some(c => c.id === course.id);
      if (isSelected) {
        return prev.filter(c => c.id !== course.id);
      }
      return [...prev, course];
    });
  };

  const handleOperation = async () => {
    const courseIds = selectedCourses.map(course => course.id);
    await func(courseIds);
    setSelectedCourses([]);
  };

  if (isFetching) {
    return (
      <Card className="shadow-md border border-border">
        <CardHeader className="border-b border-border py-2 px-4">
          <CardTitle className="text-sm">Assigned Courses</CardTitle>
          <CardDescription className="text-xs">Loading courses...</CardDescription>
        </CardHeader>
        <CardContent className="h-24"></CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div
        className={` ${selectedCourses.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}  space-y-4`}
      >
        {data.courses.length == 0 && (
          <Card className="shadow-md border border-border">
            <CardHeader className="border-b border-border py-2 px-4">
              <CardTitle className="text-sm"> {title}</CardTitle>
              <CardDescription className="text-xs">Viewing 0 course(s)</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex items-center justify-center min-h-64">
              <div className="text-center space-y-2">
                <Users className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
                <div>
                  <p className="text-sm font-semibold text-foreground">No courses assigned</p>
                  <p className="text-xs text-muted-foreground">
                    This trainee has no assigned courses yet.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {data.courses.length > 0 && (
          <Card className="shadow-md border border-border">
            <CardHeader className="border-b border-border py-2 px-4">
              <CardTitle className="text-sm">{title}</CardTitle>
              <CardDescription className="text-xs">
                Viewing {data?.courses.length} course(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <SelectableCourses
                func={handleSelectCourse}
                courses={data.courses || []}
                selectedCourses={selectedCourses}
              />
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    {data?.pagination.hasPreviousPage && (
                      <PaginationItem>
                        <PaginationPrevious onClick={getPreviousPage} />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <span className="text-xs">
                        Page {data?.pagination.currentPage} of {data?.pagination.totalPages}
                      </span>
                    </PaginationItem>

                    {data?.pagination.hasNextPage && (
                      <PaginationItem>
                        <PaginationNext onClick={getNextPage} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedCourses.length > 0 && (
        <Summery
          isLoading={isLoading}
          pendingText={pendingtext}
          actionLabel={submitText}
          selectedTraineeId={traineeId}
          selectedCourses={selectedCourses}
          onAction={handleOperation}
        />
      )}
    </div>
  );
};

export default CourseAssignGrid;
