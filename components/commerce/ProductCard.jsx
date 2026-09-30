import React from 'react';

export function ProductCard({ image, hoverImage, name, price, meta, imageHeight = 260, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const src = hover && hoverImage ? hoverImage : image;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: 'var(--paper)', cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      <div style={{ height: imageHeight, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {src
          ? <img src={src} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
          : <div style={{ width: '70%', height: '80%', background: 'var(--gray-soft)' }}></div>}
      </div>
      <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-body)' }}>{name}</span>
        {price && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{price}</span>}
        {meta && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{meta}</span>}
      </div>
    </div>
  );
}
