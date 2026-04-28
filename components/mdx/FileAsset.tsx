'use client';

import * as React from 'react';

type FileAssetProps = {
  id: string;
  url: string;
  name: string;
  size?: number;
};

function formatBytes(bytes?: number) {
  if (bytes == null) return '';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const precision = unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
}

export default function FileAsset({ id, url, name, size }: FileAssetProps) {
  const handleOpen = React.useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [url]);

  return (
    <div data-asset-id={id} className="not-prose">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{name}</div>
          {size != null ? <div className="text-xs text-muted-foreground">{formatBytes(size)}</div> : null}
        </div>

        <button type="button" onClick={handleOpen} className="text-sm underline">
          Open
        </button>
      </div>
    </div>
  );
}
