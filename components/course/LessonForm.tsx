import React, { useRef, useState } from 'react';
import { BiPlus } from 'react-icons/bi';

type Lesson = {
  id: string;
  title: string;
  url: string;
};

type LessonEditFormProps = {
  func: () => void;
  lesson: Lesson;
};

const LessonForm: React.FC<LessonEditFormProps> = ({  func, lesson }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFile = event.target.files?.[0];
    if (!incomingFile) return;
    setFile(incomingFile);
  };

  const handleAddLesson = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!file) return;

    setIsUploading(true);
    try {
      func();
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };



  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Course Lesson</label>
      <div className="flex items-center justify-center w-full gap-4">
        <div className="flex flex-col items-center justify-center w-full h-15 border-2 border-gray-300 rounded-xl bg-gray-50 p-4">
          <p className="text-sm font-semibold">{lesson.title}</p>
        </div>
      </div>
    </div>
  );
};

export default LessonForm;
