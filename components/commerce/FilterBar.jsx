import React from 'react';
import { InvertLabel } from '../core/InvertLabel.jsx';

export function FilterBar({ filterOpen = false, onFilterToggle, view = '3', viewOptions = ['3', '6', 'ALL'], onViewChange, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', letterSpacing: 'var(--tracking-caps)', color: 'var(--text-body)', ...style }}>
      <span
        onClick={onFilterToggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ cursor: 'pointer', textDecoration: hover ? 'underline' : 'none', userSelect: 'none', fontWeight: filterOpen ? 'var(--weight-bold)' : 'var(--weight-regular)' }}
      >FILTER {filterOpen ? '∧' : '∨'}</span>
      <span style={{ flex: 1, textAlign: 'center', display: 'inline-flex', justifyContent: 'center', gap: '0.6em', alignItems: 'baseline' }}>
        <span>VIEW</span>
        {viewOptions.map((v) => (
          <InvertLabel key={v} size="md" active={String(view) === String(v)} onClick={onViewChange ? () => onViewChange(v) : undefined} style={{ padding: '0 5px 1px', fontWeight: 'var(--weight-regular)' }}>
            {v}
          </InvertLabel>
        ))}
      </span>
    </div>
  );
}
