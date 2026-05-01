'use client';

import React from 'react';

const palette = {
  gray: {
    card: 'bg-white dark:bg-gray-950/60 border-gray-200/70 dark:border-gray-800',
    icon: 'bg-gray-100 dark:bg-gray-800/70 text-gray-500 dark:text-gray-400',
    accent: 'from-gray-400 to-gray-500',
    value: 'text-gray-900 dark:text-white',
  },
  amber: {
    card: 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/50',
    icon: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    accent: 'from-amber-400 to-orange-500',
    value: 'text-amber-700 dark:text-amber-300',
  },
  emerald: {
    card: 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/50',
    icon: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    accent: 'from-emerald-400 to-teal-500',
    value: 'text-emerald-700 dark:text-emerald-300',
  },
  indigo: {
    card: 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-800/50',
    icon: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
    accent: 'from-indigo-400 to-violet-500',
    value: 'text-indigo-700 dark:text-indigo-300',
  },
};

type PaletteKey = keyof typeof palette;

const AssignmentCards: React.FC<{
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  color?: PaletteKey;
}> = ({ title, value, icon, color = 'gray' }) => {
  const p = palette[color] ?? palette.gray;

  return (
    <div
      className={`
        group relative flex items-center gap-4 rounded-2xl border
        ${p.card}
        backdrop-blur-sm px-5 py-4
        shadow-sm hover:shadow-md
        transition-all duration-200
        overflow-hidden
      `}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full bg-linear-to-b ${p.accent} opacity-80`}
      />

      <div
        className={`
          shrink-0 w-11 h-11 rounded-xl
          flex items-center justify-center text-lg
          ${p.icon}
          transition-transform duration-200 group-hover:scale-105
        `}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 truncate">
          {title}
        </p>
        <p className={`text-2xl font-extrabold leading-tight ${p.value}`}>{value}</p>
      </div>
    </div>
  );
};

export default AssignmentCards;
