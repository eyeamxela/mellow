import React from 'react';

const DEFAULT_ROWS = [
  { size: 'xsmall', length: '63.5', width: '57' },
  { size: 'small', length: '65', width: '59.5' },
  { size: 'medium', length: '66.5', width: '60' },
  { size: 'large', length: '68', width: '64.5' },
  { size: 'xlarge', length: '70', width: '67.5' },
  { size: 'xxlarge', length: '72', width: '70.5' },
];

export function SizeChart({ rows = DEFAULT_ROWS, units = 'cm', style }) {
  const cell = {
    border: 'var(--rule)',
    padding: '3px 10px',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-2xs)',
    color: 'var(--text-body)',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  };
  return (
    <table style={{ borderCollapse: 'collapse', background: 'var(--paper)', ...style }}>
      <thead>
        <tr>
          <th style={{ ...cell, fontWeight: 'var(--weight-regular)' }}></th>
          <th style={{ ...cell, fontWeight: 'var(--weight-regular)' }}>length</th>
          <th style={{ ...cell, fontWeight: 'var(--weight-regular)' }}>width (chest)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.size}>
            <td style={{ ...cell, textAlign: 'left' }}>{r.size}</td>
            <td style={cell}>{r.length} {units}.</td>
            <td style={cell}>{r.width} {units}.</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
