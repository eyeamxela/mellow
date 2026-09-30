import React from 'react';

export function TextInput({ placeholder, value, onChange, type = 'text', width = '100%', bare = false, style }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      style={{
        appearance: 'none',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-body)',
        background: 'var(--paper)',
        border: bare ? 'none' : 'var(--control-border)',
        borderRadius: 'var(--radius)',
        outline: 'none',
        height: 28,
        padding: '0 8px',
        width,
        boxSizing: 'border-box',
        ...style,
      }}
    />
  );
}
