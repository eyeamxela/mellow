// Shared pop-out bag drawer for the Mellow site. Registers window.MellowCart = { Drawer, useCart }.
// Cart persists in localStorage under a per-concept key; mirrors the item count into the concept's bagKey.
(function () {
  const D = window.MELLOW_DATA;
  const mono = (size, extra) => Object.assign({ fontFamily: 'var(--font-mono)', fontSize: size, color: 'var(--text-body)', letterSpacing: 'var(--tracking-caps)' }, extra);
  const find = (id) => D.products.find((p) => p.id === id) || D.magazine.issues.find((m) => m.id === id);
  const priceOf = (id) => { const p = find(id); return p && p.price ? parseFloat(String(p.price).replace('$', '')) : (p ? 90 : 0); };
  const FREE_SHIP = 100;

  function useCart(bagKey) {
    const key = (bagKey || 'mellow-bag') + '-cart';
    const [items, setItems] = React.useState(() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; } });
    const [open, setOpen] = React.useState(false);
    const save = (c) => { setItems(c); try { localStorage.setItem(key, JSON.stringify(c)); if (bagKey) localStorage.setItem(bagKey, String(c.reduce((s, i) => s + i.qty, 0))); } catch (e) {} };
    const add = (p, size) => { const c = items.map((i) => ({ ...i })); const hit = c.find((i) => i.id === p.id && i.size === size); if (hit) hit.qty += 1; else c.push({ id: p.id, size: size || null, qty: 1 }); save(c); setOpen(true); };
    const qty = (i, d) => { const c = items.map((x) => ({ ...x })); c[i].qty = Math.max(1, c[i].qty + d); save(c); };
    const remove = (i) => { const c = items.slice(); c.splice(i, 1); save(c); };
    const count = items.reduce((s, i) => s + i.qty, 0);
    return { items, open, setOpen, add, qty, remove, count };
  }

  function Row({ it, i, cart }) {
    const p = find(it.id);
    if (!p) return null;
    const [hover, setHover] = React.useState(false);
    const box = (label, fn) => (
      <span onClick={fn} style={mono('var(--text-xs)', { border: 'var(--control-border)', width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', userSelect: 'none', marginLeft: -1 })}>{label}</span>
    );
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr', gap: 16, padding: '18px 0', borderBottom: 'var(--rule)' }}>
        <div onClick={() => { window.location.href = (p.spreads || p.details ? 'issue.html' : 'product.html') + '?id=' + encodeURIComponent(p.id); }} style={{ height: 104, background: 'var(--gray-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}>
          <img src={p.image} alt={p.name} style={{ maxWidth: '86%', maxHeight: '86%', objectFit: 'contain', display: 'block' }} />
        </div>
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <span style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', lineHeight: 1.5 })}>{p.name}</span>
            <span style={mono('var(--text-2xs)', { flexShrink: 0 })}>${(priceOf(it.id) * it.qty).toFixed(2)}</span>
          </div>
          <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', letterSpacing: '0.08em' })}>{it.size ? 'SIZE ' + it.size + '  \u00b7  ' : ''}{p.price || '$90.00'} EACH</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <span style={{ display: 'inline-flex' }}>
              {box('\u2212', () => cart.qty(i, -1))}
              <span style={mono('var(--text-xs)', { border: 'var(--control-border)', minWidth: 30, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: -1 })}>{it.qty}</span>
              {box('+', () => cart.qty(i, 1))}
            </span>
            <span onClick={() => cart.remove(i)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={mono('var(--text-2xs)', { color: hover ? 'var(--text-body)' : 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.08em' })}>REMOVE</span>
          </div>
        </div>
      </div>
    );
  }

  function Drawer({ cart, onContinue }) {
    const DS = window.__MELLOW_DS;
    const { items, open, setOpen, count } = cart;
    React.useEffect(() => {
      if (!open) return;
      const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [open]);
    if (!open) return null;
    const subtotal = items.reduce((s, it) => s + priceOf(it.id) * it.qty, 0);
    const toFree = Math.max(0, FREE_SHIP - subtotal);
    const pct = Math.min(100, Math.round((subtotal / FREE_SHIP) * 100));
    const suggestions = D.products.filter((p) => !items.some((i) => i.id === p.id)).slice(0, 3);
    return (
      <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(20,20,20,0.4)', zIndex: 40 }}>
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '94vw', background: 'var(--paper)', borderLeft: 'var(--control-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 'var(--nav-h)', padding: '0 var(--page-pad)', borderBottom: 'var(--control-border)', flexShrink: 0 }}>
            <span style={mono('var(--text-md)', { fontWeight: 'var(--weight-bold)', whiteSpace: 'nowrap' })}>BAG&nbsp;<span style={{ background: 'var(--surface-inverse)', color: 'var(--text-inverse)', padding: '0 6px' }}>{count}</span></span>
            <span onClick={() => setOpen(false)} style={mono('var(--text-md)', { cursor: 'pointer', userSelect: 'none' })}>CLOSE ✕</span>
          </div>
          <div style={{ padding: '12px var(--page-pad)', borderBottom: 'var(--rule)', flexShrink: 0 }}>
            <div style={mono('var(--text-2xs)', { letterSpacing: '0.08em', marginBottom: 8 })}>{toFree > 0 ? 'ADD $' + toFree.toFixed(2) + ' FOR FREE US SHIPPING' : 'FREE US SHIPPING UNLOCKED'}</div>
            <div style={{ height: 4, border: 'var(--control-border)' }}><div style={{ width: pct + '%', height: '100%', background: 'var(--surface-inverse)' }}></div></div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 var(--page-pad)' }}>
            {items.length === 0 ? (
              <div style={{ padding: '56px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
                <div style={mono('var(--text-sm)', { fontWeight: 'var(--weight-bold)' })}>YOUR BAG IS EMPTY.</div>
                <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', lineHeight: 1.8, letterSpacing: '0.08em' })}>SMALL DROPS, NO RESTOCK PROMISES — WHEN SOMETHING SELLS OUT, IT IS USUALLY GONE.</div>
                <DS.Button label="SHOP THE DROP" onClick={() => { window.location.href = 'shop.html'; }} />
              </div>
            ) : items.map((it, i) => <Row key={it.id + '-' + it.size} it={it} i={i} cart={cart} />)}
            {suggestions.length > 0 && (
              <div style={{ padding: '22px 0 24px' }}>
                <div style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', marginBottom: 12 })}>YOU MIGHT ALSO WANT</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                  {suggestions.map((p) => (
                    <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                      <div onClick={() => { window.location.href = 'product.html?id=' + encodeURIComponent(p.id); }} style={{ height: 96, background: 'var(--gray-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}>
                        <img src={p.image} alt={p.name} style={{ maxWidth: '84%', maxHeight: '84%', objectFit: 'contain' }} />
                      </div>
                      <div style={mono(9, { letterSpacing: '0.06em', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })}>{p.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={mono(9, { color: 'var(--text-muted)' })}>{p.price}</span>
                        <span onClick={() => cart.add(p, (p.sizes || ['M']).map((s) => (typeof s === 'string' ? { label: s } : s)).find((s) => !s.soldOut).label)} style={mono(9, { fontWeight: 'var(--weight-bold)', cursor: 'pointer', textDecoration: 'underline' })}>+ ADD</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ borderTop: 'var(--control-border)', padding: '16px var(--page-pad) 20px', flexShrink: 0, background: 'var(--paper)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={mono('var(--text-xs)')}>SUBTOTAL</span>
              <span style={mono('var(--text-xs)', { fontWeight: 'var(--weight-bold)' })}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 14 })}>SHIPPING & TAXES CALCULATED AT CHECKOUT</div>
            <button disabled={!items.length} style={{ appearance: 'none', width: '100%', border: '1px solid var(--ink)', background: items.length ? 'var(--surface-inverse)' : 'var(--paper)', color: items.length ? 'var(--text-inverse)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-caps)', padding: '12px 0', cursor: items.length ? 'pointer' : 'not-allowed' }}>CHECKOUT →</button>
            <div onClick={() => { setOpen(false); onContinue && onContinue(); }} style={mono('var(--text-2xs)', { textAlign: 'center', marginTop: 12, cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.1em' })}>CONTINUE SHOPPING</div>
          </div>
        </div>
      </div>
    );
  }

  window.MellowCart = { Drawer, useCart, priceOf };
})();
