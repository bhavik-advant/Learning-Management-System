'use client';

import * as React from 'react';

import '@mdxeditor/editor/style.css';

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  type JsxComponentDescriptor,
  type LexicalVisitor,
  addImportVisitor$,
  type MdastImportVisitor,
  UndoRedo,
  addExportVisitor$,
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
  realmPlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';

import { $createLineBreakNode, $createTextNode, $isLineBreakNode, $isTextNode } from 'lexical';

import { cn } from '@/lib/utils';

import type { MarkdownEditorProps } from './types';
import { createJsxComponentDescriptors } from './jsxEditors';

const hardBreakExportVisitor: LexicalVisitor = {
  priority: 100,
  testLexicalNode: $isLineBreakNode,
  visitLexicalNode: ({ mdastParent, actions }) => {
    actions.appendToParent(mdastParent, { type: 'break' });
  },
};

const softBreakTextExportVisitor: LexicalVisitor = {
  priority: 101,
  testLexicalNode: (
    lexicalNode
  ): lexicalNode is Parameters<NonNullable<LexicalVisitor['testLexicalNode']>>[0] => {
    return $isTextNode(lexicalNode) && lexicalNode.getTextContent().includes('\n');
  },
  visitLexicalNode: ({ lexicalNode, mdastParent, actions }) => {
    if (!$isTextNode(lexicalNode)) {
      actions.nextVisitor();
      return;
    }

    const parts = lexicalNode.getTextContent().split('\n');
    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
      if (part.length > 0) {
        actions.appendToParent(mdastParent, { type: 'text', value: part });
      }
      if (index < parts.length - 1) {
        actions.appendToParent(mdastParent, { type: 'break' });
      }
    }
  },
};

const softBreakTextImportVisitor: MdastImportVisitor<{ type: 'text'; value: string }> = {
  priority: 100,
  testNode: 'text',
  visitNode({ mdastNode, actions }) {
    if (!mdastNode.value.includes('\n')) {
      actions.nextVisitor();
      return;
    }

    const parts = mdastNode.value.split('\n');
    const format = actions.getParentFormatting();
    const style = actions.getParentStyle();

    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];

      if (part.length > 0) {
        const textNode = $createTextNode(part);
        textNode.setFormat(format);
        if (style !== '') textNode.setStyle(style);
        actions.addAndStepInto(textNode);
      }

      if (index < parts.length - 1) {
        actions.addAndStepInto($createLineBreakNode());
      }
    }
  },
};

const preserveHardLineBreaksPlugin = realmPlugin({
  init(realm) {
    realm.pubIn({
      [addImportVisitor$]: softBreakTextImportVisitor,
      [addExportVisitor$]: [softBreakTextExportVisitor, hardBreakExportVisitor],
    });
  },
});

function buildPlugins(
  imageUploadHandler: (file: File) => Promise<string>,
  jsxComponentDescriptors: JsxComponentDescriptor[],
  isEditing: boolean
) {
  return [
    preserveHardLineBreaksPlugin(),
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
                <InsertImage />
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
    setPlugins(buildPlugins(imageUploadHandler, jsxComponentDescriptors, isEditing));
  }, [imageUploadHandler, jsxComponentDescriptors, isEditing]);

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
      <div
        className={cn(
          'rounded-2xl border bg-input/50 p-2',
          readOnly && 'cursor-not-allowed',
          className
        )}
      >
        <div className="text-sm text-muted-foreground">Loading editor…</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border bg-input/50 p-2',
        readOnly && 'cursor-not-allowed',
        className
      )}
    >
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
