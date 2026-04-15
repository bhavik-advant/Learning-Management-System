'use client';

import NewLesson from './NewLesson';
import Lessons from './Lessons';
import ModuleInput from './ModuleInput';
import AssignmentModal from './AssignmentModal';
import { useRef } from 'react';
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
  const assignmentRef = useRef(null);

  const handleShowAssignment = () => {
    assignmentRef.current?.open();
  };

  return (
    <>
      <AssignmentModal moduleId={id} ref={assignmentRef} />
      <div className="mt-4 space-y-4 border-2 border-dashed border-gray-400/80 rounded-2xl p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg text-gray-600">Module Details</h2>
          <div className="flex gap-4">
            <button
              onClick={handleShowAssignment}
              className="bg-blue-400/20 px-2 py-1 rounded-md text-blue-500"
            >
              Add Assignment
            </button>
            <button className="bg-red-400/20 px-2 py-1 rounded-md text-red-500">
              Delete Module
            </button>
          </div>
        </div>
        <ModuleInput title={title} moduleId={id} />
        {lessons.length > 0 &&
          lessons.map(lesson => <Lessons key={`${lesson.id}+${id}`} lesson={lesson} />)}
        <NewLesson key={id} moduleId={id} />
      </div>
    </>
  );
};

export default Modules;
