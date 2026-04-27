import Link from 'next/link';

type Submission = {
  status: 'PENDING' | 'GRADED' | 'RESUBMITTED';
  score: number | null;
};

type Assignment = {
  id: string;
  title: string;
  dueDate: string | null;
  submission?: Submission | null;
};

type AssignmentListProps = {
  assignments: Assignment[];
  showSubmission: boolean;
};

export function AssignmentList({ assignments, showSubmission }: AssignmentListProps) {
  return (
    <div className="px-3 py-2 space-y-2 bg-gray-50 dark:bg-gray-800/30">
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Assignments</p>

      {assignments.map(assignment => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          showSubmission={showSubmission}
          assignments={[]}
        />
      ))}
    </div>
  );
}

const AssignmentCard = ({
  assignment,
  showSubmission,
}: AssignmentListProps & { assignment: Assignment }) => {
  const status = assignment.submission?.status;
  const statusColor = getStatusColor(status);
  const href = showSubmission
    ? `../assignments/${assignment.id}`
    : `../assignment/${assignment.id}`;

  return (
    <Link href={href}>
      <div className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium text-gray-900 dark:text-white">{assignment.title}</p>

          {showSubmission && (
            <span className={`text-[9px] px-2 py-0.5 rounded-full ${statusColor}`}>
              {status || 'NOT SUBMITTED'}
            </span>
          )}
        </div>

        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
          <span>
            {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No deadline'}
          </span>

          {showSubmission && assignment.submission?.score !== null && (
            <span>Score: {assignment.submission?.score}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

const getStatusColor = (status?: string) => {
  const colors = {
    GRADED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    RESUBMITTED: 'bg-blue-100 text-blue-700',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600';
};
