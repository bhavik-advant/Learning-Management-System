'use client';

import Modules from '@/components/course/Modules';
import NewModule from '@/components/course/NewModule';
import { addLesson } from '@/services/apis/lesson';
import { createModule } from '@/services/apis/module';
import { useMutation } from '@tanstack/react-query';
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
  const [modules, setModules] = useState<Module[]>([]);

  const handleAddModule = (id: string, title: string) => {
    setModules(prev => [...prev, { id, title, lessons: [] }]);
  };

  const handleAddLesson = (moduleId: string, lessonId: string, title: string, url: string) => {
    console.log(moduleId, lessonId, title, url);

    setModules(prev =>
      prev.map(module =>
        module.id === moduleId
          ? {
              ...module,
              lessons: [
                ...module.lessons,
                {
                  id: lessonId,
                  title,
                  url,
                },
              ],
            }
          : module
      )
    );
  };

  console.log(modules);
  
  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="font-semibold text-xl">Add Content</h2>
        {modules.length > 0 &&
          modules.map(module => (
            <Modules
              key={module.id}
              id={module.id}
              title={module.title}
              lessons={module.lessons}
              onAddLesson={handleAddLesson}
            />
          ))}
        <NewModule onAddModule={handleAddModule} />
      </div>
    </>
  );
};

export default AddContent;
