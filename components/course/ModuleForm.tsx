'use client';

import React, { useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import LessonForm from './LessonForm';
type Lesson = {
  id: number;
  file: File | null;
};

const ModuleForm: React.FC<{
  id: number;
  title: string;
  lessons: Lesson[];
  onAddModule : (id : number , title : string) => void
  onChange: (id: number, identifier: 'title' | 'lessons', value: string | File) => void;
}> = ({ id, title, lessons,onAddModule, onChange }) => {
  const [showLessonForm, setShowLessonForm] = useState<boolean>(false);
  const handleModuleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddModule(id,title)
    setShowLessonForm(true);
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    onChange(id, 'lessons', file);
  };

  return (
    <div className="mt-4 space-y-4 border-2 border-dashed border-gray-300 rounded-2xl p-4">
      <form className="flex flex-col space-y-2" onSubmit={handleModuleSubmit}>
        <h2 className="text-lg text-gray-600">Add Module</h2>
        <div className="flex gap-4">
          <input
            placeholder="Module Name "
            className="flex-1 border rounded-md border-blue-500 focus:outline-none py-1 px-2"
            value={title}
            onChange={event => onChange(id, 'title', event.target.value)}
            type="text"
          />
          {showLessonForm ? (
            'Edit'
          ) : (
            <button className="bg-red-400/20 text-red-400 p-2 rounded-md">
              <BiPlus />
            </button>
          )}
        </div>
      </form>
      {showLessonForm &&
        lessons.map(lesson => (
          <LessonForm key={lesson.id} onImageChange={onImageChange} lesson={lesson} />
        ))}
    </div>
  );
};

export default ModuleForm;
