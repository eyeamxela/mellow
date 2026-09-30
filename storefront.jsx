// Mellow storefront home page — Shopify-style landing (hero, quick-add grid, mission,
// magazine, rock games banner, collections, newsletter footer) + working cart drawer.
// Registers window.MellowStorefront. Requires DS + MELLOW_DATA loaded.
(function () {
  const D = window.MELLOW_DATA;
  const CART_KEY = 'mellow-v1-cart';
  const PAGES = { home: 'index.html', shop: 'shop.html', magazine: 'magazine.html', rockgames: 'rockgames.html', youtube: 'youtube.html', about: 'about.html' };
  const mono = (size, extra) => Object.assign({ fontFamily: 'var(--font-mono)', fontSize: size, color: 'var(--text-body)', letterSpacing: 'var(--tracking-caps)' }, extra);
  const loadCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (e) { return []; } };
  const DEFAULT_SIZES = ['S', 'M', 'L', 'XL'];

  function QuickCard({ p, onAdd }) {
    const [hover, setHover] = React.useState(false);
    const [size, setSize] = React.useState(null);
    const sizes = (p.sizes || DEFAULT_SIZES).map((s) => (typeof s === 'string' ? { label: s } : s));
    const src = hover && p.hoverImage ? p.hoverImage : p.image;
    return (
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', flexDirection: 'column' }}>
        <div onClick={() => { window.location.href = 'product.html?id=' + encodeURIComponent(p.id); }} style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}>
          <img src={src} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 12 }}>
          <span style={mono('var(--text-2xs)')}>{p.name}</span>
          <span style={mono('var(--text-2xs)', { color: 'var(--text-muted)', flexShrink: 0 })}>{p.price}</span>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
          {sizes.map((s) => (
            <span key={s.label} onClick={s.soldOut ? undefined : () => setSize(s.label)} style={{
              flex: 1, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              border: size === s.label ? '1px solid var(--ink)' : 'var(--rule)',
              background: size === s.label ? 'var(--surface-inverse)' : 'var(--paper)',
              color: size === s.label ? 'var(--text-inverse)' : s.soldOut ? 'var(--text-muted)' : 'var(--text-body)',
              textDecoration: s.soldOut ? 'line-through' : 'none',
              fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, cursor: s.soldOut ? 'not-allowed' : 'pointer', userSelect: 'none',
            }}>{s.label}</span>
          ))}
        </div>
        <button onClick={() => { const fallback = sizes.find((s) => !s.soldOut); onAdd(p, size || (fallback && fallback.label) || 'M'); }} style={{
          appearance: 'none', marginTop: 8, border: '1px solid var(--ink)', background: 'var(--surface-inverse)', color: 'var(--text-inverse)',
          fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)',
          padding: '8px 0', cursor: 'pointer', textTransform: 'uppercase',
        }}>ADD TO BAG{size ? ' — ' + size : ''}</button>
      </div>
    );
  }

  function CartDrawer({ open, items, onClose, onQty, onRemove }) {
    if (!open) return null;
    const find = (it) => D.products.find((p) => p.id === it.id) || D.magazine.issues.find((m) => m.id === it.id);
    const price = (it) => { const p = find(it); return p && p.price ? parseFloat(p.price.replace('$', '')) : 0; };
    const subtotal = items.reduce((s, it) => s + price(it) * it.qty, 0);
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,20,20,0.35)', zIndex: 40 }}>
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 380, maxWidth: '92vw', background: 'var(--paper)', borderLeft: 'var(--control-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px var(--page-pad)', borderBottom: 'var(--rule)' }}>
            <span style={mono('var(--text-md)', { fontWeight: 700, whiteSpace: 'nowrap' })}>BAG ({items.reduce((s, i) => s + i.qty, 0)})</span>
            <span onClick={onClose} style={mono('var(--text-md)', { cursor: 'pointer' })}>✕</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--page-pad)' }}>
            {items.length === 0 && <div style={mono('var(--text-xs)', { color: 'var(--text-muted)', padding: '32px 0' })}>YOUR BAG IS EMPTY.</div>}
            {items.map((it, i) => {
              const p = find(it);
              if (!p) return null;
              return (
                <div key={it.id + it.size} style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 12, padding: '14px 0', borderBottom: 'var(--rule)', alignItems: 'center' }}>
                  <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={mono('var(--text-2xs)', { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })}>{p.name}</div>
                    <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', marginTop: 3 })}>{it.size ? 'SIZE ' + it.size + ' · ' : ''}{p.price}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 7 }}>
                      <span onClick={() => onQty(i, -1)} style={mono('var(--text-xs)', { border: 'var(--rule)', width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' })}>−</span>
                      <span style={mono('var(--text-xs)', { borderTop: 'var(--rule)', borderBottom: 'var(--rule)', width: 26, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' })}>{it.qty}</span>
                      <span onClick={() => onQty(i, 1)} style={mono('var(--text-xs)', { border: 'var(--rule)', width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' })}>+</span>
                    </div>
                  </div>
                  <span onClick={() => onRemove(i)} style={mono('var(--text-2xs)', { color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' })}>REMOVE</span>
                </div>
              );
            })}
          </div>
          <div style={{ borderTop: 'var(--control-border)', padding: '14px var(--page-pad) 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={mono('var(--text-xs)')}>SUBTOTAL</span>
              <span style={mono('var(--text-xs)', { fontWeight: 700 })}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', marginBottom: 12 })}>SHIPPING CALCULATED AT CHECKOUT</div>
            <button disabled={!items.length} style={{ appearance: 'none', width: '100%', border: '1px solid var(--ink)', background: items.length ? 'var(--surface-inverse)' : 'var(--paper)', color: items.length ? 'var(--text-inverse)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-caps)', padding: '11px 0', cursor: items.length ? 'pointer' : 'not-allowed' }}>CHECKOUT</button>
          </div>
        </div>
      </div>
    );
  }

  function Section({ kicker, children, style }) {
    return (
      <div style={Object.assign({ padding: '56px var(--page-pad) 0', maxWidth: 1240, margin: '0 auto', boxSizing: 'border-box' }, style)}>
        {kicker && <div style={mono('var(--text-md)', { fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'baseline', gap: 14 })}>{kicker}</div>}
        {children}
      </div>
    );
  }
  const seeAll = (label, href) => (
    <a href={href} style={mono('var(--text-2xs)', { color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer' })}>{label}</a>
  );

  window.MellowStorefront = function MellowStorefront() {
    const DS = window.__MELLOW_DS;
    const [cart, setCart] = React.useState(loadCart);
    const [drawer, setDrawer] = React.useState(false);
    const [toast, setToast] = React.useState(null);
    const save = (c) => { setCart(c); try { localStorage.setItem(CART_KEY, JSON.stringify(c)); localStorage.setItem('mellow-v1-bag', String(c.reduce((s, i) => s + i.qty, 0))); } catch (e) {} };
    const add = (p, size) => {
      const c = [...cart];
      const hit = c.find((i) => i.id === p.id && i.size === size);
      if (hit) hit.qty += 1; else c.push({ id: p.id, size, qty: 1 });
      save(c); setDrawer(true);
      setToast(p.name); setTimeout(() => setToast(null), 1800);
    };
    const qty = (i, d) => { const c = [...cart]; c[i].qty = Math.max(1, c[i].qty + d); save(c); };
    const remove = (i) => { const c = [...cart]; c.splice(i, 1); save(c); };
    const nav = (id) => { if (id !== 'home' && PAGES[id]) window.location.href = PAGES[id]; };
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const best = D.products.slice(0, 8);
    const ticker = 'GARMENT DYED · MADE IN USA · SMALL DROPS, NO RESTOCKS · FREE US SHIPPING OVER $100 · ';

    return (
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
        <DS.NavBar activeId="home" onNavigate={nav} cartCount={count} onBag={() => setDrawer(true)}
          logoSrc="/assets/logo-mellow.png" bagIconSrc="/assets/icon-bag.png" />
        {/* ticker */}
        <div style={{ borderBottom: 'var(--rule)', overflow: 'hidden', padding: '5px 0', whiteSpace: 'nowrap' }}>
          <div className="mellow-marquee" style={mono('var(--text-2xs)', { display: 'inline-block' })}>{ticker + ticker + ticker}</div>
        </div>
        {/* hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', borderBottom: 'var(--rule)' }}>
          <div style={{ padding: '64px var(--page-pad)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
            <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)' })}>DROP 04 — AVAILABLE NOW</div>
            <div style={mono(44, { fontWeight: 700, lineHeight: 1.15, letterSpacing: '0.02em' })}>COLOR BLIND<br />TEES</div>
            <div style={mono('var(--text-sm)', { lineHeight: 'var(--leading-body)', letterSpacing: '0.02em', maxWidth: 380, textTransform: 'none' })}>Custom garment dyed with screen-printed back and sewn Mellow neck label. 6.5oz jersey, 100% cotton, made in USA.</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="shop.html" style={{ textDecoration: 'none' }}><DS.Button label="SHOP THE DROP" /></a>
              <a href="about.html" style={{ textDecoration: 'none' }}><DS.Button label="ABOUT MELLOW" variant="text" /></a>
            </div>
          </div>
          <div style={{ background: 'var(--border-rule)' }}></div>
          <div style={{ minHeight: 460, overflow: 'hidden' }}>
            <img src="/assets/products/hero-colorblind-tees.png" alt="color blind tees drop" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left top', display: 'block' }} />
          </div>
        </div>
        {/* best sellers */}
        <Section kicker={<React.Fragment><span>BEST SELLERS</span>{seeAll('SHOP ALL →', 'shop.html')}</React.Fragment>}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px 24px' }}>
            {best.map((p) => <QuickCard key={p.id} p={p} onAdd={add} />)}
          </div>
        </Section>
        {/* mission */}
        <Section>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: 'var(--rule)' }}>
            <div style={{ minHeight: 340, overflow: 'hidden', borderRight: 'var(--rule)' }}>
              <img src="/assets/imagery/streetview-forest.png" alt="on location" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
              <div style={mono('var(--text-xl)', { fontWeight: 700 })}>KEEP THINGS REAL /</div>
              <div style={mono('var(--text-sm)', { lineHeight: 'var(--leading-body)', letterSpacing: '0.02em', textTransform: 'none', maxWidth: 420 })}>Mellow is a climbing apparel and media brand: garment-dyed, made-in-USA blanks, a hardcover print magazine, a YouTube channel, and the Mellow Rock Games — a community-judged video climbing competition.</div>
              <a href="about.html" style={{ textDecoration: 'none' }}><DS.Button label="LEARN MORE" variant="text" style={{ paddingLeft: 0 }} /></a>
            </div>
          </div>
        </Section>
        {/* magazine */}
        <Section kicker={<React.Fragment><span>MELLOW MAGAZINE</span>{seeAll('VIEW ALL ISSUES →', 'magazine.html')}</React.Fragment>}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, alignItems: 'stretch' }}>
            {D.magazine.issues.slice(0, 2).map((m) => (
              <div key={m.id} onClick={() => { window.location.href = 'issue.html?id=' + encodeURIComponent(m.id); }} style={{ cursor: 'pointer' }}>
                <div style={{ height: 300, overflow: 'hidden' }}>
                  <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={mono('var(--text-2xs)', { marginTop: 10 })}>{m.name}</div>
                <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', marginTop: 3 })}>{m.meta}</div>
              </div>
            ))}
            <div style={{ border: 'var(--control-border)', padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
              <div style={mono('var(--text-md)', { fontWeight: 700 })}>ANNUAL SUBSCRIPTION</div>
              <div style={mono('var(--text-sm)', { lineHeight: 'var(--leading-body)', textTransform: 'none', letterSpacing: '0.02em' })}>Two hardcover volumes per year plus one limited-edition made-in-USA subscriber tee.</div>
              <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', whiteSpace: 'pre-line', lineHeight: 1.9 })}>{'$90 — TWO VOLUMES + TEE\n$80 — TWO VOLUMES'}</div>
              <a href="magazine.html" style={{ textDecoration: 'none' }}><DS.Button label="SUBSCRIBE" /></a>
            </div>
          </div>
        </Section>
        {/* rock games banner */}
        <Section>
          <a href="rockgames.html" style={{ textDecoration: 'none' }}>
            <div style={{ border: 'var(--control-border)', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center', padding: '26px 32px', cursor: 'pointer', background: 'var(--paper)' }}>
              <img src="/assets/live/mrg-hero.png" alt="mellow rock games" style={{ height: 74, display: 'block' }} />
              <div>
                <div style={mono('var(--text-md)', { fontWeight: 700 })}>MELLOW ROCK GAMES — ROUND 1 OPEN</div>
                <div style={mono('var(--text-sm)', { color: 'var(--text-muted)', textTransform: 'none', letterSpacing: '0.02em', marginTop: 6 })}>Submit your tape. Community-judged video climbing competition — $20K total prize purse.</div>
              </div>
              <span style={mono('var(--text-xl)', { fontWeight: 700 })}>$20K →</span>
            </div>
          </a>
        </Section>
        {/* collections */}
        <Section kicker={<span>COLLECTIONS</span>} style={{ paddingBottom: 72 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
            {[['T-SHIRTS', '/assets/products/tile-tee-black-flame.png'], ['CREWS', '/assets/products/tile-mcd-teal.png'], ['LONG SLEEVES', '/assets/products/tile-ls-blue.png']].map(([label, img]) => (
              <a key={label} href="shop.html" style={{ textDecoration: 'none' }}>
                <div style={{ border: 'var(--rule)', padding: 18, cursor: 'pointer' }}>
                  <div style={{ height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={img} alt={label} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
                    <span style={mono('var(--text-xs)', { fontWeight: 700 })}>{label}</span>
                    <span style={mono('var(--text-xs)')}>→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Section>
        {/* footer */}
        <div style={{ borderTop: 'var(--control-border)', marginTop: 'auto' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '48px var(--page-pad) 40px', display: 'grid', gridTemplateColumns: '3fr 2fr 2fr 3fr', gap: 32, boxSizing: 'border-box' }}>
            <div>
              <img src="/assets/logo-mellow.png" alt="mellow" style={{ height: 40, display: 'block' }} />
              <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', marginTop: 14 })}>© {new Date().getFullYear()} MELLOW — MADE IN USA</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={mono('var(--text-2xs)', { fontWeight: 700, marginBottom: 4 })}>SHOP</span>
              {[['ALL PRODUCTS', 'shop.html'], ['MAGAZINE', 'magazine.html'], ['ROCK GAMES', 'rockgames.html'], ['ABOUT', 'about.html']].map(([t, h]) => (
                <a key={t} href={h} style={mono('var(--text-2xs)', { textDecoration: 'none', cursor: 'pointer' })}>{t}</a>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={mono('var(--text-2xs)', { fontWeight: 700, marginBottom: 4 })}>HELP</span>
              {['RETURNS & REFUND POLICY', 'PRIVACY POLICY', 'TERMS OF SERVICE'].map((t) => (
                <span key={t} style={mono('var(--text-2xs)', { cursor: 'pointer' })}>{t}</span>
              ))}
            </div>
            <div>
              <span style={mono('var(--text-2xs)', { fontWeight: 700, display: 'block', marginBottom: 10 })}>NEWSLETTER</span>
              <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', marginBottom: 10, textTransform: 'none', letterSpacing: '0.02em' })}>First to hear about new drops. No spam.</div>
              <DS.EmailSignup width="100%" />
            </div>
          </div>
        </div>
        <CartDrawer open={drawer} items={cart} onClose={() => setDrawer(false)} onQty={qty} onRemove={remove} />
        {toast && (
          <div style={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: 'var(--surface-inverse)', color: 'var(--text-inverse)', padding: '8px 16px', zIndex: 60, ...mono('var(--text-2xs)') }}>ADDED — {toast}</div>
        )}
      </div>
    );
  };
})();
