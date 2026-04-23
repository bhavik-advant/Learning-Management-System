'use client';

import { createAssignment } from '@/services/apis/assignments';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

const AssignmentForm = ({
  moduleId,
  courseId,
  onClose,
}: {
  moduleId: string;
  courseId: string;
  onClose: () => void;
}) => {
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

  const handleSubmitAssignMent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutateAsync({
      courseId,
      moduleId,
      title: formData.title,
      description: formData.description,
      maxScore: formData.maxScore,
    });
  };

  return (
    <div className="flex-1 flex  justify-center items-center">
      <form
        onSubmit={handleSubmitAssignMent}
        className="w-full max-w-[600px]  bg-white rounded-2xl p-4 shadow-xl space-y-2 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-800">Create Assignment</h2>

        <div className="space-y-1">
          <Label htmlFor="title" className="text-sm text-gray-600">
            Assignment Title
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={event => onChangeHandler('title', event.target.value)}
            className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="description" className="text-sm text-gray-600">
            Assignment Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            rows={4}
            onChange={event => onChangeHandler('description', event.target.value)}
            className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="maxscore" className="text-sm text-gray-600">
            Max Score
          </Label>
          <Input
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
            onClick={onClose}
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
            Add Assignment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;
