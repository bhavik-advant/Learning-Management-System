'use client';

import NewLesson from './NewLesson';
import Lessons from './Lessons';
import ModuleInput from './ModuleInput';
import AssignmentModal from './AssignmentModal';
import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { BiPlus } from 'react-icons/bi';
type Lesson = {
  id: string;
  title: string;
  url: string;
};

type ModuleFormEditProps = {
  id: string;
  title: string;
  index: number;
  lessons: Lesson[];
};

const Modules: React.FC<ModuleFormEditProps> = ({ id, index, title, lessons }) => {
  const [showLessonForm, setShowLessonForm] = useState(false);
  const assignmentRef = useRef(null);

  const { id: courseId } = useParams();

  const handleShowAssignment = () => {
    assignmentRef.current?.open();
  };

  return (
    <>
      <AssignmentModal moduleId={id} courseId={courseId} ref={assignmentRef} />
      <div className="mt-4 space-y-4  ">
        {/* <div className="flex items-center justify-between gap-4">
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
        </div>*/}
        <ModuleInput index={index} title={title} moduleId={id} />
        {lessons.length > 0 &&
          lessons.map(lesson => (
            <Lessons moduleId={id} key={`${lesson.id}+${id}`} lesson={lesson} />
          ))}
        <div className="flex justify-center items-center">
          {!showLessonForm ? (
            <span className="bg-white">
              <button
                onClick={() => setShowLessonForm(true)}
                className="bg-red-400/20 text-red-400 p-2 rounded-md  cursor-pointer"
              >
                <BiPlus />
              </button>
            </span>
          ) : (
            <NewLesson onClose={() => setShowLessonForm(false)} key={id} moduleId={id} />
          )}
        </div>
      </div>
    </>
  );
};

export default Modules;
