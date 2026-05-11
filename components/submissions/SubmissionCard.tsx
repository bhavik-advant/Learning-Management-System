import Link from 'next/link';
import { SubmissionType } from '@/services/apis/submissions';
import {
  HiOutlineCalendar,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineStar,
  HiArrowTopRightOnSquare,
  HiArrowRight,
} from 'react-icons/hi2';
import { BsCheckCircleFill, BsClockHistory, BsFileEarmarkCheck } from 'react-icons/bs';
import ScoreBar from '../assignments/ScoreBar';

export default function SubmissionCard({ item, index }: { item: SubmissionType; index: number }) {
  const isGraded = item.status === 'GRADED';

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
      <div
        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${
          isGraded ? 'bg-emerald-500' : 'bg-amber-500'
        }`}
      />

      <div className="flex-linear-0 w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800/60 flex items-center justify-center text-base text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:scale-105">
        <BsFileEarmarkCheck />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`./assignments/${item.assignment.id}`}
            className="text-sm font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
          >
            {item.assignment.title}
          </Link>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
              isGraded
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
            }`}
          >
            {isGraded ? (
              <BsCheckCircleFill className="text-[10px]" />
            ) : (
              <BsClockHistory className="text-[10px]" />
            )}
            {isGraded ? 'Graded' : 'Pending Review'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
          <span className="inline-flex items-center gap-1">
            <HiOutlineBookOpen className="text-xs" />
            {item.assignment.module.course.title}
          </span>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <span className="inline-flex items-center gap-1">
            <HiOutlineAcademicCap className="text-xs" />
            {item.assignment.module?.title ?? 'Module'}
          </span>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <span className="inline-flex items-center gap-1">
            <HiOutlineCalendar className="text-xs" />
            {new Date(item.submittedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="hidden sm:flex flex-col gap-1 w-36 flex-linear-0">
        <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          <HiOutlineStar className="text-xs" />
          Score
        </div>
        {isGraded && item.score != null ? (
          <ScoreBar score={item.score} max={item.assignment.maxScore} />
        ) : (
          <span className="text-xs font-semibold text-gray-300 dark:text-gray-600">
            — / {item.assignment.maxScore}
          </span>
        )}
      </div>

      <div className="flex-linear-0 flex items-center gap-2">
        <div>
          {item.file ? (
            <a
              href={item.file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-150"
              title="View submitted file"
            >
              <HiArrowTopRightOnSquare className="text-sm" />
              File
            </a>
          ) : item.githubLink ? (
            <a
              href={item.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-150"
              title="Open GitHub repository"
            >
              <HiArrowTopRightOnSquare className="text-sm" />
              GitHub
            </a>
          ) : null}
        </div>
        <Link
          href={`./assignments/${item.assignment.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold
                       bg-gray-900 dark:bg-white text-white dark:text-gray-900
                       hover:opacity-85 hover:shadow-sm transition-all duration-150 group/btn"
        >
          {isGraded ? 'Feedback' : 'Details'}
          <HiArrowRight className="text-xs transition-transform duration-150 group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
