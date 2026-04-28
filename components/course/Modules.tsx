/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import NewLesson from './NewLesson';
import Lessons from './Lessons';
import ModuleInput from './ModuleInput';
import AssignmentForm from './AssignmentForm';
import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { BiPlus } from 'react-icons/bi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Bookmark, BookOpen } from 'lucide-react';
type Lesson = {
  id: string;
  title: string;
  content: string;
};

type ModuleFormEditProps = {
  id: string;
  title: string;
  index: number;
  lessons: Lesson[];
};

const Modules: React.FC<ModuleFormEditProps> = ({ id, index, title, lessons }) => {
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [formName, setFormName] = useState('');
  const { id: courseId } = useParams<{ id: string }>();
  // const assignmentRef = useRef(null);

  // const handleShowAssignment = () => {
  //   assignmentRef.current?.open();
  // };

  const handleCloseForm = () => {
    setShowLessonForm(false);
    setFormName('');
  };

  return (
    <>
      <div className="mt-4 space-y-4  ">
        <ModuleInput index={index} title={title} moduleId={id} />
        {lessons.length > 0 &&
          lessons.map(lesson => (
            <Lessons moduleId={id} key={`${lesson.id}+${id}`} lesson={lesson} />
          ))}
        <div className="flex justify-center items-center">
          {!showLessonForm ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="bg-white">
                  <span className="block bg-red-400/20 text-red-400 p-2 rounded-md  cursor-pointer">
                    <BiPlus />
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setFormName('assignment');
                      setShowLessonForm(true);
                    }}
                  >
                    <BookOpen /> <p> Assignment</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setFormName('lesson');
                      setShowLessonForm(true);
                    }}
                  >
                    <Bookmark /> <p> lesson</p>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {formName == 'assignment' ? (
                <AssignmentForm  onClose={handleCloseForm} courseId={courseId} moduleId={id} />
              ) : (
                <NewLesson onClose={handleCloseForm} key={id} moduleId={id} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Modules;
