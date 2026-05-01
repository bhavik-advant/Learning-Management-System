'use client';

import { useState, useMemo } from 'react';
import Courses from '@/components/ui/Courses';
import { fetchCourses } from '@/services/apis/courses';
import { useQuery } from '@tanstack/react-query';
import CoursesLayout from './CoursesLayout';
import CustomSelect from '../ui/CustomSelect';

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  image: string;
  status: string;
  authorId: string;
  thumbnailId: string | null;
  createdAt: string;
  updatedAt: string;
  modulesCount: number;
};

export default function AdminCoursesPage() {
  const {
    data: courses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: fetchCourses,
  });

  const [search, setSearch] = useState('');

  const [status, setStatus] = useState('all');

  const filteredCourses = useMemo(() => {
    return courses.filter((course: Course) => {
      const matchesSearch = course.title?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === 'all' || course.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [courses, search, status]);

  return (
    <CoursesLayout
      title="Courses"
      subtitle="Manage and review all courses"
      count={filteredCourses.length}
      isLoading={isLoading}
      isError={isError}
    >
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full lg:w-1/3 px-4 py-2 
      border border-gray-300 dark:border-gray-600 
      rounded-lg outline-none 
      bg-white dark:bg-gray-800 
      text-gray-900 dark:text-gray-100 
      placeholder-gray-400 dark:placeholder-gray-500
      focus:ring-2 focus:ring-blue-500"
          />

          <CustomSelect
            value={status}
            onChange={setStatus}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Draft', value: 'DRAFT' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Approved', value: 'APPROVED' },
            ]}
            className="min-w-[160px]"
          />
        </div>
      </div>

      <Courses btnText="View Course" courses={filteredCourses} />
    </CoursesLayout>
  );
}
