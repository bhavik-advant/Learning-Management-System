'use client';

import { Upload } from 'lucide-react';
import { MarkdownEditor } from '@/components/mdxEditor';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { RiLoader4Fill } from 'react-icons/ri';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Pending from '../Pending';
import { useUploadFile } from '@/hooks/file/useUploadFile';

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

  const { uploadFile, isUploading } = useUploadFile();

  const handleUploadResource = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadFile({ courseId, moduleId, resource: file });

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
    <div className="flex justify-center my-2 flex-1 min-h-0">
      <Card className="max-w-3/5 flex-1 overflow-hidden rounded-2xl border border-slate-300/70 bg-slate-100/20 shadow-lg dark:border-slate-700 dark:bg-slate-900/95">
        <CardContent className="flex flex-col gap-4 border-b border-slate-300/60 pb-4 dark:border-slate-700">
          <Label htmlFor="title">Title</Label>
          <Input
            value={title}
            onChange={event => setTitle(event.target.value)}
            className="rounded-lg"
            placeholder="Enter Title for Lesson"
            id="title"
          />
        </CardContent>
        <CardContent className="flex min-h-0 justify-center py-2">
          <MarkdownEditor
            value={markDown}
            onChange={setMarkDown}
            courseId={courseId}
            moduleId={moduleId}
            className=" h-full w-full"
            contentEditableClassName="h-90 min-h-0 w-full overflow-y-auto rounded-lg"
            readOnly={isUploading}
          />
        </CardContent>

        <CardContent className="flex items-center justify-between gap-4 border-t border-slate-300/60 pt-4 dark:border-slate-700">
          <div className="shrink-0">
            {isUploading ? (
              <Pending />
            ) : (
              <>
                <label htmlFor="resource">
                  <Upload />
                </label>
                <input
                  onChange={handleUploadResource}
                  className="hidden"
                  type="file"
                  accept="image/*,video/*,application/pdf,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
                  name=""
                  disabled={isUploading}
                  id="resource"
                />
              </>
            )}
          </div>

          <div className="flex gap-4">
            <button disabled={isPending || isUploading} type="button" onClick={onClose}>
              Cancel
            </button>
            <button disabled={isPending || isUploading} onClick={handleAddLesson} type="button">
              {!isPending ? submitText : <RiLoader4Fill className="animate-spin" />}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonForm;
