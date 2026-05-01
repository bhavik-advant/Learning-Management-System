'use client';

import { MarkdownEditor } from '@/components/mdxEditor';

type Lesson = {
  id: string;
  title: string;
  content: string | null;
};

type ContentViewerProps = {
  lesson: Lesson | null | undefined;
};

export function ContentViewer({ lesson }: ContentViewerProps) {
  if (!lesson?.content) {
    return <EmptyPlayerState />;
  }

  return (
    <div className="rounded-3xl overflow-hidden bg-white dark:bg-gray-900 shadow-xl border border-gray-200/50 dark:border-gray-800">
      <PlayerHeader title={lesson.title} />

      <div className="p-6 max-h-[75vh] overflow-y-auto">
        <MarkdownEditor
          value={lesson.content}
          onChange={() => {}}
          isEditing={false}
          readOnly={true}
          className="border-none bg-transparent p-0"
        />
      </div>
    </div>
  );
}

const PlayerHeader = ({ title }: { title: string }) => (
  <div className="p-4 sm:p-6 bg-gray-200 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-gray-500/40 flex items-center justify-center">
        <DocIcon />
      </div>
      <div>
        <h2 className="font-semibold text-gray-900 ">{title || 'Select a lesson to start'}</h2>
        {title && <p className="text-xs text-gray-500 dark:text-gray-400">Lesson content</p>}
      </div>
    </div>
  </div>
);

const EmptyPlayerState = () => (
  <div className="rounded-3xl overflow-hidden bg-white dark:bg-gray-900 shadow-xl border border-gray-200/50 dark:border-gray-800">
    <PlayerHeader title="" />
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <DocIcon className="w-10 h-10 text-gray-400" />
      </div>
      <p className="text-sm font-medium">Select a lesson to view content</p>
    </div>
  </div>
);

const DocIcon = ({ className = 'w-5 h-5 text-indigo-600 dark:text-indigo-500' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6M7 8h10M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
    />
  </svg>
);
