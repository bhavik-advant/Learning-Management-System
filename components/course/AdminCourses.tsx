'use client';

import { useState, useMemo } from 'react';
import Courses from '@/components/ui/Courses';
import { fetchCourses } from '@/services/apis/courses';
import { useQuery } from '@tanstack/react-query';
import CoursesLayout from './CoursesLayout';

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
      <div className="bg-white border rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full lg:w-1/3 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="all">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
            </select>

            <button
              onClick={() => {
                setSearch('');

                setStatus('all');
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <Courses btnText="View Course" courses={filteredCourses} />
    </CoursesLayout>
  );
}
