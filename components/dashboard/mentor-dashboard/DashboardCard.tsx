import React from 'react';

const DashBoardCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="flex justify-between items-center  rounded-2xl border border-white dark:border-[#828bf8]/50 shadow-2xl shadow-gray-400 dark:shadow-none p-7 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/10 space-y-5">
      <div>
        <h2 className="text-lg">{title}</h2>
        <p className="font-bold text-4xl">{value}</p>
      </div>
      <div className="bg-blue-300/50 rounded-md p-2">{icon}</div>
    </div>
  );
};

export default DashBoardCard;
