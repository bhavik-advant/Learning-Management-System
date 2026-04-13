import { addLesson } from '@/services/apis/lesson';
import { useMutation } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { BiPlus } from 'react-icons/bi';

type LessonAddFormProps = {
  moduleId: string;
  onAddLesson: (moduleId: string, id: string, title: string, url: string) => void;
};

const NewLesson: React.FC<LessonAddFormProps> = ({ onAddLesson, moduleId }) => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lessonInputId = `lesson-${moduleId}`;
  const { mutateAsync, isPending } = useMutation({ mutationFn: addLesson });

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFile = event.target.files?.[0];
    if (!incomingFile) return;
    setFile(incomingFile);
  };

  const handleAddLesson = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) return;

    try {
      const response = await mutateAsync({ moduleId, lesson: file });
      console.log(response);

      if (response.success && response.statusCode == 201) {
        onAddLesson(moduleId, response.data.id, response.data.title, response.data.url || '');
      }
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <form onSubmit={handleAddLesson} noValidate>
      <div>
        <label htmlFor={lessonInputId} className="block text-sm font-medium text-gray-700 mb-2">
          Course Lesson
        </label>
        <div className="flex items-center justify-center w-full gap-4">
          <label
            htmlFor={lessonInputId}
            className="flex flex-col items-center justify-center w-full h-15 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {file ? (
                <p className="text-sm font-semibold">{file.name}</p>
              ) : (
                <>
                  <p className="mb-1 text-sm text-gray-600 font-semibold">Click to upload</p>
                  <p className="text-xs text-gray-400">Max 2gb can be uploaded</p>
                </>
              )}
            </div>
            <input
              id={lessonInputId}
              name="lesson"
              onChange={handleChangeImage}
              ref={inputRef}
              type="file"
              accept="*"
              className="hidden"
            />
          </label>
          <button
            type="submit"
            disabled={!file}
            className="bg-red-400/20 text-red-400 p-2 rounded-md h-15 hover:bg-red-400/30 disabled:opacity-50 transition"
          >
            {isPending ? '...' : <BiPlus />}
          </button>
        </div>
      </div>
    </form>
  );
};

export default NewLesson;
