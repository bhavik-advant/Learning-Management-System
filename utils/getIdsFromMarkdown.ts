export const extractEmbeddedFileIds = (content: string): string[] => {
  if (!content) return [];

  const ids = new Set<string>();

  const tagRegex =
    /<(?:ImageAsset|VideoAsset|FileAsset)\b[^>]*\bid=(?:"([^"]+)"|'([^']+)')[^>]*\/?>(?:\s*<\/(?:ImageAsset|VideoAsset|FileAsset)>)?/g;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(content)) !== null) {
    const id = match[1] ?? match[2];
    if (id) ids.add(id);
  }

  return [...ids];
};
