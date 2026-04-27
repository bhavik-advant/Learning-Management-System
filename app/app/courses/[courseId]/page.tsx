import RoleBased from '@/components/RoleBased';
import getUserDetails from '@/lib/isAuth';
import MentorCoursesPage from '@/components/course/MentorCourses';
import AdminCourseDetailsPage from '@/components/course/AdminCourseDetailsPage';
import TraineeCourseDetailsPage from '@/components/course/TraineeCourseDetailsPage';

type PageProps = {
  params: {
    courseId: string;
  };
};

export default async function CoursesDetailsPage({ params }: PageProps) {
  const user = await getUserDetails();

  return (
    <RoleBased
      role={user.role}
      components={{
        ADMIN: () => <AdminCourseDetailsPage params={Promise.resolve(params)} />,
        MENTOR: MentorCoursesPage,
        TRAINEE: () => <TraineeCourseDetailsPage params={Promise.resolve(params)} />,
      }}
    />
  );
}
