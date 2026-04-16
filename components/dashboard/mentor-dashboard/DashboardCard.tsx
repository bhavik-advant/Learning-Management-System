import React from 'react';

const DashBoardCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 backdrop-blur-xl shadow-sm transition hover:shadow-md">
      <div className="relative flex items-start justify-between gap-4 p-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {value}
          </p>
        </div>

        <div className="shrink-0 rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-950/30 p-3 text-gray-900 dark:text-white shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashBoardCard;
