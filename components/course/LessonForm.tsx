'use client';

import { Upload } from 'lucide-react';
import { MarkdownEditor } from '@/components/mdxEditor';
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { uploadFile } from '@/services/apis/file';
import { useParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { RiLoader4Fill } from 'react-icons/ri';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type LessonFormProps = {
  submitText: string;
  title?: string;
  content?: string;
  moduleId: string;
  isPending: boolean;
  onClose: () => void;
  func: ({ content, title }: { content: string; title: string }) => Promise<void>;
} & Record<string, unknown>;

const LessonForm: React.FC<LessonFormProps> = ({
  submitText,
  onClose,
  isPending,
  moduleId,
  func,
  title: incomingTitle,
  content,
}) => {
  const { id: courseId } = useParams<{ id: string }>();

  const [title, setTitle] = useState<string>(incomingTitle || '');

  const [markDown, setMarkDown] = useState<string>(content || '');

  const { mutateAsync, isPending: uploading } = useMutation({
    mutationFn: uploadFile,
  });

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
    setMarkDown(prev => `${prev}\n\n${markDownText}`);
  };

  const handleAddLesson = async () => {
    await func({ content: markDown, title });
  };
  return (
    <div className="flex justify-center ">
      <Card className="max-w-200">
        <CardContent className="flex flex-col gap-4">
          <Label htmlFor="title">Title</Label>
          <Input
            value={title}
            onChange={event => setTitle(event.target.value)}
            className="rounded-lg"
            placeholder="Enter Title for Lesson"
            id="title"
          />
        </CardContent>
        <CardContent className="  flex justify-center  min-h-0  ">
          <MarkdownEditor
            value={markDown}
            onChange={setMarkDown}
            courseId={courseId}
            moduleId={moduleId}
            className="h-full max-w-175 w-full"
            contentEditableClassName="h-full min-h-0 w-full overflow-y-auto"
            readOnly={uploading}
          />
        </CardContent>

        <CardContent className="flex items-center justify-between gap-4 ">
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
                  disabled={uploading}
                  id="resource"
                />
              </>
            )}
          </div>

          <div className="flex gap-4">
            <button disabled={isPending || uploading} type="button" onClick={onClose}>
              Cancel
            </button>
            <button disabled={isPending || uploading} onClick={handleAddLesson} type="button">
              {!isPending ? submitText : <RiLoader4Fill className="animate-spin" />}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonForm;
