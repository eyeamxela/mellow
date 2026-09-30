import React from 'react';

export function Choice({ label, selected = false, onSelect, disabled = false, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <span
      onClick={disabled ? undefined : onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: disabled ? 'var(--text-muted)' : 'var(--text-body)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        textDecoration: hover && !disabled ? 'underline' : 'none',
        userSelect: 'none',
        ...style,
      }}
    >
      <span style={{
        width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
        border: '1px solid currentColor',
        background: selected ? 'currentColor' : 'transparent',
        boxSizing: 'border-box',
      }}></span>
      {label}
    </span>
  );
}
