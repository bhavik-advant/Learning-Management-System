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
        // await mutateAsync({ moduleId, title, url: link });
      } else {
        if (!file) return;
        await mutateAsync({ moduleId, title, lesson: file });
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
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4"
    >
      <label className="block text-sm font-semibold text-gray-700">Add New Lesson</label>

      <div className="flex rounded-xl bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setShowStringForm(false)}
          className={`flex items-center justify-center gap-2 flex-1 py-2 text-sm font-medium rounded-lg transition ${
            !showStringForm ? 'bg-white shadow text-red-500' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BiVideo size={18} />
          Upload Video
        </button>
        <button
          type="button"
          onClick={() => setShowStringForm(true)}
          className={`flex items-center justify-center gap-2 flex-1 py-2 text-sm font-medium rounded-lg transition ${
            showStringForm ? 'bg-white shadow text-red-500' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BiLinkAlt size={18} />
          Add Link
        </button>
      </div>

      <input
        type="text"
        placeholder="Enter lesson title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
      />

      {showStringForm ? (
        <input
          type="url"
          placeholder="https://example.com/video"
          value={link}
          onChange={e => setLink(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
        />
      ) : (
        <label
          htmlFor={`lesson-${moduleId}`}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition text-center"
        >
          {file ? (
            <p className="text-sm font-semibold text-gray-700">{file.name}</p>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-600">Click to upload video</p>
              <p className="text-xs text-gray-400 mt-1">Supports large files (up to 2GB)</p>
            </>
          )}
          <input
            id={`lesson-${moduleId}`}
            name="lesson"
            onChange={handleChangeImage}
            ref={inputRef}
            type="file"
            accept="*"
            className="hidden"
          />
        </label>
      )}

      <button
        type="submit"
        disabled={isPending || title == '' || (!showStringForm && !file)}
        className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isPending ? (
          <span className="animate-pulse">Adding...</span>
        ) : (
          <>
            <BiPlus size={20} />
            Add Lesson
          </>
        )}
      </button>
    </form>
  );
};

export default NewLesson;
