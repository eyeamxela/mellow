import React from 'react';

export function Button({ label, variant = 'solid', size = 'md', disabled = false, onClick, type = 'button', style }) {
  const [hover, setHover] = React.useState(false);
  const solid = variant === 'solid';
  const inv = hover && !disabled;
  return (
    <button
      type={type}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={disabled ? undefined : onClick}
      style={{
        appearance: 'none',
        fontFamily: 'var(--font-mono)',
        fontWeight: 'var(--weight-bold)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-caps)',
        fontSize: size === 'sm' ? 'var(--text-2xs)' : 'var(--text-xs)',
        padding: size === 'sm' ? '3px 10px' : '7px 18px',
        border: solid ? '1px solid var(--ink)' : '1px solid transparent',
        background: solid ? (inv ? 'var(--paper)' : 'var(--surface-inverse)') : 'transparent',
        color: solid ? (inv ? 'var(--ink)' : 'var(--text-inverse)') : 'var(--text-body)',
        textDecoration: !solid && inv ? 'underline' : 'none',
        borderRadius: 'var(--radius)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        transition: 'none',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >{label}</button>
  );
}
