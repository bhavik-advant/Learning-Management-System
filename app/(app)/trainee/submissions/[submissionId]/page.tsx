import AssignmentCards from '@/components/assignments/AssignmentCards';
import StatusBadge from '@/components/assignments/StatusBadge';
import { getAssignmentById } from '@/services/apis/Assignments';
import Link from 'next/link';
import { use } from 'react';
import { BiCalendar } from 'react-icons/bi';
import { FaRegFileAlt } from 'react-icons/fa';
import { LuFileBadge } from 'react-icons/lu';
import { getSubmissionsByAssignment } from '@/services/apis/submissions';
import SubmissionHistory from '@/components/submissions/SubmissionHistory';

type Props = {
  params: Promise<{
    assignmentId: string;
  }>;
};

export default function SubmissionDetailsPage({ params }: Props) {
  const { assignmentId } = use(params);
  const assignment = getAssignmentById(assignmentId);
  const submissions = getSubmissionsByAssignment(assignmentId);

  if (!assignment) {
    return (
      <div className="flex flex-col justify-center items-center space-y-6 mt-5">
        <div>
          <h1 className="text-2xl text-center">Assignment not found</h1>
        </div>
        <div className="bg-gray-200 text-gray-800 w-48 text-center px-4 py-2 rounded-xl">
          <Link href={'./'}>Back to Assignments</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-8 mt-5 space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{assignment.title}</h1>
        </div>
        <div className="bg-gray-200 text-gray-800  px-4 py-2 rounded-xl">
          <Link href={'./'}>Back to Assignments</Link>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <AssignmentCards title="Due Date" value={assignment.dueDate} icon={<BiCalendar />} />
        <AssignmentCards title="Max Score" value={assignment.maxScore} icon={<LuFileBadge />} />
        <AssignmentCards
          title="Status"
          value={<StatusBadge status={assignment.status} />}
          icon={<FaRegFileAlt />}
        />
      </div>
      <div className="rounded-2xl mt-8 border border-white dark:border-[#828bf8]/50 shadow-md shadow-gray-400 dark:shadow-none p-7 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/10 space-y-5">
        <h1 className="font-semibold">Assignment Description</h1>
        <p>{assignment.description}</p>
      </div>
      <SubmissionHistory submissions={submissions} maxScore={assignment.maxScore} />
    </section>
  );
}
