import dynamic from 'next/dynamic';

const MarkdownEditor = dynamic(() => import('./MdxEditorImpl').then(m => m.MarkdownEditorImpl), {
  ssr: false,
  loading: () => <div className="text-sm text-muted-foreground">Loading editor…</div>,
});

export { MarkdownEditor };

