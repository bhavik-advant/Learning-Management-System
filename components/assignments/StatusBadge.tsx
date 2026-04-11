'use client';
type Props = {
  status: string;
};

import { STATUS_STYLES } from '@/utils/assignmentConfig';

const StatusBadge: React.FC<Props> = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        STATUS_STYLES[status] || 'bg-gray-200 text-gray-700'
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
