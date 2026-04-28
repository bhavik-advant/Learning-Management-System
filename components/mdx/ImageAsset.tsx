'use client';

import * as React from 'react';

type ImageAssetProps = {
  id: string;
  url: string;
  alt?: string;
  title?: string;
};

export default function ImageAsset({ id, url, alt, title }: ImageAssetProps) {
  return (
    <div data-asset-id={id} className="not-prose">
      {title ? <div className="mb-2 text-sm font-medium">{title}</div> : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={alt ?? ''} loading="lazy" style={{ width: '100%', height: 'auto' }} />
    </div>
  );
}
