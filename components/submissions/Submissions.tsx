'use client';

import { SubmissionType } from '@/services/apis/submissions';
import SubmissionCard from './SubmissionCard';
import EmptyState from './EmptySubmission';

const Submissions: React.FC<{ submissions: SubmissionType[] }> = ({ submissions }) => {
  if (submissions.length === 0) return <EmptyState />;

  return (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {submissions.map((item, i) => (
          <SubmissionCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
};

export default Submissions;
