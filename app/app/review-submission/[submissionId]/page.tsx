'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import FeedbackSection from '@/components/submissions/FeedbackSection';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Loading from '@/components/ui/loading';
import { HiArrowLeft } from 'react-icons/hi2';
import { BiCalendar } from 'react-icons/bi';
import { LuFileBadge } from 'react-icons/lu';
import { BsFileEarmarkText } from 'react-icons/bs';
import AssignmentCards from '@/components/assignments/AssignmentCards';
import StatusBadge from '@/components/assignments/StatusBadge';
import getInitials from '@/utils/getInitials';
import useSubmission from '@/hooks/submission/useSubmission';

const SubmissionReviewPage = () => {
  const params = useParams();
  const submissionId = params.submissionId as string;

  const { isError, isPending, submission } = useSubmission({ submissionId });

  if (isPending) {
    return <Loading text="Submission" />;
  }

  if (isError) {
    return (
      <section className="mx-8 mt-7 flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-semibold text-red-600">Failed to fetch submission data.</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Please try again.</p>
        <Link
          href="/app/review-submission"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
        >
          <HiArrowLeft className="text-sm" /> Back to review submissions
        </Link>
      </section>
    );
  }

  if (!submission) {
    return (
      <section className="mx-8 mt-7 flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Submission not found
        </p>
        <Link
          href="/app/review-submission"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
        >
          <HiArrowLeft className="text-sm" /> Back to review submissions
        </Link>
      </section>
    );
  }

  const submissionUrl = submission.fileUrl || submission.githubLink || null;
  const studentInitials = getInitials(submission.student.username, { fallback: 'U' });

  return (
    <section className="mx-8 mt-7 mb-12 space-y-7">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1 min-w-0">
          <Link
            href="/app/review-submission"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400 hover:text-indigo-500 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors mb-1"
          >
            <HiArrowLeft className="text-xs" /> Review submissions
          </Link>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight truncate">
            {submission.assignment.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {submission.assignment.module.course.title} · {submission.assignment.module.title}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <AssignmentCards
          title="Status"
          value={<StatusBadge status={submission.status} />}
          icon={<BsFileEarmarkText />}
          color={submission.status === 'GRADED' ? 'emerald' : 'gray'}
        />
        <AssignmentCards
          title="Score"
          value={
            submission.score !== null && submission.score !== undefined
              ? `${submission.score} / ${submission.assignment.maxScore}`
              : '—'
          }
          icon={<LuFileBadge />}
          color={submission.score !== null && submission.score !== undefined ? 'indigo' : 'gray'}
        />
        <AssignmentCards
          title="Submitted"
          value={new Date(submission.submittedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
          icon={<BiCalendar />}
          color="gray"
        />
      </div>

      <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-950/50 px-6 py-5 shadow-sm space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Assignment details
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Course
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {submission.assignment.module.course.title}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Module
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {submission.assignment.module.title}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Description
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {submission.assignment.description}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-950/50 px-6 py-5 shadow-sm space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Student information
        </h2>

        <div className="flex items-center gap-4">
          <Avatar size="lg">
            {submission.student.image ? (
              <AvatarImage src={submission.student.image} alt={submission.student.username} />
            ) : (
              <AvatarFallback>{studentInitials}</AvatarFallback>
            )}
          </Avatar>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {submission.student.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {submission.student.email}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-950/50 px-6 py-5 shadow-sm space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Submission file
        </h2>

        {submissionUrl ? (
          <Link
            href={submissionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-85 hover:shadow-sm transition-all duration-150"
          >
            View submission
          </Link>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No file or link was submitted.</p>
        )}
      </div>

      <FeedbackSection
        score={submission.score || null}
        feedback={submission.feedback}
        submissionId={submission.id}
        maxScore={submission.assignment.maxScore}
      />
    </section>
  );
};

export default SubmissionReviewPage;
