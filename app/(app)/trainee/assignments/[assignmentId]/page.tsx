'use client';

import { use, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssignmentById } from '@/services/apis/assignments';
import {
  getSubmissionsByAssignment,
  SubmissionType,
  submitAssignment,
} from '@/services/apis/submissions';

import AssignmentCards from '@/components/assignments/AssignmentCards';
import StatusBadge from '@/components/assignments/StatusBadge';
import SubmissionHistory from '@/components/submissions/SubmissionHistory';

import { BiCalendar } from 'react-icons/bi';
import { LuFileBadge } from 'react-icons/lu';
import {
  HiArrowLeft,
  HiOutlineCloudArrowUp,
  HiOutlineDocumentText,
  HiOutlineXCircle,
  HiCheckCircle,
} from 'react-icons/hi2';
import { BsFileEarmarkText } from 'react-icons/bs';
import Link from 'next/link';

type Params = { assignmentId: string };
type Props = { params: Promise<Params> };
type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
};

const ACCEPTED = '.pdf,.zip,.png,.jpg,.jpeg';
const ACCEPTED_LABEL = 'PDF, ZIP, PNG, JPG';

export default function AssignmentDetailsPage({ params }: Props) {
  const { assignmentId } = use(params);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const { data: assignment, isLoading } = useQuery<Assignment>({
    queryKey: ['assignment', assignmentId],
    queryFn: () => getAssignmentById(assignmentId),
  });

  const { data: submissions = [] } = useQuery<SubmissionType[]>({
    queryKey: ['submissions', assignmentId],
    queryFn: () => getSubmissionsByAssignment(assignmentId),
  });

  const mutation = useMutation({
    mutationFn: (fd: FormData) => submitAssignment(fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', assignmentId] });
      queryClient.invalidateQueries({ queryKey: ['assignment', assignmentId] });
      setSelectedFile(null);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    const fd = new FormData();
    fd.append('assignmentId', assignmentId);
    fd.append('file', selectedFile);
    mutation.mutate(fd);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  const isOverdue =
    assignment?.status !== 'GRADED' &&
    assignment?.dueDate &&
    new Date(assignment.dueDate) < new Date();

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="mx-8 mt-7 mb-12 space-y-6 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-7 w-64 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
          ))}
        </div>
        <div className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800/40" />
        <div className="h-44 rounded-2xl bg-gray-100 dark:bg-gray-800/40" />
      </section>
    );
  }

  if (!assignment) {
    return (
      <section className="mx-8 mt-7 flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl text-gray-300 dark:text-gray-600 mb-4">
          <BsFileEarmarkText />
        </div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Assignment not found
        </p>
        <Link
          href="./"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
        >
          <HiArrowLeft className="text-sm" /> Back to assignments
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-8 mt-7 mb-12 space-y-7">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1 min-w-0">
          <Link
            href="./"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400 hover:text-indigo-500 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors mb-1"
          >
            <HiArrowLeft className="text-xs" /> Assignments
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            {assignment.title}
          </h1>
          {isOverdue && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 tracking-wide mt-1">
              Overdue
            </span>
          )}
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-3 gap-4">
        <AssignmentCards
          title="Due Date"
          value={formatDate(assignment.dueDate)}
          icon={<BiCalendar />}
          color={isOverdue ? 'amber' : 'gray'}
        />
        <AssignmentCards
          title="Max Score"
          value={assignment.maxScore}
          icon={<LuFileBadge />}
          color="indigo"
        />
        <AssignmentCards
          title="Status"
          value={<StatusBadge status={assignment.status} />}
          icon={<BsFileEarmarkText />}
          color={assignment.status === 'GRADED' ? 'emerald' : 'gray'}
        />
      </div>

      {/* ── Description ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-950/50 px-6 py-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <HiOutlineDocumentText className="text-gray-400 dark:text-gray-500 text-base" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Description
          </h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {assignment.description}
        </p>
      </div>

      {/* ── Submit panel ────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-950/50 px-6 py-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <HiOutlineCloudArrowUp className="text-gray-400 dark:text-gray-500 text-base" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Submit Assignment
          </h2>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center gap-2
            rounded-xl border-2 border-dashed px-6 py-8 cursor-pointer
            transition-all duration-200 select-none
            ${dragOver
              ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30'
              : selectedFile
              ? 'border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-900/30'
            }
          `}
        >
          {selectedFile ? (
            <>
              <HiCheckCircle className="text-2xl text-emerald-500" />
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 text-center">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB · Click to change
              </p>
            </>
          ) : (
            <>
              <HiOutlineCloudArrowUp className="text-2xl text-gray-300 dark:text-gray-600" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
                Drag & drop a file here, or{' '}
                <span className="text-indigo-500 dark:text-indigo-400 font-semibold">
                  browse
                </span>
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                {ACCEPTED_LABEL}
              </p>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED}
            onChange={handleFileChange}
            className="sr-only"
            disabled={mutation.isPending}
          />
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || mutation.isPending}
            className="
              inline-flex items-center gap-2 rounded-xl px-5 py-2.5
              text-xs font-semibold
              bg-gray-900 dark:bg-white text-white dark:text-gray-900
              hover:opacity-85 hover:shadow-sm
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-150
            "
          >
            <HiOutlineCloudArrowUp className="text-sm" />
            {mutation.isPending ? 'Submitting…' : 'Submit Assignment'}
          </button>

          {selectedFile && !mutation.isPending && (
            <button
              onClick={() => setSelectedFile(null)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <HiOutlineXCircle className="text-sm" /> Clear
            </button>
          )}

          {mutation.isPending && (
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-indigo-500 animate-spin" />
              Uploading…
            </span>
          )}

          {mutation.isSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <HiCheckCircle className="text-sm" /> Submitted successfully
            </span>
          )}
        </div>
      </div>

      {/* ── Submission history ───────────────────────────────────────────────── */}
      {submissions.length > 0 && (
        <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-950/50 px-6 py-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <LuFileBadge className="text-gray-400 dark:text-gray-500 text-base" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Submission History
            </h2>
          </div>
          <SubmissionHistory submissions={submissions} maxScore={assignment.maxScore} />
        </div>
      )}
    </section>
  );
}