import React from 'react';

export function InvertLabel({ children, active = true, size = 'md', onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const on = active || hover;
  const fs = size === 'md' ? 'var(--text-md)' : size === 'sm' ? 'var(--text-sm)' : 'var(--text-xs)';
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 'var(--weight-bold)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-caps)',
        fontSize: fs,
        lineHeight: 1.3,
        padding: '1px 8px 2px',
        background: on ? 'var(--surface-inverse)' : 'transparent',
        color: on ? 'var(--text-inverse)' : 'var(--text-body)',
        cursor: onClick ? 'pointer' : 'inherit',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        transition: 'none',
        userSelect: 'none',
        ...style,
      }}
    >{children}</span>
  );
}
