import RoleBased from '@/components/RoleBased';
import getUserDetails from '@/lib/isAuth';

import AdminCoursesPage from '@/components/course/AdminCourses';
import MentorCoursesPage from '@/components/course/MentorCourses';
import TraineeCoursesPage from '@/components/course/TraineeCourses';

export default async function CoursesPage() {
  const user = await getUserDetails();

  return (
    <RoleBased
      role={user.role}
      components={{
        ADMIN: AdminCoursesPage,
        MENTOR: MentorCoursesPage,
        TRAINEE: TraineeCoursesPage,
      }}
    />
  );
}
