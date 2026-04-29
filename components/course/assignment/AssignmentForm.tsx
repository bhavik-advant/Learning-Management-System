'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MarkdownEditor } from '@/components/mdxEditor';
import { Upload } from 'lucide-react';
import { uploadFile } from '@/services/apis/file';
import { RiLoader4Fill } from 'react-icons/ri';
import { Card, CardContent } from '@/components/ui/card';
import { useParams } from 'next/navigation';

type AssignmentFormProps = {
  submitText: string;
  title?: string;
  description?: string;
  maxScore?: number;
  moduleId: string;
  isPending: boolean;
  onClose: () => void;
  func: ({
    title,
    description,
    maxScore,
  }: {
    title: string;
    description: string;
    maxScore: number;
  }) => Promise<void>;
} & Record<string, unknown>;

const AssignmentForm = ({
  submitText,
  onClose,
  isPending,
  moduleId,
  func,
  title: incomingTitle,
  description,
  maxScore,
}: AssignmentFormProps) => {
  const { id: courseId } = useParams<{ id: string }>();

  const [assignmentTitle, setAssignmentTitle] = useState<string>(incomingTitle || '');
  const [markDown, setMarkDown] = useState<string>(description || '');
  const [score, setScore] = useState<string>(String(maxScore ?? 100));

  const { mutateAsync, isPending: uploading } = useMutation({
    mutationFn: uploadFile,
  });

  const handleSubmitAssignMent = async () => {
    const maxScoreValue = Number.parseInt(score, 10);
    const maxScoreToSend = Number.isFinite(maxScoreValue) ? maxScoreValue : 0;

    await func({ title: assignmentTitle, description: markDown, maxScore: maxScoreToSend });
    onClose();
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
    setMarkDown(prev => `${prev}\n\n${markDownText}`);
  };

  return (
    <div className="flex justify-center mb-2">
      <Card className="max-w-200">
        <CardContent className="flex flex-col gap-4">
          <Label htmlFor="title">Title</Label>
          <Input
            value={assignmentTitle}
            onChange={event => setAssignmentTitle(event.target.value)}
            className="rounded-lg"
            placeholder="Enter Title for Assignment"
            id="title"
          />
        </CardContent>

        <CardContent className="flex flex-col gap-4">
          <Label htmlFor="maxscore">Max Score</Label>
          <Input
            id="maxscore"
            type="number"
            value={score}
            onChange={event => setScore(event.target.value)}
            className="rounded-lg"
            placeholder="Enter Max Score"
          />
        </CardContent>

        <CardContent className="flex justify-center min-h-0">
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

        <CardContent className="flex items-center justify-between gap-4">
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

          <div className="flex gap-4">
            <button disabled={isPending || uploading} type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              disabled={isPending || uploading}
              onClick={handleSubmitAssignMent}
              type="button"
            >
              {!isPending ? submitText : <RiLoader4Fill className="animate-spin" />}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentForm;
