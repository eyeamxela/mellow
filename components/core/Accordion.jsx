import React from 'react';
import { InvertLabel } from './InvertLabel.jsx';

export function Accordion({ title, children, defaultOpen = false, open, onToggle, size = 'sm', style }) {
  const [selfOpen, setSelfOpen] = React.useState(defaultOpen);
  const isOpen = open !== undefined ? open : selfOpen;
  const toggle = () => { onToggle ? onToggle(!isOpen) : setSelfOpen(!isOpen); };
  return (
    <div style={{ marginBottom: 'var(--space-3)', ...style }}>
      <InvertLabel size={size} onClick={toggle}>{title}{isOpen ? ' −' : ' +'}</InvertLabel>
      {isOpen && (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--leading-body)',
          color: 'var(--text-body)',
          padding: 'var(--space-3) 0 var(--space-2)',
          whiteSpace: 'pre-line',
        }}>{children}</div>
      )}
    </div>
  );
}
