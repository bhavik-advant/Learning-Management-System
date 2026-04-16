'use client';

import { addLesson } from '@/services/apis/lesson';
import { useMutation } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { BiPlus, BiLinkAlt, BiVideo } from 'react-icons/bi';
import { useParams } from 'next/navigation';
import queryClient from '@/utils/query-client';

type LessonAddFormProps = {
  moduleId: string;
};

const NewLesson: React.FC<LessonAddFormProps> = ({ moduleId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [showStringForm, setShowStringForm] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id: courseId } = useParams<{ id: string }>();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: addLesson,
    onSuccess: (response, variables) => {
      if (!response?.success || response.statusCode !== 201) return;

      const newLesson = {
        id: response.data.id,
        title: response.data.title,
        url: response.data.url || null,
      };

      queryClient.setQueryData(['courses', courseId], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            modules: oldData.data.modules.map((module: any) =>
              module.id === variables.moduleId
                ? {
                    ...module,
                    lessons: [...(module.lessons || []), newLesson],
                  }
                : module
            ),
          },
        };
      });
    },
  });

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFile = event.target.files?.[0];
    if (!incomingFile) return;
    setFile(incomingFile);
  };

  const handleAddLesson = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (showStringForm) {
        await mutateAsync({ courseId, moduleId, title, url: link });
      } else {
        if (!file) return;
        await mutateAsync({ courseId, moduleId, title, lesson: file });
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
    <form
      onSubmit={handleAddLesson}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm dark:shadow-black/20 space-y-3 transition-colors"
    >
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200">
        Add New Lesson
      </label>

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

      <input
        type="text"
        placeholder="Enter lesson title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition bg-white dark:bg-gray-700"
      />

      {showStringForm ? (
        <input
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
          className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition text-center"
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

      <button
        type="submit"
        disabled={isPending || !title.trim() || (showStringForm ? !link.trim() : !file)}
        className="w-full flex items-center justify-center gap-1.5 bg-red-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isPending ? (
          <span className="animate-pulse">Adding...</span>
        ) : (
          <>
            <BiPlus size={18} />
            Add Lesson
          </>
        )}
      </button>
    </form>
  );
};

export default NewLesson;
