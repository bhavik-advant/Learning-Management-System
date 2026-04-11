import React from 'react';

const AssignmentCards: React.FC<{
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}> = ({ title, value, icon }) => {
  return (
    <div className="flex justify-between items-center rounded-2xl border border-white dark:border-[#828bf8]/50 shadow-2xl shadow-gray-400 dark:shadow-none p-7 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/10 space-y-5">
      <div className=" text-4xl">{icon}</div>
      <div>
        <h2 className="text-lg text-right">{title}</h2>
        <div className="font-bold text-3xl text-right dark:text-gray-100 text-gray-700">{value}</div>
      </div>
    </div>
  );
};

export default AssignmentCards;
