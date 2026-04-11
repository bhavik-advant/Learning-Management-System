'use client';

import { useState, use } from 'react';
import { getCoursesById, getCourseFullDetails, Lesson } from '@/services/apis/courses';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function CourseDetailsPage({ params }: Props) {
  const { id } = use(params);

  const course = getCoursesById(id);
  const details = getCourseFullDetails(id);

  const firstLesson: Lesson | undefined = details.modules[0]?.lessons[0];

  const [activeLesson, setActiveLesson] = useState<Lesson | undefined>(firstLesson);

  if (!course) {
    return (
      <section className="mx-8 mt-5">
        <h1 className="text-3xl font-bold">Course not found</h1>
      </section>
    );
  }

  return (
    <section className="mx-8 mt-5 space-y-5">
      <div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p>{course.description}</p>
        <p className="text-sm text-gray-500">By: {course.author}</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3  gap-6 items-start">
        <div className=" border rounded-2xl p-5 space-y-6 ">
          <h3 className="font-semibold text-lg">Course Content</h3>
          {details.modules.map(module => (
            <div key={module.id} className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span>{module.title}</span>
                <span className="text-xs bg-gray-200 dark:text-gray-700 px-2 rounded-full">
                  {module.lessons.length}
                </span>
              </div>
              {module.lessons.map(lesson => (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`cursor-pointer p-3 rounded-xl flex gap-3 ${
                    activeLesson?.id === lesson.id
                      ? 'bg-blue-50 dark:bg-gray-700 border'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{lesson.isCompleted ? '✔' : '🕒'}</span>

                  <div>
                    <p className="text-sm font-medium">{lesson.title}</p>
                    <p className="text-xs text-gray-500">{lesson.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div>
            <h4 className="font-medium mb-2">Assignments</h4>

            {details.assignments.map(a => (
              <div key={a.id} className="flex justify-between border p-3 rounded-xl">
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-gray-500">Due: {a.dueDate}</p>
                </div>

                <button className="border px-3 py-1 bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-100 dark:text-gray-800 text-white rounded-lg text-sm cursor-pointer">
                  Submit
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-2 border rounded-2xl p-5 space-y-5 ">
          <h2 className="font-semibold text-lg">{activeLesson?.title}</h2>

          {activeLesson?.videoUrl ? (
            <video key={activeLesson.id} controls className="w-full h-[350px] rounded-xl bg-black">
              <source src={activeLesson.videoUrl} type="video/mp4" />
            </video>
          ) : activeLesson?.videoLink ? (
            <div className="flex items-center justify-center h-[350px] bg-gray-100 dark:bg-gray-500 rounded-xl">
              <a
                href={activeLesson.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gay-700 transition"
              >
                Watch Course
              </a>
            </div>
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
