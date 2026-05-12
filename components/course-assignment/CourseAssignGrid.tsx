import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SelectableCourses from './SelectableCourses';
import { useState } from 'react';
import Summery from './Summery';
import NoCourses from './NoCourses';
import CustomPagination from '../ui/CustomPagination';
import { Button } from '../ui/button';
import { PaginationDataType } from '@/types/types';

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  image: string;
  status: string;
  authorId: string;
  thumbnailId: string | null;
  createdAt: string;
  modulesCount: number;
  authorInitials?: string;
};

const CourseAssignGrid = ({
  title,
  submitText,
  pendingtext,
  isFetching,
  userId,
  isLoading,
  courses = [],
  paginationData,
  getNextPage,
  getPreviousPage,
  func,
}: {
  userId: string;
  title: string;
  pendingtext: string;
  submitText: string;
  isFetching: boolean;
  courses: Course[];
  paginationData: PaginationDataType
  getNextPage: () => void;
  getPreviousPage: () => void;
  func: (courseIds: string[]) => Promise<void>;
  isLoading: boolean;
}) => {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [showSummery, setShowSummery] = useState(false);

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
      <Card className="shadow-md dark:bg-[#0b111f] border border-border">
        <CardHeader className="border-b border-border py-2 px-4">
          <CardTitle className="text-sm">{title}</CardTitle>
          {/* <CardDescription className="text-xs">Loading course..</CardDescription> */}
        </CardHeader>
        <CardContent className="h-44 flex justify-center items-center">
          Loading Courses...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid">
      <div className="lg:col-span-2 space-y-4">
        {courses.length == 0 && <NoCourses title={title} />}

        {courses.length > 0 && (
          <Card className="shadow-md border dark:bg-[#0b111f] border-border">
            <CardHeader className="border-b flex justify-between border-border py-2 px-4">
              <div>
                <CardTitle className="text-sm">{title}</CardTitle>
                <CardDescription className="text-xs">
                  Viewing {courses.length} course(s)
                </CardDescription>
              </div>
              <Button disabled={selectedCourses.length === 0} onClick={() => setShowSummery(true)}>
                {submitText}
              </Button>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <SelectableCourses
                func={handleSelectCourse}
                courses={courses || []}
                selectedCourses={selectedCourses}
              />
              <div className="mt-4">
                <CustomPagination
                  paginationData={paginationData}
                  getNextPage={getNextPage}
                  getPreviousPage={getPreviousPage}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {showSummery && (
        <Summery
          onClose={() => setShowSummery(false)}
          isLoading={isLoading}
          pendingText={pendingtext}
          actionLabel={submitText}
          userId={userId}
          selectedCourses={selectedCourses}
          onAction={handleOperation}
        />
      )}
    </div>
  );
};

export default CourseAssignGrid;
