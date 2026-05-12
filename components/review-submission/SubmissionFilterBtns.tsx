import { SUBMISSION_STATUS } from '@/utils/constant';
import { Button } from '../ui/button';
import getStatusColor from '@/utils/getStatusColor';
import { SubmissionStatus } from '@/types/types';

export const SubmissionFilterBtns = ({
  selectedStatus,
  setStatus,
}: {
  selectedStatus: SubmissionStatus[];
  setStatus: (status: SubmissionStatus) => void;
}) => {
  return (
    <div className="flex space-x-2">
      {SUBMISSION_STATUS.map(status => (
        <Button
          onClick={() => setStatus(status)}
          size={'sm'}
          className={`${getStatusColor(status, selectedStatus.includes(status))} rounded-lg `}
          key={status}
        >
          {status} {selectedStatus.includes(status) && <span className="ml-1 text-xs">✓</span>}
        </Button>
      ))}
    </div>
  );
};
