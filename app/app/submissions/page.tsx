import RoleBased from '@/components/RoleBased';
import getUserDetails from '@/lib/isAuth';
import AdminSubmissionsPage from '@/components/submissions/AdminSubmissions';
import TraineeSubmissionsPage from '@/components/submissions/TraineeSubmissions';

export default async function SubmissionsPage() {
  const user = await getUserDetails();

  return (
    <RoleBased
      role={user.role}
      components={{
        ADMIN: AdminSubmissionsPage,
        MENTOR: TraineeSubmissionsPage,
        TRAINEE: TraineeSubmissionsPage,
      }}
    />
  );
}
