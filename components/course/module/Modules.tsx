'use client';

import NewLesson from '../lesson/NewLesson';
import Lessons from '../lesson/Lessons';
import ModuleInput from './ModuleInput';
import AssignmentForm from '../assignment/AssignmentForm';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { BiPlus } from 'react-icons/bi';
import Assignments from '../assignment/Asssignments';
import { useCreateAssignment } from '@/hooks/courses/assignment/useCreateAssignment';
import DropDown from '@/components/ui/DropDown';
type Lesson = {
  id: string;
  title: string;
  content: string;
};

type Assignment = {
  id: string;
  title: string;
  description: string;
  maxScore: number;
};

type ModuleFormEditProps = {
  id: string;
  title: string;
  index: number;
  lessons: Lesson[];
  assignments: Assignment[];
};

const Modules: React.FC<ModuleFormEditProps> = ({ id, index, title, lessons, assignments }) => {
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [formName, setFormName] = useState('');
  const { id: courseId } = useParams<{ id: string }>();

  const { createAssignment, isCreating } = useCreateAssignment(courseId, id);

  const handleAddAssignment = async ({
    title,
    description,
    maxScore,
  }: {
    title: string;
    description: string;
    maxScore: number;
  }) => {
    await createAssignment({ courseId, moduleId: id, title, description, maxScore });
  };

  const handleCloseForm = () => {
    setShowLessonForm(false);
    setFormName('');
  };

  return (
    <div className="mt-4 space-y-4  ">
      <ModuleInput index={index} title={title} moduleId={id} />

      <div className="flex justify-center ">
        <h5 className="bg-white text-sm"> Lessons</h5>
      </div>

      {lessons.length > 0 &&
        lessons.map(lesson => <Lessons moduleId={id} key={`${lesson.id}+${id}`} lesson={lesson} />)}

      {assignments.length > 0 && <Assignments assignments={assignments} moduleId={id} />}

      <div className="flex justify-center items-center">
        {!showLessonForm ? (
          <DropDown
            trigger={
              <div className="bg-white">
                <span className="block bg-red-400/20 text-red-400 p-2 rounded-md  cursor-pointer">
                  <BiPlus />
                </span>
              </div>
            }
            options={['Assignment', 'Lesson']}
            onSelect={val => {
              setFormName(val);
              setShowLessonForm(true);
            }}
          />
        ) : (
          <>
            {formName.toLowerCase() == 'assignment' ? (
              <AssignmentForm
                submitText="Add"
                onClose={handleCloseForm}
                func={handleAddAssignment}
                isPending={isCreating}
                moduleId={id}
              />
            ) : (
              <NewLesson onClose={handleCloseForm} key={id} moduleId={id} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Modules;
