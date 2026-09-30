import React from 'react';
import { Choice } from '../core/Choice.jsx';

const DEFAULTS = {
  availability: ['IN STOCK', 'OUT OF STOCK'],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  categories: ['T-SHIRTS', 'HOODIES', 'CREWS', 'LONG SLEEVES', 'ACCESSORIES'],
  ages: ['NEWEST TO OLDEST', 'OLDEST TO NEWEST'],
};

function Group({ title, children }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-body)', marginBottom: 'var(--space-3)' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-start' }}>{children}</div>
    </div>
  );
}

export function FilterPanel({ value = {}, onChange, options = {}, style }) {
  const opt = { ...DEFAULTS, ...options };
  const v = { availability: 'IN STOCK', sizes: [], category: null, age: 'NEWEST TO OLDEST', ...value };
  const set = (patch) => onChange && onChange({ ...v, ...patch });
  const toggleSize = (s) => set({ sizes: v.sizes.includes(s) ? v.sizes.filter((x) => x !== s) : [...v.sizes, s] });
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 'var(--space-6) var(--space-8)', ...style }}>
      <Group title="Availability">
        {opt.availability.map((a) => <Choice key={a} label={a} selected={v.availability === a} onSelect={() => set({ availability: a })} />)}
      </Group>
      <Group title="Size">
        {opt.sizes.map((s) => <Choice key={s} label={s} selected={v.sizes.includes(s)} onSelect={() => toggleSize(s)} />)}
      </Group>
      <Group title="Category">
        {opt.categories.map((c) => <Choice key={c} label={c} selected={v.category === c} onSelect={() => set({ category: v.category === c ? null : c })} />)}
      </Group>
      <Group title="Age">
        {opt.ages.map((a) => <Choice key={a} label={a} selected={v.age === a} onSelect={() => set({ age: a })} />)}
      </Group>
    </div>
  );
}
