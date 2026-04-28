'use client';

import * as React from 'react';

import {
  GenericJsxEditor,
  type JsxEditorProps,
  type JsxComponentDescriptor,
  useLexicalNodeRemove,
} from '@mdxeditor/editor';

import { BiTrash } from 'react-icons/bi';
import { deleteFile } from '@/services/apis/file';
import { useMutation } from '@tanstack/react-query';
import { RiLoader4Fill } from 'react-icons/ri';

function getJsxStringProp(mdastNode: unknown, propName: string): string | undefined {
  const attributes = (mdastNode as { attributes?: Array<{ name?: string; value?: unknown }> })
    ?.attributes;
  const attr = attributes?.find(a => a?.name === propName);
  const value = attr?.value;
  return typeof value === 'string' ? value : undefined;
}

type CreateJsxComponentDescriptorsOptions = {
  courseId?: string;
  moduleId?: string;
  readOnly?: boolean;
};

function createFileAssetJsxEditor({
  courseId,
  moduleId,
  readOnly,
}: CreateJsxComponentDescriptorsOptions) {
  return function FileAssetJsxEditor({ mdastNode }: JsxEditorProps) {
    const url = getJsxStringProp(mdastNode, 'url');
    const name = getJsxStringProp(mdastNode, 'name');
    const fileId = getJsxStringProp(mdastNode, 'id');
    const removeNode = useLexicalNodeRemove();

    const { mutateAsync, isPending } = useMutation({
      mutationFn: deleteFile,
    });

    const disableRemove = Boolean(readOnly) || isPending;

    return (
      <div className="not-prose rounded-lg border bg-background p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{name ?? 'File'}</div>
            {/* {url ? <div className="truncate text-xs text-muted-foreground">{url}</div> : null} */}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (!url) return;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="text-sm underline"
              disabled={!url}
            >
              Open
            </button>
            <button
              type="button"
              onClick={async () => {
                if (disableRemove) return;

                if (courseId && moduleId && fileId) {
                  try {
                    await mutateAsync({ courseId, moduleId, fileId });
                  } catch (err) {
                    console.error('Failed to delete file asset', err);
                  }
                }

                removeNode();
              }}
              className="rounded-md bg-red-300/20 p-1 text-xl"
              aria-label="Remove file asset"
              title="Remove"
              disabled={disableRemove}
            >
              <BiTrash className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
    );
  };
}

function createVideoAssetJsxEditor({
  courseId,
  moduleId,
  readOnly,
}: CreateJsxComponentDescriptorsOptions) {
  return function VideoAssetJsxEditor({ mdastNode }: JsxEditorProps) {
    const url = getJsxStringProp(mdastNode, 'url');
    const poster = getJsxStringProp(mdastNode, 'poster');
    const title = getJsxStringProp(mdastNode, 'title');
    const fileId = getJsxStringProp(mdastNode, 'id');
    const removeNode = useLexicalNodeRemove();

    const { mutateAsync, isPending } = useMutation({
      mutationFn: deleteFile,
    });

    const disableRemove = Boolean(readOnly) || isPending;

    return (
      <div className="not-prose rounded-lg border bg-background p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {title ? <div className="truncate text-sm font-medium">{title}</div> : null}
            {/* {url ? <div className="truncate text-xs text-muted-foreground">{url}</div> : null} */}
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={async () => {
                if (disableRemove) return;

                if (courseId && moduleId && fileId) {
                  try {
                    await mutateAsync({ courseId, moduleId, fileId });
                  } catch (err) {
                    console.error('Failed to delete video asset', err);
                  }
                }

                removeNode();
              }}
              className="rounded-md bg-red-300/20 p-1 text-xl"
              aria-label="Remove video asset"
              title="Remove"
              disabled={disableRemove}
            >
              {isPending ? (
                <RiLoader4Fill className="animate-spin text-xl" />
              ) : (
                <BiTrash className="text-red-400" />
              )}
            </button>
          )}
        </div>
        {url ? (
          <video controls preload="metadata" poster={poster} src={url} style={{ width: '100%' }} />
        ) : (
          <div className="text-sm text-muted-foreground">Video URL missing</div>
        )}
      </div>
    );
  };
}

