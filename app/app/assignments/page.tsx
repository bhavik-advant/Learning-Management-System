'use client';

import Assignments from '@/components/assignments/Assignments';
import { BsFileEarmarkText, BsClockHistory, BsCheckCircleFill } from 'react-icons/bs';
import { useState } from 'react';
import { AssignmentFilter } from '@/types/types';
import useAssignments from '@/hooks/assignment/useAssignments';
import AssignmentStatsCards from '@/components/assignments/AssignmentStatsCards';
import SearchBar from '@/components/ui/SearchBar';
import CustomPagination from '@/components/ui/CustomPagination';

export default function AssignmentPage() {
  const [filters, setFilters] = useState<AssignmentFilter>({
    search: '',
    statusFilter: 'ALL',
  });

  const [page, setPage] = useState(1);

  const { assignments, isLoading, paginationData } = useAssignments({ filters, page });

  const total = assignments.length;
  const pending = assignments.filter(a => a.submission?.status === 'PENDING').length;
  const completed = assignments.filter(a => a.submission?.status === 'GRADED').length;

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
          <div className="flex flex-col items-end gap-1 min-w-35">
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
        <AssignmentStatsCards
          title="Total Assignments"
          value={total}
          icon={<BsFileEarmarkText />}
          color="gray"
        />
        <AssignmentStatsCards
          title="Pending"
          value={pending}
          icon={<BsClockHistory />}
          color="amber"
        />
        <AssignmentStatsCards
          title="Completed"
          value={completed}
          icon={<BsCheckCircleFill />}
          color="emerald"
        />
      </div>

      <SearchBar
        options={[
          { label: 'All', value: 'ALL' },
          { label: 'Not Submitted', value: 'NOT_SUBMITTED' },
          { label: 'Pending', value: 'PENDING' },
          { label: 'Completed', value: 'GRADED' },
          { label: 'Resubmitted', value: 'RESUBMITTED' },
        ]}
        searchTitle="All assignments"
        search={filters.search}
        setSearch={search => setFilters({ ...filters, search })}
        statusFilter={filters.statusFilter}
        setStatusFilter={status =>
          setFilters({
            ...filters,
            statusFilter: status as 'ALL' | AssignmentFilter['statusFilter'],
          })
        }
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Assignments assignments={assignments} />
          <CustomPagination
            paginationData={paginationData}
            getNextPage={() => setPage(prev => prev + 1)}
            getPreviousPage={() => setPage(prev => prev - 1)}
          />
        </>
      )}
    </section>
  );
}
