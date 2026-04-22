'use client';

import Link from 'next/link';
import {
  BsClockHistory,
  BsCheckCircleFill,
  BsArrowRepeat,
  BsFileEarmarkText,
} from 'react-icons/bs';
import {
  HiOutlineCalendar,
  HiOutlineStar,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
} from 'react-icons/hi2';

export type AssignmentType = {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  maxScore: number;
  moduleTitle: string;
  courseTitle: string;
  submission: {
    status: 'PENDING' | 'GRADED' | 'RESUBMITTED';
    score?: number | null;
  } | null;
};

const statusConfig = {
  GRADED: {
    label: 'Graded',
    icon: <BsCheckCircleFill className="text-[13px]" />,
    pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  PENDING: {
    label: 'Pending',
    icon: <BsClockHistory className="text-[13px]" />,
    pill: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  RESUBMITTED: {
    label: 'Resubmitted',
    icon: <BsArrowRepeat className="text-[13px]" />,
    pill: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  NOT_SUBMITTED: {
    label: 'Not Submitted',
    icon: <BsFileEarmarkText className="text-[13px]" />,
    pill: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    dot: 'bg-gray-400',
  },
};

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
        {score}/{max}
      </span>
    </div>
  );
}

function AssignmentCard({ item }: { item: AssignmentType }) {
  const statusKey = item.submission?.status ?? 'NOT_SUBMITTED';
  const cfg = statusConfig[statusKey as keyof typeof statusConfig] ?? statusConfig.NOT_SUBMITTED;
  const isGraded = item.submission?.status === 'GRADED';
  const isOverdue = !isGraded && item.dueDate && new Date(item.dueDate) < new Date();

  return (
    <div className="group relative flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 backdrop-blur-sm px-5 py-4 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200">
      <div className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-full ${cfg.dot}`} />

      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100/80 dark:bg-gray-800/60 flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg">
        <BsFileEarmarkText />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
            {item.title}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.pill}`}
          >
            {cfg.icon}
            {cfg.label}
          </span>
          {isOverdue && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              Overdue
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
          {item.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <HiOutlineBookOpen className="text-sm" />
            {item.courseTitle}
          </span>
          <span className="inline-flex items-center gap-1">
            <HiOutlineAcademicCap className="text-sm" />
            {item.moduleTitle}
          </span>
          {item.dueDate && (
            <span
              className={`inline-flex items-center gap-1 ${isOverdue && !isGraded ? 'text-red-500 dark:text-red-400 font-semibold' : ''}`}
            >
              <HiOutlineCalendar className="text-sm" />
              {new Date(item.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 w-36 hidden sm:block">
        {isGraded && item.submission?.score != null ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
              <HiOutlineStar className="text-sm" />
              Score
            </div>
            <ScoreBar score={item.submission.score} max={item.maxScore} />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
              <HiOutlineStar className="text-sm" />
              Max score
            </div>
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
              — / {item.maxScore}
            </span>
          </div>
        )}
      </div>

      <div className="flex-shrink-0">
        <Link
          href={`./assignments/${item.id}`}
          className={`
            inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold
            transition-all duration-150 hover:opacity-90 hover:shadow-sm
            ${
              isGraded
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-80'
            }
          `}
        >
          {isGraded ? 'View Feedback' : 'Submit'}
        </Link>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl text-gray-400 dark:text-gray-600 mb-4">
        <BsFileEarmarkText />
      </div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No assignments yet</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Your assignments will appear here once your mentor assigns them.
      </p>
    </div>
  );
}

const Assignments: React.FC<{ assignments: AssignmentType[] }> = ({ assignments }) => {
  const graded = assignments.filter(a => a.submission?.status === 'GRADED').length;
  const pending = assignments.filter(
    a => a.submission?.status === 'PENDING' || !a.submission
  ).length;

  return (
    <div className="space-y-3">
      {assignments.length > 0 && (
        <div className="flex flex-wrap gap-4 px-1 mb-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              <b className="text-gray-700 dark:text-gray-200">{graded}</b> graded
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>
              <b className="text-gray-700 dark:text-gray-200">{pending}</b> pending
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            <span>
              <b className="text-gray-700 dark:text-gray-200">{assignments.length}</b> total
            </span>
          </div>
        </div>
      )}

      {assignments.length === 0 ? (
        <EmptyState />
      ) : (
        assignments.map(item => <AssignmentCard key={item.id} item={item} />)
      )}
    </div>
  );
};

export default Assignments;