function createImageAssetJsxEditor({
  courseId,
  moduleId,
  readOnly,
}: CreateJsxComponentDescriptorsOptions) {
  return function ImageAssetJsxEditor({ mdastNode }: JsxEditorProps) {
    const url = getJsxStringProp(mdastNode, 'url');
    const alt = getJsxStringProp(mdastNode, 'alt');
    const title = getJsxStringProp(mdastNode, 'title');
    const fileId = getJsxStringProp(mdastNode, 'id');
    const removeNode = useLexicalNodeRemove();

    const { mutateAsync, isPending } = useMutation({
      mutationFn: deleteFile,
    });

    const disableRemove = Boolean(readOnly) || isPending;

    return (
      <div className="not-prose rounded-lg border bg-background p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {title ? <div className="truncate text-sm font-medium">{title}</div> : null}
            {/* {url ? <div className="truncate text-xs text-muted-foreground">{url}</div> : null} */}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (!url) return;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="text-sm underline"
              disabled={!url}
            >
              Open
            </button>
            {!readOnly && (
              <button
                type="button"
                onClick={async () => {
                  if (disableRemove) return;

                  if (courseId && moduleId && fileId) {
                    try {
                      await mutateAsync({ courseId, moduleId, fileId });
                    } catch (err) {
                      console.error('Failed to delete image asset', err);
                    }
                  }

                  removeNode();
                }}
                className="rounded-md bg-red-300/20 p-1 text-xl"
                aria-label="Remove image asset"
                title="Remove"
                disabled={disableRemove}
              >
                {isPending ? (
                  <RiLoader4Fill className="animate-spin text-xl" />
                ) : (
                  <BiTrash className="text-red-400" />
                )}
              </button>
            )}
          </div>
        </div>

        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={alt ?? ''} loading="lazy" style={{ width: '100%', height: 'auto' }} />
        ) : (
          <div className="text-sm text-muted-foreground">Image URL missing</div>
        )}
      </div>
    );
  };
}

function createJsxComponentDescriptors(options: CreateJsxComponentDescriptorsOptions) {
  const descriptors: JsxComponentDescriptor[] = [
    {
      name: 'video',
      kind: 'flow' as const,
      props: [
        { name: 'src', type: 'string' as const, required: true },
        { name: 'controls', type: 'expression' as const },
        { name: 'width', type: 'number' as const },
      ],
      hasChildren: false,
      Editor: GenericJsxEditor,
    },
    {
      name: 'FileAsset',
      kind: 'flow' as const,
      source: '@/components/mdx/FileAsset',
      defaultExport: true,
      props: [
        { name: 'id', type: 'string' as const, required: true },
        { name: 'url', type: 'string' as const, required: true },
        { name: 'name', type: 'string' as const, required: true },
        { name: 'size', type: 'number' as const },
      ],
      hasChildren: false,
      Editor: createFileAssetJsxEditor(options),
    },
    {
      name: 'VideoAsset',
      kind: 'flow' as const,
      source: '@/components/mdx/VideoAsset',
      defaultExport: true,
      props: [
        { name: 'id', type: 'string' as const, required: true },
        { name: 'url', type: 'string' as const, required: true },
        { name: 'poster', type: 'string' as const },
        { name: 'title', type: 'string' as const },
      ],
      hasChildren: false,
      Editor: createVideoAssetJsxEditor(options),
    },
    {
      name: 'ImageAsset',
      kind: 'flow' as const,
      source: '@/components/mdx/ImageAsset',
      defaultExport: true,
      props: [
        { name: 'id', type: 'string' as const, required: true },
        { name: 'url', type: 'string' as const, required: true },
        { name: 'alt', type: 'string' as const },
        { name: 'title', type: 'string' as const },
      ],
      hasChildren: false,
      Editor: createImageAssetJsxEditor(options),
    },
  ];

  return descriptors;
}

export { createJsxComponentDescriptors };
