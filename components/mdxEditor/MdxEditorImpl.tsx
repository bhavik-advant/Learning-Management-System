'use client';

import * as React from 'react';

import '@mdxeditor/editor/style.css';

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ButtonWithTooltip,
  CodeToggle,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  type JsxComponentDescriptor,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  imagePlugin,
  jsxPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';

import { cn } from '@/lib/utils';

import type { MarkdownEditorProps } from './types';
import { createJsxComponentDescriptors } from './jsxEditors';
import { BsYoutube } from 'react-icons/bs';

function escapeJsxAttr(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function InsertYouTubeButton({
  disabled,
  onInsert,
}: {
  disabled: boolean;
  onInsert: (markdown: string) => void;
}) {
  return (
    <ButtonWithTooltip
      title="YouTube Link"
      disabled={disabled}
      onClick={() => {
        const url = window.prompt('Paste YouTube link');
        if (!url) return;

        const safeUrl = escapeJsxAttr(url.trim());
        if (safeUrl === '') return;

        onInsert(`\n\n<YouTube url="${safeUrl}" />\n\n`);
      }}
    >
      <BsYoutube className="text-red-300 " />
    </ButtonWithTooltip>
  );
}

function buildPlugins(
  imageUploadHandler: (file: File) => Promise<string>,
  jsxComponentDescriptors: JsxComponentDescriptor[],
  isEditing: boolean,
  toolbarExtra?: React.ReactNode
) {
  return [
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    linkPlugin(),
    linkDialogPlugin(),
    tablePlugin(),
    jsxPlugin({ jsxComponentDescriptors }),
    imagePlugin({ imageUploadHandler }),
    codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
    codeMirrorPlugin({
      codeBlockLanguages: {
        txt: 'Text',
        js: 'JavaScript',
        ts: 'TypeScript',
        json: 'JSON',
        css: 'CSS',
        html: 'HTML',
        bash: 'Bash',
      },
    }),
    ...(isEditing
      ? [
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <ListsToggle />
                <CreateLink />
                {toolbarExtra}
                <InsertTable />
                <InsertThematicBreak />
              </>
            ),
          }),
        ]
      : []),
    markdownShortcutPlugin(),
  ];
}

function useSyncExternalMarkdown(
  editorRef: React.RefObject<MDXEditorMethods | null>,
  value: string
) {
  const lastValueRef = React.useRef(value);

  React.useEffect(() => {
    if (!editorRef.current) return;
    if (value === lastValueRef.current) return;

    const current = editorRef.current.getMarkdown();
    if (value !== current) {
      editorRef.current.setMarkdown(value);
    }

    lastValueRef.current = value;
  }, [editorRef, value]);

  return lastValueRef;
}

function MarkdownEditorImpl({
  value,
  onChange,
  placeholder,
  className,
  contentEditableClassName,
  courseId,
  moduleId,
  isEditing = true,
  readOnly = false,
  autoFocus = false,
  spellCheck = true,
}: MarkdownEditorProps) {
  const editorRef = React.useRef<MDXEditorMethods>(null);
  const objectUrlsRef = React.useRef<string[]>([]);

  // MDXEditor does not reliably apply plugin list changes after mount.
  // Remount when props that affect plugins/UI change (e.g. toolbar).
  const editorKey = React.useMemo(
    () => `${isEditing ? 'editing' : 'view'}-${readOnly ? 'ro' : 'rw'}`,
    [isEditing, readOnly]
  );

  // MDXEditor internals call `.trim()` on the `markdown` prop.
  // Some call sites may accidentally pass `undefined` at runtime, so we normalize.
  const normalizedValue = typeof value === 'string' ? value : '';

  React.useEffect(() => {
    return () => {
      for (const url of objectUrlsRef.current) {
        URL.revokeObjectURL(url);
      }
      objectUrlsRef.current = [];
    };
  }, []);

  const lastValueRef = useSyncExternalMarkdown(editorRef, normalizedValue);

  const imageUploadHandler = React.useCallback(async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    objectUrlsRef.current.push(objectUrl);
    return objectUrl;
  }, []);

  const jsxComponentDescriptors = React.useMemo(
    () => createJsxComponentDescriptors({ courseId, moduleId, readOnly }),
    [courseId, moduleId, readOnly]
  );

  const [plugins, setPlugins] = React.useState<ReturnType<typeof buildPlugins> | null>(null);

  React.useEffect(() => {
    const toolbarExtra = (
      <InsertYouTubeButton
        disabled={readOnly}
        onInsert={markdown => {
          editorRef.current?.focus(() => editorRef.current?.insertMarkdown(markdown));
        }}
      />
    );

    setPlugins(buildPlugins(imageUploadHandler, jsxComponentDescriptors, isEditing, toolbarExtra));
  }, [imageUploadHandler, jsxComponentDescriptors, isEditing, readOnly]);

  const handleChange = React.useCallback(
    (nextMarkdown: string) => {
      const nextValue = typeof nextMarkdown === 'string' ? nextMarkdown : '';
      lastValueRef.current = nextValue;
      onChange(nextValue);
    },
    [lastValueRef, onChange]
  );

  if (!plugins) {
    return (
      <div className={cn('rounded-2xl border bg-input/50 p-2', readOnly, className)}>
        <div className="text-sm text-muted-foreground">Loading editor…</div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-2xl border bg-gray-100/20 p-2', readOnly, className)}>
      <MDXEditor
        key={editorKey}
        ref={editorRef}
        markdown={normalizedValue}
        onChange={handleChange}
        plugins={plugins}
        placeholder={placeholder}
        trim={false}
        readOnly={readOnly}
        autoFocus={autoFocus}
        spellCheck={spellCheck}
        contentEditableClassName={cn(
          'prose prose-sm max-w-none dark:prose-invert',
          contentEditableClassName
        )}
      />
    </div>
  );
}

export { MarkdownEditorImpl };
