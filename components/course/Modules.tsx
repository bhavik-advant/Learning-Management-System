'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createModule } from '@/services/apis/module';
import { useParams } from 'next/navigation';
import NewLesson from './NewLesson';
import Lessons from './Lessons';
import { BiEdit } from 'react-icons/bi';
type Lesson = {
  id: string;
  title: string;
  url: string;
};

type ModuleFormEditProps = {
  id: string;
  title: string;
  lessons: Lesson[];
};

const Modules: React.FC<ModuleFormEditProps> = ({ id, title, lessons }) => {
  console.log(lessons);

  const [inputText, setInputText] = useState<string>(title || '');
  const { id: courseId } = useParams<{ id: string }>();

  const { mutateAsync, isPending } = useMutation({ mutationFn: createModule });
  const handleModuleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="mt-4 space-y-4 border-2 border-dashed border-gray-400/80 rounded-2xl p-4">
      <form className="flex flex-col space-y-2" onSubmit={handleModuleSubmit}>
        <h2 className="text-lg text-gray-600">Add Module</h2>
        <div className="flex gap-4">
          <input
            placeholder="Module Name "
            className="flex-1 border rounded-md border-gray-500/50 focus:outline-none py-1 px-2"
            value={inputText}
            onChange={event => setInputText(event.target.value)}
            type="text"
          />

          {isPending ? (
            'Editing...'
          ) : (
            <button className="bg-blue-500/20 p-2 rounded-lg">
              <BiEdit className="text-blue-300" />
            </button>
          )}
        </div>
      </form>
      {lessons.length > 0 &&
        lessons.map(lesson => (
          <Lessons key={`${lesson.id}+${id}`} func={() => {}} lesson={lesson} />
        ))}
      <NewLesson
        key={id}
        // onAddLesson={onAddLesson}
        moduleId={id}
      />
    </div>
  );
};

export default Modules;
