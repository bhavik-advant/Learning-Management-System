import Course from "./dashboard/Course";

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  btnText: string;
};

const Courses: React.FC<{ courses: Course[] }> = ({ courses }) => {
  return (
    <section className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Your Courses</h2>
        <p className="text-blue-500">View all</p>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
          <p className="text-lg font-medium">No courses found</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <Course key={course.id} {...course} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Courses;
