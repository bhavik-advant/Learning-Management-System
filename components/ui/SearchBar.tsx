'use client';
import CustomSelect from './CustomSelect';
import { useEffect, useRef, useState } from 'react';
import { AssignmentFilter, CourseStatus } from '@/types/types';
import { SubmissionStatus } from '@/generated/prisma/enums';

const SearchBar = ({
  searchTitle,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  options,
}: {
  searchTitle?: string;
  search: string;
  setSearch: (search: string) => void;
  statusFilter: CourseStatus | 'ALL' | AssignmentFilter['statusFilter'] | SubmissionStatus;
  setStatusFilter: (
    status: CourseStatus | 'ALL' | AssignmentFilter['statusFilter'] | SubmissionStatus
  ) => void;
  options: { label: string; value: string }[];
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [searchText, setSearchText] = useState(search);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setSearchText(e.target.value);
    timerRef.current = setTimeout(() => {
      setSearch(e.target.value);
    }, 1000);
  };

  return (
    <div className="flex items-center gap-3">
      {searchTitle && (
        <span className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap">
          {searchTitle}
        </span>
      )}
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-500" />
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchText}
          onChange={handleSearchChange}
          className="w-full md:w-72 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 
              bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 
              focus:ring-indigo-500"
        />

        <CustomSelect
          value={statusFilter}
          onChange={val =>
            setStatusFilter(val as CourseStatus | 'ALL' | AssignmentFilter['statusFilter'])
          }
          options={options || [{ label: 'All', value: 'ALL' }]}
          className="min-w-40"
        />
      </div>
    </div>
  );
};

export default SearchBar;
