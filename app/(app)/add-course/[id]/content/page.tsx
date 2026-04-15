'use client';

import Modules from '@/components/course/Modules';
import NewModule from '@/components/course/NewModule';
import { getCourseById } from '@/services/apis/courses';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';

type Lesson = {
  id: string;
  title: string;
  url: string;
};

type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

const AddContent = () => {
  const { id: courseId } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => getCourseById(courseId),
  });

  // const [modules, setModules] = useState<Module[]>(data?.data.modules ?? []);

  // const handleAddModule = (id: string, title: string) => {
  //   setModules(prev => [...prev, { id, title, lessons: [] }]);
  // };

  // const handleAddLesson = (moduleId: string, lessonId: string, title: string, url: string) => {
  //   console.log(moduleId, lessonId, title, url);

  //   setModules(prev =>
  //     prev.map(module =>
  //       module.id === moduleId
  //         ? {
  //             ...module,
  //             lessons: [
  //               ...module.lessons,
  //               {
  //                 id: lessonId,
  //                 title,
  //                 url,
  //               },
  //             ],
  //           }
  //         : module
  //     )
  //   );
  // };

  if (isLoading) {
    return <p>Loading....</p>;
  }

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-black/40 p-8 transition-colors duration-300">
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100">Add Content</h2>

        <div className="space-y-5 mt-4">
          {data &&
            data.data &&
            data.data.modules &&
            data.data.modules.map((module: Module) => (
              <Modules
                key={module.id}
                id={module.id}
                title={module.title}
                lessons={module.lessons}
              />
            ))}
        </div>

        <div className="mt-6">
          <NewModule />
        </div>
      </div>
    </>
  );
};

export default AddContent;
