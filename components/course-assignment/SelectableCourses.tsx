'use client';
import SelectableCourse from './SelectableCourse';

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

const SelectableCourses = ({
  courses,
  func,
  selectedCourses = [],
}: {
  courses: Course[];
  func: (course: Course) => void;
  selectedCourses?: Course[];
}) => {
  const handleSelectCourse = (course: Course) => {
    func(course);
  };

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {courses &&
        courses.map(course => {
          const isSelected = selectedCourses.some(selected => selected.id === course.id);
          return (
            <li key={course.id}>
              <SelectableCourse
                course={course}
                isSelected={isSelected}
                onCheckboxChange={() => handleSelectCourse(course)}
              />
            </li>
          );
        })}
    </ul>
  );
};

export default SelectableCourses;
