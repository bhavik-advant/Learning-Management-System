'use client';
import { useQuery } from '@tanstack/react-query';
import ApprovalTable from './ApprovalTable';
import { getPendingCourses } from '@/services/apis/courses';

export default function ApprovalsPage() {
  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['pendingCourses'],
    queryFn: getPendingCourses,
  });

  if (isLoading) {
    return <p className="mx-8 mt-5">Loading...</p>;
  }

  if (isError) {
    return <p className="mx-8 mt-5 text-red-500">Something went wrong</p>;
  }

  return (
    <section className="mx-8 space-y-5 mt-5">
      <div>
        <h2 className="text-3xl font-bold">Pending Approvals</h2>
        <p>Review and approve courses</p>
      </div>

      <ApprovalTable courses={courses} />
    </section>
  );
}
