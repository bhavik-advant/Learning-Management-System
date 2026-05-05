'use client';

import AssignmentCards from '@/components/assignments/AssignmentCards';
import Assignments from '@/components/assignments/Assignments';
import { useQuery } from '@tanstack/react-query';
import { getTraineeAssignments } from '@/services/apis/assignments';
import { BsFileEarmarkText, BsClockHistory, BsCheckCircleFill } from 'react-icons/bs';
import { useState } from 'react';
import CustomSelect from '@/components/ui/CustomSelect';

type AssignmentType = {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  maxScore: number;
  moduleTitle: string;
  courseTitle: string;
  submission: {
    status: 'Not Submitted' | 'PENDING' | 'GRADED' | 'RESUBMITTED';
    score?: number | null;
  } | null;
};

export default function AssignmentPage() {
  const { data: assignments = [], isLoading } = useQuery<AssignmentType[]>({
    queryKey: ['assignments'],
    queryFn: getTraineeAssignments,
  });

  const total = assignments.length;
  const pending = assignments.filter(a => a.submission?.status === 'PENDING').length;
  const completed = assignments.filter(a => a.submission?.status === 'GRADED').length;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'GRADED' | 'RESUBMITTED'>(
    'ALL'
  );

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      a.moduleTitle.toLowerCase().includes(search.toLowerCase());

    const status = a.submission?.status ?? 'PENDING';

    const matchesFilter = statusFilter === 'ALL' ? true : status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <section className="mx-8 mt-8 space-y-6 animate-pulse">
        <div className="h-8 w-52 rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-72 rounded bg-gray-100 dark:bg-gray-800/60" />
        <div className="grid md:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
          ))}
        </div>
        {[0, 1, 2].map(i => (
          <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800/40" />
        ))}
      </section>
    );
  }

  return (
    <section className="mx-8 mt-7 mb-12 space-y-7">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-indigo-500 dark:text-indigo-400">
            Learning Progress
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            My Assignments
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track, submit, and review your course work
          </p>
        </div>

        {total > 0 && (
          <div className="flex flex-col items-end gap-1 min-w-[140px]">
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
              {Math.round((completed / total) * 100)}% complete
            </span>
            <div className="w-36 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-indigo-500 to-emerald-500 transition-all duration-700"
                style={{ width: `${(completed / total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <AssignmentCards
          title="Total Assignments"
          value={total}
          icon={<BsFileEarmarkText />}
          color="gray"
        />
        <AssignmentCards title="Pending" value={pending} icon={<BsClockHistory />} color="amber" />
        <AssignmentCards
          title="Completed"
          value={completed}
          icon={<BsCheckCircleFill />}
          color="emerald"
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap">
          All assignments
        </span>

        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-500" />
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search assignments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-72 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 
          bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 
          focus:ring-indigo-500"
          />

          <CustomSelect
            value={statusFilter}
            onChange={val => setStatusFilter(val as 'ALL' | 'PENDING' | 'GRADED' | 'RESUBMITTED')}
            options={[
              { label: 'All', value: 'ALL' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Completed', value: 'GRADED' },
              { label: 'Resubmitted', value: 'RESUBMITTED' },
            ]}
            className="min-w-[160px]"
          />
        </div>
      </div>

      <Assignments assignments={filteredAssignments} />
    </section>
  );
}
