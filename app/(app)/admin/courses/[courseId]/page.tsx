'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '@/services/apis/courses';
import ApproveButton from '@/components/ui/ApproveButton';

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

  if (isLoading) {
    return <p className="mx-8 mt-5">Loading...</p>;
  }

  if (error || !course) {
    return (
      <section className="mx-8 mt-5">
        <h1 className="text-3xl font-bold">Course not found</h1>
      </section>
    );
  }

  return (
    <section className="mx-8 mt-5 space-y-5">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p>{course.description}</p>
        </div>
        <div>
          {course.status === 'PENDING' ? (
            <ApproveButton courseId={course.id} />
          ) : (
            <p className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700 transition">
              Approved
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        <div className="border rounded-2xl p-5 space-y-6">
          <h3 className="font-semibold text-lg">Course Content</h3>

          {course.modules.map(module => (
            <div key={module.id} className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span>{module.title}</span>
                <span className="text-xs bg-gray-200 px-2 rounded-full">
                  {module.lessons.length}
                </span>
              </div>

              {module.lessons.map(lesson => (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`cursor-pointer p-3 rounded-xl ${
                    currentLesson?.id === lesson.id ? 'bg-blue-50 border' : 'hover:bg-gray-100'
                  }`}
                >
                  <p className="text-sm font-medium">{lesson.title}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="xl:col-span-2 border rounded-2xl p-5 space-y-5">
          <h2 className="font-semibold text-lg">{currentLesson?.title || 'Select a lesson'}</h2>

          {currentLesson?.url ? (
            <video key={currentLesson.id} controls className="w-full h-[350px] rounded-xl bg-black">
              <source src={currentLesson.url} />
            </video>
          ) : (
            <div className="flex items-center justify-center h-[350px] bg-gray-100 rounded-xl">
              <span className="text-gray-500">No video available</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
