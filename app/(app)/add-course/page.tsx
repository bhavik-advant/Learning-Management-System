'use client';

import { createCourse } from '@/services/apis/courses';
import { courseFormData } from '@/types/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function AddCourse() {
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCourse,
  });
  const [formData, setFormData] = useState<courseFormData>({
    title: '',
    description: '',
    thumbnail: null,
  });

  const onChangeHandler = (identifier: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [identifier]: value,
    }));
  };

  const imageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      thumbnail: file,
    }));
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    const response = await mutateAsync(formData);
    if (response.success && response.statusCode == 201) {
      router.push(`/add-course/${response.data.id}/content`);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Create New Course</h2>
        <p className="text-gray-500 mt-2">
          Provide the basic information to get started with your course.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Course Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={event => onChangeHandler('title', event.target.value)}
            placeholder="e.g., Mastering Next.js"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Course Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={event => onChangeHandler('description', event.target.value)}
            rows={4}
            placeholder="Write a short description about your course..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            required
          />
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
            Course Thumbnail
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="thumbnail"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            >
              {formData.thumbnail ? (
                <p>{formData.thumbnail.name}</p>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01.88-7.9A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-1 text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, or WEBP (Max. 5MB)</p>
                </div>
              )}
              <input
                onChange={imageHandler}
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isPending}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            disabled={isPending}
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            {isPending ? 'Creating Course....' : 'Save & Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCourse;
