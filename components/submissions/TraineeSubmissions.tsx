'use client';

import AssignmentCards from '@/components/assignments/AssignmentCards';
import Submissions from '@/components/submissions/Submissions';
import { getSubmissionsByTrainee, SubmissionType } from '@/services/apis/submissions';
import { useQuery } from '@tanstack/react-query';
import { BsFileEarmarkCheck, BsClockHistory, BsCheckCircleFill } from 'react-icons/bs';
import { useState } from 'react';
import CustomSelect from '../ui/CustomSelect';

export default function TraineeSubmissionsPage() {
  const { data: submission = [], isLoading } = useQuery<SubmissionType[]>({
    queryKey: ['submission'],
    queryFn: getSubmissionsByTrainee,
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'GRADED' | 'RESUBMITTED'>(
    'ALL'
  );

  const filteredSubmissions = submission.filter(a => {
    const matchesSearch =
      a.assignment.title.toLowerCase().includes(search.toLowerCase()) ||
      a.assignment.module.course.title.toLowerCase().includes(search.toLowerCase()) ||
      a.assignment.module.title.toLowerCase().includes(search.toLowerCase());

    const status = a?.status ?? 'PENDING';

    const matchesFilter = statusFilter === 'ALL' ? true : status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const total = submission.length;
  const pending = submission.filter(s => s.status === 'PENDING').length;
  const completed = submission.filter(s => s.status === 'GRADED').length;
  const avgScore =
    completed > 0
      ? Math.round(
          submission
            .filter(s => s.status === 'GRADED' && s.score != null)
            .reduce((sum, s) => sum + (s.score ?? 0), 0) / completed
        )
      : null;

  if (isLoading) {
    return (
      <section className="mx-8 mt-7 mb-12 space-y-6 animate-pulse">
        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-8 w-52 rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="grid md:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800/40" />
      </section>
    );
  }

  return (
    <section className="mx-8 mt-7 mb-12 space-y-7">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-indigo-500 dark:text-indigo-400">
            My Work
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Submissions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Review all your submitted assignments and scores
          </p>
        </div>

        {avgScore !== null && (
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Avg. Score
            </span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums">
              {avgScore}
            </span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <AssignmentCards
          title="Total Submissions"
          value={total}
          icon={<BsFileEarmarkCheck />}
          color="gray"
        />
        <AssignmentCards
          title="Pending Review"
          value={pending}
          icon={<BsClockHistory />}
          color="amber"
        />
        <AssignmentCards
          title="Graded"
          value={completed}
          icon={<BsCheckCircleFill />}
          color="emerald"
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap">
          All submissions
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-500" />
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search Submission..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-92 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 
               bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 
               focus:ring-indigo-500"
          />

          <CustomSelect
            value={statusFilter}
            onChange={value =>
              setStatusFilter(value as 'ALL' | 'PENDING' | 'GRADED' | 'RESUBMITTED')
            }
            options={[
              { label: 'All', value: 'ALL' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Graded', value: 'GRADED' },
              { label: 'Resubmitted', value: 'RESUBMITTED' },
            ]}
            className="min-w-[160px]"
          />
        </div>
      </div>

      <Submissions submissions={filteredSubmissions} />
    </section>
  );
}
