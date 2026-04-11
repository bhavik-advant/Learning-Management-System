import React from 'react';
import { BiPlus } from 'react-icons/bi';

type Lesson = {
  id: number;
  file: File | null;
};

const LessonForm: React.FC<{
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  lesson: Lesson;
}> = ({ onImageChange }) => {
  return (
    <form>
      <div>
        <label htmlFor="lessor" className="block text-sm font-medium text-gray-700 mb-2">
          Course Lesson
        </label>
        <div className="flex items-center justify-center w-full gap-4">
          <label
            htmlFor="lesson"
            className="flex flex-col items-center justify-center w-full h-15 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-1 text-sm text-gray-600 font-semibold">Click to upload</p>
              <p className="text-xs text-gray-400">Max 2gb can be uploaded</p>
            </div>

            <input
              name="lesson"
              onChange={onImageChange}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
          <button className="bg-red-400/20 text-red-400 p-2 rounded-md h-15">
            <BiPlus />
          </button>
        </div>
      </div>
    </form>
  );
};

export default LessonForm;
