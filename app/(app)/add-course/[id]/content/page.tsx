'use client';

import ModuleForm from '@/components/course/ModuleForm';
import { createModule } from '@/services/apis/module';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';

type lesson = {
  id: number;
  file: File | null;
};

type Module = {
  id: number;
  title: string;
  lessons: lesson[];
};

const AddContent = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = id;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createModule,
  });
  const [modules, setModules] = useState<Module[]>([]);

  const handleAddForm = () => {
    const id = Math.random();
    setModules(prev => [...prev, { id, title: '', lessons: [] }]);
  };

  const onChangeHandler = (id: number, identifier: 'title' | 'lessons', value: string | File) => {
    setModules(prev =>
      prev.map(mod => {
        if (mod.id !== id) return mod;
        const lessonId = Math.random();
        if (identifier === 'title') {
          return {
            ...mod,
            title: value as string,
          };
        }
        return {
          ...mod,
          lessons: [...mod.lessons, { id: lessonId, file: value as File }],
        };
      })
    );
  };

  const handleAddModule = async (id: number, title: string) => {
    const response = await mutateAsync({ title, courseId });

    setModules(prev =>
      prev.map(module => {
        if (module.id != id) {
          return module;
        }

        const lessonId = Math.random();

        return {
          ...module,
          lessons: [{ id: lessonId, file: null }],
        };
      })
    );
  };

  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="font-semibold text-xl">Add Content</h2>
        {modules.length > 0 &&
          modules.map(module => (
            <ModuleForm
              onAddModule={handleAddModule}
              key={module.id}
              id={module.id}
              title={module.title}
              onChange={onChangeHandler}
              lessons={module.lessons}
            />
          ))}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAddForm}
            className="bg-blue-600 ml-auto text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Add Module
          </button>
        </div>
      </div>
    </>
  );
};

export default AddContent;
