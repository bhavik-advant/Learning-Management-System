import React, { useRef, useState } from 'react';
import { BiEdit, BiPlus, BiTrash } from 'react-icons/bi';
import { FiDelete } from 'react-icons/fi';

type Lesson = {
  id: string;
  title: string;
  url: string;
};

type LessonEditFormProps = {
  func: () => void;
  lesson: Lesson;
};

const Lessons: React.FC<LessonEditFormProps> = ({ func, lesson }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Course Lesson</label>
      <div className="flex items-center justify-center w-full gap-4">
        <div className="flex flex-col items-center justify-center w-full h-18 border-2 border-gray-300 rounded-xl bg-gray-50 p-4">
          <p className="text-sm font-semibold">{lesson.title}</p>
        </div>
        <div className="flex flex-col gap-2">
          <button className="bg-blue-500/20 p-2 rounded-lg">
            <BiEdit className="text-blue-300" />
          </button>
          <button className="bg-red-500/20 p-2 rounded-lg">
            <BiTrash className="text-red-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
