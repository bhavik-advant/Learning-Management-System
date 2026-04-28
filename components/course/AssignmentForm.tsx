'use client';

import { createAssignment } from '@/services/apis/assignments';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MarkdownEditor } from '../mdxEditor';
import { Upload } from 'lucide-react';
import { uploadFile } from '@/services/apis/file';
import { RiLoader4Fill } from 'react-icons/ri';

const AssignmentForm = ({
  title,
  description,
  maxScore,
  moduleId,
  courseId,
  onClose,
}: {
  moduleId: string;
  maxScore?: number;
  title?: string;
  description?: string;
  courseId: string;
  onClose: () => void;
}) => {
  const { mutateAsync: addAssignment, isPending } = useMutation({
    mutationFn: createAssignment,
  });

  const [formData, setFormData] = useState({
    title: title || '',
    description: description || '',
    maxScore: maxScore || 0,
  });

  const onChangeHandler = (identifier: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [identifier]: value,
    }));
  };

  const { mutateAsync, isPending: uploading } = useMutation({
    mutationFn: uploadFile,
  });

  const handleSubmitAssignMent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await addAssignment({
      courseId,
      moduleId,
      title: formData.title,
      description: formData.description,
      maxScore: formData.maxScore,
    });

    console.log(result);
  };

  const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await mutateAsync({ courseId, moduleId, resource: file });

    const { id: assetId, url } = result;

    let markDownText = '';

    if (file.type.startsWith('image/')) {
      markDownText = `<ImageAsset id="${assetId}" url="${url}" alt="${file.name.replaceAll('"', '\\"')}" title="${file.name.replaceAll('"', '\\"')}" />\n\n`;
    } else if (file.type.startsWith('video/')) {
      markDownText = `<VideoAsset id="${assetId}" url="${url}" poster="/placeholder.svg" title="${file.name.replaceAll('"', '\\"')}" />\n\n`;
    } else {
      markDownText = `<FileAsset id="${assetId}" url="${url}" name="${file.name.replaceAll('"', '\\"')}" />\n\n`;
    }
    setFormData(prev => ({ ...prev, description: `${prev.description}\n\n${markDownText}` }));
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
          <MarkdownEditor
            courseId={courseId}
            moduleId={moduleId}
            value={formData.description}
            readOnly={uploading}
            onChange={(val: string) => onChangeHandler('description', val)}
          />
          <div className="shrink-0">
            {uploading ? (
              <RiLoader4Fill className="animate-spin" />
            ) : (
              <>
                <label htmlFor="resource">
                  <Upload />
                </label>
                <input
                  onChange={handleUploadImage}
                  className="hidden"
                  type="file"
                  accept="image/*,video/*,application/pdf,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
                  name=""
                  disabled={uploading || isPending}
                  id="resource"
                />
              </>
            )}
          </div>
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
            {isPending ? 'Adding' : 'Add Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;
