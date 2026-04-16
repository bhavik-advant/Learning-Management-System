'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '@/services/apis/courses';
import ApproveButton from '@/components/ui/ApproveButton';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
  params: Promise<{ courseId: string }>;
};

type Lesson = {
  id: string;
  title: string;
  url: string | null;
};

type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  description: string;
  status: string;
  thumbnail: string | null;
  modules: Module[];
};

export default function CourseDetailsPage({ params }: Props) {
  const { courseId } = use(params);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const {
    data: course,
    isLoading,
    error,
  } = useQuery<Course>({
    queryKey: ['courses', courseId],
    queryFn: () => getCourseById(courseId),
  });

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const firstLesson = course?.modules?.[0]?.lessons?.[0];
  const currentLesson = activeLesson ?? firstLesson;

  const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          Loading course...
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h1>
          <Link href="/admin/courses" className="text-blue-600 hover:underline">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="relative h-[45vh] min-h-[350px] overflow-hidden">
        {course.thumbnail ? (
          <Image src={course.thumbnail} alt={course.title} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-700/50 via-gray-700/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700/80 via-transparent to-transparent" />

        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <Link
            href="/admin/courses"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                course.status === 'APPROVED'
                  ? 'bg-green-500/90 text-white'
                  : course.status === 'PENDING'
                    ? 'bg-amber-500/90 text-white'
                    : 'bg-gray-500/90 text-white'
              }`}
            >
              {course.status}
            </span>
          </div>
        </div>
        <div className="absolute bottom-20 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
              <span className="font-medium">{course.modules.length} Modules</span>
              <span>•</span>
              <span>{totalLessons} Lessons</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
              {course.title}
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl line-clamp-2">
              {course.description}
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-22 relative z-10 pb-12">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden bg-white dark:bg-gray-900 shadow-xl border border-gray-200/50 dark:border-gray-800">
              <div className="p-4 sm:p-6 h-22 bg-gray-100 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {currentLesson?.title || 'Select a lesson to start'}
                    </h2>
                    {currentLesson && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Now playing</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="aspect-video bg-black">
                {currentLesson?.url ? (
                  <video key={currentLesson.id} controls className="w-full h-full">
                    <source src={currentLesson.url} />
                  </video>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                      <svg
                        className="w-10 h-10 text-white/50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-white/60 font-medium">Select a lesson to play</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex gap-3">
              <Link
                href={`/add-course/${course.id}/content`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </Link>
              {course.status === 'PENDING' ? (
                <ApproveButton courseId={course.id} />
              ) : (
                <div className="flex items-center justify-center gap-2 px-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <div className="flex-1 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {course.modules.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Modules</p>
              </div>
              <div className="flex-1 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLessons}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Lessons</p>
              </div>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {course.modules.map((module, moduleIndex) => (
                <div
                  key={module.id}
                  className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() =>
                      setExpandedModule(expandedModule === module.id ? null : module.id)
                    }
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-300 to-blue-600/80 text-white flex items-center justify-center text-xs font-bold">
                        {moduleIndex + 1}
                      </span>
                      <div className="text-left">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                          {module.title}
                        </h3>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {module.lessons.length} lessons
                        </p>
                      </div>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${expandedModule === module.id ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {expandedModule === module.id && (
                    <div className="border-t border-gray-100 dark:border-gray-800">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`p-3 flex items-center gap-3 cursor-pointer transition ${
                            currentLesson?.id === lesson.id
                              ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/30 border-l-4 border-transparent'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${
                              currentLesson?.id === lesson.id
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {lessonIndex + 1}
                          </span>
                          <span
                            className={`flex-1 text-xs font-medium ${
                              currentLesson?.id === lesson.id
                                ? 'text-indigo-700 dark:text-indigo-300'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {lesson.title}
                          </span>
                          {currentLesson?.id === lesson.id && (
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                              Now
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
