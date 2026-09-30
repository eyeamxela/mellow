import React from 'react';

export function VideoSlot({ src, poster, ratio = '16 / 9', caption, style }) {
  const media = src
    ? (src.endsWith('.mp4') || src.endsWith('.webm')
        ? <video controls src={src} poster={poster} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <iframe src={src} title={caption || 'video'} frameBorder="0" allowFullScreen style={{ width: '100%', height: '100%', display: 'block', border: 'none' }} />)
    : poster
      ? <img src={poster} alt={caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      : null;
  return (
    <div style={{ ...style }}>
      <div style={{ aspectRatio: ratio, background: 'var(--surface-media)', overflow: 'hidden' }}>{media}</div>
      {caption && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-body)', marginTop: 'var(--space-2)' }}>{caption}</div>}
    </div>
  );
}
