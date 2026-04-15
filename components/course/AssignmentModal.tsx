'use client';

import { createAssignment } from '@/services/apis/Assignments';
import { useMutation } from '@tanstack/react-query';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const AssignmentModal = ({ ref, moduleId }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createAssignment,
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    maxScore: 0,
  });

  const onChangeHandler = (identifier: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [identifier]: value,
    }));
  };

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  const handleSubmitAssignMent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutateAsync({
      moduleId,
      title: formData.title,
      description: formData.description,
      maxScore: formData.maxScore,
    });
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className="min-w-screen min-h-screen z-40 px-16 bg-black/50 backdrop-blur-sm "
    >
      <div className="flex h-screen justify-center items-center">
        <form
          onSubmit={handleSubmitAssignMent}
          className="w-full  bg-white rounded-2xl shadow-xl p-6 space-y-5 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-800">Create Assignment</h2>

          <div className="space-y-1">
            <label htmlFor="title" className="text-sm text-gray-600">
              Assignment Title
            </label>
            <input
              id="title"
              value={formData.title}
              onChange={event => onChangeHandler('title', event.target.value)}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="text-sm text-gray-600">
              Assignment Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              rows={8}
              onChange={event => onChangeHandler('description', event.target.value)}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="maxscore" className="text-sm text-gray-600">
              Max Score
            </label>
            <input
              id="maxscore"
              type="number"
              value={formData.maxScore}
              onChange={event => onChangeHandler('maxScore', event.target.value)}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
              disabled={isPending}
            >
              Close
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              disabled={isPending}
            >
              Save Assignment
            </button>
          </div>
        </form>
      </div>
    </dialog>,
    document.getElementById('modal')
  );
};

export default AssignmentModal;
