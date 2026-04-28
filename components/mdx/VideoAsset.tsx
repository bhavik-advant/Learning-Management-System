'use client';

import * as React from 'react';

type VideoAssetProps = {
  id: string;
  url: string;
  poster?: string;
  title?: string;
};

export default function VideoAsset({ id, url, poster, title }: VideoAssetProps) {

  return (
    <div data-asset-id={id} className="not-prose">
      {title ? <div className="mb-2 text-sm font-medium">{title}</div> : null}
      <video controls preload="metadata" poster={poster} src={url} style={{ width: '100%' }} />
    </div>
  );
}
