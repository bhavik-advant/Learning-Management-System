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
import AssignmentCards from '@/components/assignments/AssignmentStatsCards';
import StatusBadge from '@/components/assignments/StatusBadge';
import getInitials from '@/utils/getInitials';
import useSubmission from '@/hooks/submission/useSubmission';
import Image from 'next/image';
import { MarkdownEditor } from '@/components/mdxEditor/MdxEditor';

const SubmissionReviewPage = () => {
  const params = useParams();
  const submissionId = params.submissionId as string;

  const { isError, isPending, submission } = useSubmission({ submissionId });

  if (isPending) {
    return <Loading text="Submission" />;
  }

  if (isError) {
    return (
      <section className="mx-8 mt-7 flex flex-col items-center justify-center py-32 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40 ring-1 ring-red-200 dark:ring-red-900">
          <BsFileEarmarkText className="text-2xl text-red-500" />
        </div>
        <p className="text-sm font-bold text-red-600 dark:text-red-400">
          Failed to load submission
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          Something went wrong. Please try again.
        </p>
        <Link
          href="/app/review-submission"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-sm hover:border-violet-300 hover:text-violet-600 dark:hover:border-violet-700 dark:hover:text-violet-400 transition-all duration-200"
        >
          <HiArrowLeft className="text-sm" /> Back to submissions
        </Link>
      </section>
    );
  }

  if (!submission) {
    return (
      <section className="mx-8 mt-7 flex flex-col items-center justify-center py-32 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800">
          <BsFileEarmarkText className="text-2xl text-gray-400" />
        </div>
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Submission not found</p>
        <Link
          href="/app/review-submission"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-sm hover:border-violet-300 hover:text-violet-600 dark:hover:border-violet-700 dark:hover:text-violet-400 transition-all duration-200"
        >
          <HiArrowLeft className="text-sm" /> Back to submissions
        </Link>
      </section>
    );
  }

  const submissionUrl = submission?.file?.url || submission?.githubLink || null;
  const studentInitials = getInitials(submission?.student?.username, { fallback: 'U' });

  return (
    <section className="relative mx-6 lg:mx-10 mt-8 mb-20 space-y-8">
      <div className="pointer-events-none absolute -top-20 -left-20  w-100 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
      <div className="pointer-events-none absolute top-40 right-0  w-100 rounded-full bg-indigo-500/5 blur-3xl dark:bg-indigo-500/8" />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2 min-w-0">
          <Link
            href="/app/review-submission"
            className="group inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 hover:text-violet-500 dark:text-gray-500 dark:hover:text-violet-400 transition-colors"
          >
            <HiArrowLeft className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            Review submissions
          </Link>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            {submission.assignment.title}
          </h1>

          <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
            <span className="font-medium text-gray-500 dark:text-gray-400">
              {submission.assignment.module.course.title}
            </span>
            <span className="inline-block h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span>{submission.assignment.module.title}</span>
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
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

      <div className="rounded-2xl border border-gray-100 dark:border-gray-800/70 bg-white dark:bg-gray-950/60 shadow-sm overflow-hidden">
        <div className="relative border-b border-gray-100 dark:border-gray-800 px-6 py-5 flex items-center gap-3">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-violet-500 to-indigo-500 rounded-r-full" />
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/50 ring-1 ring-violet-100 dark:ring-violet-900/50">
            <BsFileEarmarkText className="text-sm text-violet-600 dark:text-violet-400" />
          </div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Assignment Details</h2>
        </div>

        <div className="p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="group rounded-xl bg-linear-to-br from-gray-50 to-gray-50/50 dark:from-gray-900/60 dark:to-gray-900/30 border border-gray-100 dark:border-gray-800/60 p-5 hover:border-violet-200 dark:hover:border-violet-900 transition-colors duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                Course
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                {submission.assignment.module.course.title}
              </p>
            </div>

            <div className="group rounded-xl bg-linear-to-br from-gray-50 to-gray-50/50 dark:from-gray-900/60 dark:to-gray-900/30 border border-gray-100 dark:border-gray-800/60 p-5 hover:border-violet-200 dark:hover:border-violet-900 transition-colors duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                Module
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                {submission.assignment.module.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800/70 bg-white dark:bg-gray-950/60 shadow-sm overflow-hidden">
          <div className="relative border-b border-gray-100 dark:border-gray-800 px-6 py-5 flex items-center gap-3">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-violet-500 to-indigo-500 rounded-r-full" />
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/50 ring-1 ring-violet-100 dark:ring-violet-900/50">
              <BsFileEarmarkText className="text-sm text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Description</h2>
          </div>

          <div className="p-6">
            <div className="prose prose-sm dark:prose-invert max-w-none rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 p-6">
              <MarkdownEditor
                value={submission.assignment.description}
                onChange={() => {}}
                isEditing={false}
                readOnly={true}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800/70 bg-white dark:bg-gray-950/60 shadow-sm overflow-hidden">
            <div className="relative border-b border-gray-100 dark:border-gray-800 px-6 py-5 flex items-center gap-3">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-emerald-400 to-teal-500 rounded-r-full" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Student Information
              </h2>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-violet-400 to-indigo-500 opacity-20 blur-sm scale-110" />
                  <Avatar size="lg" className="relative ring-2 ring-white dark:ring-gray-900">
                    {submission?.student?.image ? (
                      <AvatarImage
                        src={submission.student.image}
                        alt={submission.student.username}
                      />
                    ) : (
                      <AvatarFallback className="bg-linear-to-br from-violet-500 to-indigo-600 text-white font-bold">
                        {studentInitials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-gray-900 dark:text-white truncate">
                    {submission?.student.username}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
                    {submission?.student.email}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 px-3 py-1.5 text-[10px] font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Student
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 dark:border-gray-800/70 bg-white dark:bg-gray-950/60 shadow-sm overflow-hidden">
            <div className="relative border-b border-gray-100 dark:border-gray-800 px-6 py-5 flex items-center justify-between gap-3">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-400 to-violet-500 rounded-r-full" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Submission Preview
              </h2>
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 px-3 py-1.5 text-[10px] font-bold tracking-wide text-indigo-600 dark:text-indigo-400">
                Student Upload
              </span>
            </div>

            <div className="p-6">
              {submissionUrl ? (
                (() => {
                  const fileUrl = submissionUrl.toLowerCase();
                  const isImage = /\.(png|jpe?g|webp|gif)$/.test(fileUrl);
                  const isPdf = fileUrl.endsWith('.pdf');
                  const isVideo = /\.(mp4|webm|ogg)$/.test(fileUrl);
                  const isZip = /\.(zip|rar|7z)$/.test(fileUrl);

                  return (
                    <div className="space-y-5">
                      {isImage && (
                        <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                          <Image
                            src={submissionUrl}
                            alt="Submission preview"
                            width={500}
                            height={500}
                            className="object-contain w-full"
                            sizes="(max-width: 768px) 100vw, 80vw"
                            priority={false}
                          />
                        </div>
                      )}

                      {isPdf && (
                        <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 h-150">
                          <iframe
                            src={submissionUrl}
                            className="w-full h-full"
                            title="PDF Preview"
                          />
                        </div>
                      )}

                      {isVideo && (
                        <video
                          controls
                          className="w-full rounded-xl border border-gray-100 dark:border-gray-800"
                        >
                          <source src={submissionUrl} />
                        </video>
                      )}

                      {(isZip || (!isImage && !isPdf && !isVideo && !isZip)) && (
                        <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 p-10 text-center">
                          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <BsFileEarmarkText className="text-2xl text-gray-400" />
                          </div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {isZip ? 'Compressed file submitted' : 'Preview unavailable'}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {isZip
                              ? 'Download to inspect the contents.'
                              : 'This file type cannot be previewed.'}
                          </p>
                        </div>
                      )}

                      <Link
                        href={submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full rounded-xl px-5 py-3 text-xs font-bold bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:opacity-90 transition-all duration-150"
                      >
                        Open submission ↗
                      </Link>
                    </div>
                  );
                })()
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 p-10 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <BsFileEarmarkText className="text-2xl text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    No submission file
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    No file or link was submitted.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
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
