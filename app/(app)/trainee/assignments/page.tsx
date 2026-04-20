'use client';

import AssignmentCards from '@/components/assignments/AssignmentCards';
import Assignments from '@/components/assignments/Assignments';
import { useQuery } from '@tanstack/react-query';
import { getTraineeAssignments } from '@/services/apis/Assignments';
import { FaRegFileAlt } from 'react-icons/fa';

export default function AssignmentPage() {
  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments'],
    queryFn: getTraineeAssignments,
  });

  const total = assignments.length;
  const pending = assignments.filter(a  => !a.submission).length;
  const completed = assignments.filter(a => a.submission?.status === 'GRADED').length;

  return (
    <section className="mx-8 space-y-5 mt-5">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p>Explore and Submit Assignments</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <AssignmentCards title="Total Assignments" value={total} icon={<FaRegFileAlt />} />
        <AssignmentCards title="Pending" value={pending} icon={<FaRegFileAlt />} />
        <AssignmentCards title="Completed" value={completed} icon={<FaRegFileAlt />} />
      </div>

      <Assignments assignments={assignments} />
    </section>
  );
}
