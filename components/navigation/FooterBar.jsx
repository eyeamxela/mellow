import React from 'react';
import { EmailSignup } from '../core/EmailSignup.jsx';

const DEFAULT_LINKS = ['RETURNS & REFUND POLICY', 'PRIVACY POLICY', 'TERMS OF SERVICE'];

function FooterLink({ label, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', color: 'var(--text-body)', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', textDecoration: hover ? 'underline' : 'none' }}
    >{label}</span>
  );
}

export function FooterBar({ heading = 'POLICIES', links = DEFAULT_LINKS, onLink, onSubscribe, signupWidth = 320, style }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-5)', flexWrap: 'wrap',
      padding: 'var(--space-4) var(--page-pad)', borderTop: 'var(--rule)', background: 'var(--surface-page)',
      boxSizing: 'border-box', ...style,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', alignItems: 'flex-start' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', letterSpacing: 'var(--tracking-caps)', color: 'var(--text-body)', marginBottom: 'var(--space-1)' }}>{heading}</span>
        {links.map((l) => <FooterLink key={l} label={l} onClick={onLink ? () => onLink(l) : undefined} />)}
      </div>
      <EmailSignup width={signupWidth} onSubscribe={onSubscribe} />
    </div>
  );
}
