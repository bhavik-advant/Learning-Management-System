'use client';
import { STATUS_BUTTON } from '@/utils/assignmentConfig';

type Props = {
  status: string;
  onSubmit?: () => void;
};

const AssignmentActionButton: React.FC<Props> = ({ status, onSubmit }) => {
  const config = STATUS_BUTTON[status];

  const handleClick = () => {
    onSubmit?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${config?.className}`}
    >
      {config?.text || 'Action'}
    </button>
  );
};

export default AssignmentActionButton;
