import React from 'react';
import { InvertLabel } from '../core/InvertLabel.jsx';
import { BagIndicator } from '../commerce/BagIndicator.jsx';

function NavLink({ label, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  if (active) return <InvertLabel size="md" onClick={onClick}>{label}</InvertLabel>;
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase', color: 'var(--text-body)', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
        textDecoration: hover ? 'underline' : 'none', padding: '1px 0 2px',
      }}
    >{label}</span>
  );
}

export function NavBar({
  items = [{ id: 'shop', label: 'SHOP' }, { id: 'youtube', label: 'YOUTUBE' }, { id: 'magazine', label: 'MAGAZINE' }, { id: 'rockgames', label: 'ROCK GAMES' }, { id: 'about', label: 'ABOUT' }],
  activeId,
  onNavigate,
  logoSrc,
  homeId = 'home',
  cartCount = 0,
  bagIconSrc,
  onAccount,
  onBag,
  style,
}) {
  const go = (id) => onNavigate && onNavigate(id);
  const [acctHover, setAcctHover] = React.useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-6)',
      height: 'var(--nav-h)', padding: '0 var(--page-pad)', boxSizing: 'border-box',
      background: 'var(--surface-page)', borderBottom: 'var(--rule)', ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {logoSrc
          ? <img src={logoSrc} alt="mellow" onClick={() => go(homeId)} style={{ height: 38, display: 'block', cursor: 'pointer' }} />
          : <span onClick={() => go(homeId)} style={{ fontFamily: 'var(--font-blackletter)', fontSize: 'var(--logo-size-nav)', lineHeight: 1, color: 'var(--text-body)', cursor: 'pointer', userSelect: 'none' }}>mellow</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-6)', minWidth: 0, flexWrap: 'wrap' }}>
        {items.map((it) => <NavLink key={it.id} label={it.label} active={activeId === it.id} onClick={() => go(it.id)} />)}
        <span
          onClick={onAccount}
          onMouseEnter={() => setAcctHover(true)}
          onMouseLeave={() => setAcctHover(false)}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', letterSpacing: 'var(--tracking-caps)', color: 'var(--text-body)', cursor: 'pointer', userSelect: 'none', textDecoration: acctHover ? 'underline' : 'none' }}
        >ACCOUNT</span>
        <span onClick={onBag} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', letterSpacing: 'var(--tracking-caps)', color: 'var(--text-body)', cursor: onBag ? 'pointer' : 'default', userSelect: 'none' }}>
          BAG <BagIndicator count={cartCount} iconSrc={bagIconSrc} size={22} />
        </span>
      </div>
    </div>
  );
}
