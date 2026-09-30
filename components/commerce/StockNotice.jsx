import React from 'react';

export function StockNotice({ count = 1, boxed = false, style }) {
  const text = count <= 1 ? 'Last one available' : `Only ${count} in stock`;
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: 'var(--signal-stock)',
      display: 'inline-block',
      padding: boxed ? '6px 10px' : 0,
      border: boxed ? '1px solid var(--signal-stock)' : 'none',
      ...style,
    }}>{text}</span>
  );
}
