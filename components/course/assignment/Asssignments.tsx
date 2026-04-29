'use client';

import Assignment from './Assignment';

type AssignmentType = {
  id: string;
  title: string;
  description: string;
  maxScore: number;
};

const Assignments = ({
  assignments,
  moduleId,
}: {
  assignments: AssignmentType[];
  moduleId: string;
}) => {
  if (!assignments || assignments.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-center ">
        <h5 className="bg-white text-sm"> Assignmnets</h5>
      </div>
      {assignments.map(assignment => (
        <Assignment moduleId={moduleId} key={assignment.id} assignment={assignment} />
      ))}
    </div>
  );
};

export default Assignments;
