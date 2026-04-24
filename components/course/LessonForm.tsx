'use client';
import React, { useRef, useState } from 'react';
import { BiLinkAlt, BiVideo } from 'react-icons/bi';
import { CiSaveUp2 } from 'react-icons/ci';
import { Card, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

type LessonAddFormProps = {
  moduleId: string;
  onClose: () => void;
  title?: string;
  url?: string;
  formTitle: string;
  func: ({ title, url, file }: { title: string; url?: string; file?: File }) => Promise<void>;
  stringForm?: boolean;
  isPending: boolean;
};

const LessonForm: React.FC<LessonAddFormProps> = ({
  moduleId,
  title: incomingTitle,
  url,
  formTitle,
  func,
  onClose,
  stringForm = false,
  isPending,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState(incomingTitle || '');
  const [link, setLink] = useState(url || '');
  const [showStringForm, setShowStringForm] = useState<boolean>(stringForm ?? false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFile = event.target.files?.[0];
    if (!incomingFile) return;
    setFile(incomingFile);
  };

  const handleAddLesson = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (showStringForm) {
        await func({ title, url: link });
      } else {
        if (!file) return;
        await func({ title, file: file });
      }

      setFile(null);
      setTitle('');
      setLink('');
      if (inputRef.current) inputRef.current.value = '';
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <form onSubmit={handleAddLesson} className=" w-full max-w-[600px] ">
      <Card className="p-4 border border-gray-400/30">
        <CardTitle className=" text-lg font-semibold text-gray-700 ">{formTitle}</CardTitle>

        <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
          <button
            type="button"
            onClick={() => setShowStringForm(false)}
            className={`flex items-center justify-center gap-1.5 flex-1 py-1.5 text-xs font-medium rounded-md transition ${
              !showStringForm
                ? 'bg-white dark:bg-gray-600 shadow-sm text-red-500'
                : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            <BiVideo size={16} />
            Upload Video
          </button>

          <button
            type="button"
            onClick={() => setShowStringForm(true)}
            className={`flex items-center justify-center gap-1.5 flex-1 py-1.5 text-xs font-medium rounded-md transition ${
              showStringForm
                ? 'bg-white dark:bg-gray-600 shadow-sm text-red-500'
                : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            <BiLinkAlt size={16} />
            Add Link
          </button>
        </div>

        <Input
          type="text"
          placeholder="Enter lesson title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition bg-white dark:bg-gray-700"
        />

        {showStringForm ? (
          <Input
            type="url"
            placeholder="https://example.com/video"
            value={link}
            onChange={e => setLink(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition bg-white dark:bg-gray-700"
          />
        ) : (
          <label
            htmlFor={`lesson-${moduleId}`}
            className="flex flex-col items-center justify-center w-full h-20 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition text-center"
          >
            {file ? (
              <p className="text-xs font-medium text-gray-700 dark:text-gray-100 truncate px-2">
                {file.name}
              </p>
            ) : (
              <>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-200">
                  Click to upload video
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-0.5">
                  Supports files up to 100 MB
                </p>
              </>
            )}

            <input
              id={`lesson-${moduleId}`}
              name="lesson"
              onChange={handleChangeImage}
              ref={inputRef}
              type="file"
              className="hidden"
            />
          </label>
        )}

        <div className="flex justify-end gap-4">
          <button className="font-light text-sm cursor-pointer" onClick={onClose}>
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending || !title.trim() || (showStringForm ? !link.trim() : !file)}
            className="p-2 flex items-center justify-center bg-red-500 text-white  rounded-lg text-xs font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isPending ? (
              <span className="animate-pulse">uploading..</span>
            ) : (
              <>
                <CiSaveUp2 size={18} />
              </>
            )}
          </button>
        </div>
      </Card>
    </form>
  );
};

export default LessonForm;
