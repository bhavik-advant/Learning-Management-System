import dynamic from 'next/dynamic';

import type { MarkdownEditorProps } from './types';

const MarkdownEditor = dynamic(() => import('./MdxEditorImpl').then(m => m.MarkdownEditorImpl), {
  ssr: false,
  loading: () => <div className="text-sm text-muted-foreground">Loading editor…</div>,
});

export { MarkdownEditor };
export type { MarkdownEditorProps };
