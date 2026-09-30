import React from 'react';

export function SizeSelector({ sizes, value, onChange, style }) {
  const list = (sizes || []).map((s) => (typeof s === 'string' ? { label: s } : s));
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', ...style }}>
      {list.map((s) => {
        const selected = value === s.label;
        return (
          <span
            key={s.label}
            onClick={s.soldOut || !onChange ? undefined : () => onChange(s.label)}
            style={{
              minWidth: 34,
              height: 30,
              padding: '0 6px',
              boxSizing: 'border-box',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'var(--control-border)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              background: selected ? 'var(--surface-inverse)' : 'var(--paper)',
              color: selected ? 'var(--text-inverse)' : s.soldOut ? 'var(--text-muted)' : 'var(--text-body)',
              textDecoration: s.soldOut ? 'line-through' : 'none',
              cursor: s.soldOut ? 'not-allowed' : onChange ? 'pointer' : 'default',
              userSelect: 'none',
              transition: 'none',
            }}
          >{s.label}</span>
        );
      })}
    </div>
  );
}
