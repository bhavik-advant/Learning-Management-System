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
  HiArrowRight,
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
  }[];
};

const statusConfig = {
  GRADED: {
    label: 'Graded',
    icon: <BsCheckCircleFill className="text-[11px]" />,
    pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    bar: 'bg-emerald-500',
  },
  PENDING: {
    label: 'Pending Review',
    icon: <BsClockHistory className="text-[11px]" />,
    pill: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    bar: 'bg-amber-500',
  },
  RESUBMITTED: {
    label: 'Resubmitted',
    icon: <BsArrowRepeat className="text-[11px]" />,
    pill: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    bar: 'bg-sky-500',
  },
  NOT_SUBMITTED: {
    label: 'Not Submitted',
    icon: <BsFileEarmarkText className="text-[11px]" />,
    pill: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    bar: 'bg-gray-300 dark:bg-gray-700',
  },
};

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = Math.round((score / max) * 100);
  const trackColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${trackColor} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums text-gray-700 dark:text-gray-300">
        {score}
        <span className="font-normal text-gray-400 dark:text-gray-500">/{max}</span>
      </span>
    </div>
  );
}

function AssignmentCard({ item, index }: { item: AssignmentType; index: number }) {
  const statusKey = (item.submission[0]?.status ?? 'NOT_SUBMITTED') as keyof typeof statusConfig;
  const cfg = statusConfig[statusKey] ?? statusConfig.NOT_SUBMITTED;
  const isGraded = item.submission[0]?.status === 'GRADED';
  const isOverdue = !isGraded && item.dueDate && new Date(item.dueDate) < new Date();

  return (
    <div
      className="group relative flex flex-col sm:flex-row sm:items-center gap-4
                 rounded-2xl border border-gray-200/70 dark:border-gray-800
                 bg-white dark:bg-gray-950/50
                 backdrop-blur-sm px-5 py-4
                 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700
                 transition-all duration-200"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${cfg.bar}`} />

      <div className="shrink-0 w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800/60 flex items-center justify-center text-gray-400 dark:text-gray-500 text-base">
        <BsFileEarmarkText />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</span>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.pill}`}
          >
            {cfg.icon}
            {cfg.label}
          </span>

          {isOverdue && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              Overdue
            </span>
          )}
        </div>

        {/* <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{item.description}</p> */}

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
          <span className="inline-flex items-center gap-1">
            <HiOutlineBookOpen className="text-xs" />
            {item.courseTitle}
          </span>

          <span className="text-gray-300 dark:text-gray-700">·</span>

          <span className="inline-flex items-center gap-1">
            <HiOutlineAcademicCap className="text-xs" />
            {item.moduleTitle}
          </span>

          {item.dueDate && (
            <>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <span
                className={`inline-flex items-center gap-1 ${
                  isOverdue ? 'text-red-500 dark:text-red-400 font-semibold' : ''
                }`}
              >
                <HiOutlineCalendar className="text-xs" />
                {new Date(item.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="hidden sm:flex flex-col gap-1 w-36 shrink-0">
        <div className="flex items-center gap-1 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500">
          <HiOutlineStar className="text-xs" />
          {isGraded ? 'Score' : 'Max score'}
        </div>

        {isGraded && item.submission[0]?.score != null ? (
          <ScoreBar score={item.submission[0].score} max={item.maxScore} />
        ) : (
          <span className="text-xs font-semibold text-gray-300 dark:text-gray-600">
            — / {item.maxScore}
          </span>
        )}
      </div>

      <div>
        <Link
          href={`/app/assignments/${item.id}`}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold ${
            isGraded
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
          }`}
        >
          {isGraded ? 'View Feedback' : 'Submit'}
          <HiArrowRight className="text-xs" />
        </Link>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800/60 flex items-center justify-center text-2xl text-gray-300 dark:text-gray-600 mb-4">
        <BsFileEarmarkText />
      </div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No assignments yet</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        Your assignments will appear here once your mentor assigns them.
      </p>
    </div>
  );
}

const Assignments: React.FC<{ assignments: AssignmentType[] }> = ({ assignments }) => {
  if (assignments.length === 0) return <EmptyState />;

  return (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {assignments.map((item, i) => (
          <AssignmentCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
};

export default Assignments;
