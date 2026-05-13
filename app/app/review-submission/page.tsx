'use client';

import Loading from '@/components/ui/loading';
import { useSubmissionsForReview } from '@/hooks/submission/useSubmissionsForReview';
import SubmissionsTable from '@/components/submissions/SubmissionsTable';
import { useState } from 'react';
import { SubmissionStatus } from '@/types/types';
import { SubmissionFilterBtns } from '@/components/review-submission/SubmissionFilterBtns';
import SearchBar from '@/components/ui/SearchBar';

const ReviewAssignment = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: [] as SubmissionStatus[],
  });
  const [page, setPage] = useState(1);

  const { submissions, paginationData, isLoading, isFetching, isError } = useSubmissionsForReview({
    filters,
    page,
  });

  if (isLoading) {
    return <Loading text="Submissions" />;
  }


  if (isError) {
    return <p className="p-6 text-red-500">Failed to load submissions</p>;
  }

  return (
    <div className="mx-4 sm:mx-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Submissions</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Monitor and review all assignment submissions.
        </p>
      </div>

      <SearchBar
        classes="w-full"
        inputPosition="left"
        search={filters.search}
        setSearch={val => setFilters(prev => ({ ...prev, search: val }))}
      >
        <SubmissionFilterBtns
          selectedStatus={filters.status}
          setStatus={status => {
            setFilters(prev => ({
              ...prev,
              status: prev.status.includes(status)
                ? prev.status.filter(s => s !== status)
                : [...prev.status, status],
            }));
          }}
        />
      </SearchBar>

      <SubmissionsTable
        getNextPage={() => setPage(prev => prev + 1)}
        getPreviousPage={() => setPage(prev => prev - 1)}
        paginationData={paginationData}
        submissions={submissions ?? []}
        isFetching={isFetching}
      />
    </div>
  );
};

export default ReviewAssignment;
