import Courses from '@/components/ui/Courses';
import { getAllCourses } from '@/services/apis/courses';

export default async function CoursesPage() {
  const courses = await getAllCourses();
  return (
    <section className="mx-8 space-y-5 mt-5">
      <div>
        <h1 className="text-3xl font-bold">Courses</h1>
        <p>Explore and enroll in courses</p>
      </div>
      <div>
        <Courses btnText="Continue Learning" courses={courses} />
      </div>
    </section>
  );
}
