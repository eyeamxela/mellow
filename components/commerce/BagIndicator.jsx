import React from 'react';

export function BagIndicator({ count = 0, iconSrc, size = 24, style }) {
  if (count > 0) {
    return (
      <span style={{
        width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--surface-inverse)', color: 'var(--text-inverse)',
        fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-bold)', fontSize: size * 0.55,
        userSelect: 'none', ...style,
      }}>{count}</span>
    );
  }
  if (iconSrc) return <img src={iconSrc} alt="bag" style={{ height: size, display: 'block', ...style }} />;
  return (
    <span style={{
      width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      border: 'var(--control-border)', borderRadius: 3, boxSizing: 'border-box',
      fontFamily: 'var(--font-blackletter)', fontSize: size * 0.62, lineHeight: 1, color: 'var(--ink)',
      userSelect: 'none', ...style,
    }}>m</span>
  );
}
