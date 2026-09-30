// Shared multi-page app shell for concepts V1–V4. Each page sets window.KIT_CONFIG
// ({page, logoSrc, bagIconSrc, viewOptions, defaultView, shopH, magH, broadsheetHero,
//   filterBarBorder, zoomBg, bagKey}) before loading this; nav navigates between real files.
const K = window.MellowKit;
const D = window.MELLOW_DATA;
const CFG = window.KIT_CONFIG || {};
const NAV_ITEMS = (window.KIT_CONFIG && window.KIT_CONFIG.brief)
  ? [{ id: 'shop', label: 'SHOP' }, { id: 'youtube', label: 'YOUTUBE' }, { id: 'magazine', label: 'MAGAZINE' }, { id: 'rockgames', label: 'ROCK GAMES' }]
  : undefined;
function BriefRedirect({ to, raw }) { React.useEffect(() => { window.location.replace(raw ? to : PAGES[to]); }, []); return null; }
function CoordStrip({ coords }) {
  return (
    <div style={{ borderBottom: 'var(--rule)', padding: '4px var(--page-pad)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-wide)', color: 'var(--gray-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', flexShrink: 0 }}>
      LOG {new Date().toISOString().slice(0, 10)} · {coords} · MELLOW FIELDBOOK
    </div>
  );
}
function VersionBar() {
  const V = window.MELLOW_VERSION; if (!V) return null;
  const chip = (on, label, onClick) => (
    <span key={label} onClick={onClick} style={{ cursor: 'pointer', padding: '1px 6px', background: on ? 'var(--ink)' : 'transparent', color: on ? 'var(--paper)' : 'var(--ink)', whiteSpace: 'nowrap' }}>{label}</span>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px var(--page-pad)', borderTop: 'var(--rule)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--ink)', background: 'var(--paper)', flexShrink: 0, flexWrap: 'wrap' }}>
      <span style={{ color: 'var(--gray-muted)' }}>VERSION</span>
      <span style={{ display: 'flex', gap: 2, border: 'var(--rule)' }}>{Object.keys(V.LAYOUTS).map((k) => chip(V.layout === k, V.LAYOUTS[k], () => window.setMellowVersion({ layout: k })))}</span>
      <span style={{ color: 'var(--gray-muted)' }}>THEME</span>
      <span style={{ display: 'flex', gap: 2, border: 'var(--rule)', flexWrap: 'wrap' }}>{Object.keys(V.THEMES).map((k) => chip(V.theme === k, V.THEMES[k].name, () => window.setMellowVersion({ theme: k })))}</span>
      <span style={{ marginLeft: 'auto', color: 'var(--gray-muted)' }}>{V.layout === 'brief' ? 'CLIENT BRIEF — SPLIT PANEL SPEC' : 'EXTENDED — FULL-PAGE PROPOSALS'}</span>
    </div>
  );
}
const PAGES = { home: 'index.html', shop: 'shop.html', magazine: 'magazine.html', rockgames: 'rockgames.html', youtube: 'youtube.html', about: 'about.html' };

function LandingRightBroadsheet() {
  return (
    <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
      <img src={D.streetview} alt="street view" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-blackletter)', fontSize: 150, lineHeight: 1, color: 'var(--paper)', pointerEvents: 'none', textShadow: '0 0 40px rgba(0,0,0,0.35)' }}>mellow</span>
      <span style={{ position: 'absolute', bottom: 10, right: 12, fontFamily: 'var(--font-utility)', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', background: 'var(--paper)', color: 'var(--text-body)', padding: '2px 6px' }}>GOOGLE STREET VIEW EMBED — STATIC IN THIS KIT</span>
    </div>
  );
}

function App() {
  const DS = window.__MELLOW_DS;
  const page = CFG.page || 'home';
  const opts = CFG.viewOptions || ['3', '6', 'ALL'];
  const base = opts[0];
  const openId = new URLSearchParams(window.location.search).get('open');
  const openProd = openId && page === 'shop' ? D.products.find((x) => x.id === openId) : null;
  const openIss = openId && page === 'magazine' ? D.magazine.issues.find((x) => x.id === openId) : null;
  const [leftMode, setLeftMode] = React.useState(openProd ? 'product' : 'hero');
  const [product, setProduct] = React.useState(openProd || null);
  const [magMode, setMagMode] = React.useState(openIss ? 'issue' : 'intro');
  const [issue, setIssue] = React.useState(openIss || null);
  const [filters, setFilters] = React.useState({ availability: 'IN STOCK', sizes: [], category: null, age: 'NEWEST TO OLDEST' });
  const [view, setView] = React.useState(CFG.defaultView || base);
  const cart = window.MellowCart.useCart(CFG.bagKey);
  const bag = cart.count;
  const setBag = () => {};
  const addToBag = (p, size) => cart.add(p, size);
  const [zoom, setZoom] = React.useState(null);
  const [coords] = React.useState(() => D.destinations[Math.floor(Math.random() * D.destinations.length)]);

  const nav = (id) => { if (id !== page && PAGES[id]) window.location.href = PAGES[id]; };
  const openProduct = (p) => { if (CFG.brief) { setProduct(p); setLeftMode('product'); } else window.location.href = 'product.html?id=' + encodeURIComponent(p.id); };
  const openIssue = (i) => { if (CFG.brief) { setIssue(i); setMagMode('issue'); } else window.location.href = 'issue.html?id=' + encodeURIComponent(i.id); };
  const toggleFilter = () => setLeftMode(leftMode === 'filter' ? (product ? 'product' : 'hero') : 'filter');

  let products = D.products;
  if (filters.category) products = products.filter((p) => p.category === filters.category);
  if (filters.age === 'OLDEST TO NEWEST') products = [...products].reverse();
  const gridItems = view === base ? products : [...products, ...products];
  const magItems = D.magazine.issues.map((i) => ({ ...i, price: undefined }));
  const shopH = CFG.shopH ? (view === opts[0] ? CFG.shopH[0] : view === opts[1] ? CFG.shopH[1] : CFG.shopH[2]) : undefined;
  const magH = CFG.magH ? (view === base ? CFG.magH[0] : CFG.magH[1]) : (view === base ? 320 : 160);

  let left = null, right = null, showFilterBar = false;
  if (page === 'home' || page === 'youtube') {
    left = page === 'home'
      ? <K.LandingLeft coords={coords} />
      : <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', letterSpacing: 'var(--tracking-caps)', color: 'var(--text-body)', textDecoration: 'underline' }}>YOUTUBE OPENS EXTERNALLY →</span>
        </div>;
    right = CFG.broadsheetHero ? <LandingRightBroadsheet /> : <K.LandingRight />;
  } else if (page === 'shop') {
    showFilterBar = true;
    left = leftMode === 'product' && product
      ? <K.ProductDetailLeft product={product} onAdd={addToBag} />
      : leftMode === 'filter'
        ? <K.FilterLeft filters={filters} setFilters={setFilters} />
        : <K.ShopHeroLeft />;
    right = <K.ProductGridRight items={gridItems} view={view} imageHeight={shopH} onSelect={openProduct} />;
  } else if (page === 'magazine') {
    showFilterBar = true;
    left = magMode === 'issue' && issue ? <K.IssueLeft issue={issue} /> : <K.MagazineLeft />;
    right = magMode === 'issue' && issue
      ? <K.IssueRight issue={issue} onZoom={setZoom} />
      : <K.ProductGridRight items={magItems} view={view} imageHeight={magH} onSelect={openIssue} />;
  } else if (page === 'rockgames') {
    left = <K.RockGamesLeft />;
    right = <K.RockGamesRight />;
  }

  if (!DS) return null;
  if (CFG.brief && (page === 'product' || page === 'issue' || page === 'about')) {
    const id = new URLSearchParams(window.location.search).get('id');
    if (page === 'product') return <BriefRedirect to={'shop.html?open=' + encodeURIComponent(id || '')} raw />;
    if (page === 'issue') return <BriefRedirect to={'magazine.html?open=' + encodeURIComponent(id || '')} raw />;
    return <BriefRedirect to="home" />;
  }
  if (page === 'home' && CFG.lookbookHome) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--gray-soft)' }}>
        <DS.NavBar items={NAV_ITEMS} activeId="home" onNavigate={nav} cartCount={bag} onBag={() => cart.setOpen(true)} logoSrc={CFG.logoSrc} bagIconSrc={CFG.bagIconSrc} />
        <window.MellowCart.Drawer cart={cart} />
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <K.AboutPage onBack={() => nav('shop')} backLabel={null} onAdd={addToBag} />
          <DS.FooterBar signupWidth={260} />
        </div>
      </div>
    );
  }
  if (page === 'rockgames' && !CFG.brief) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
        <DS.NavBar items={NAV_ITEMS} activeId="rockgames" onNavigate={nav} cartCount={bag} onBag={() => cart.setOpen(true)} logoSrc={CFG.logoSrc} bagIconSrc={CFG.bagIconSrc} />
        <window.MellowCart.Drawer cart={cart} />
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <K.RockGamesPage console={window.RockGamesConsole} />
          <DS.FooterBar signupWidth={260} />
        </div>
      </div>
    );
  }
  if (page === 'issue') {
    const id = new URLSearchParams(window.location.search).get('id');
    const iss = D.magazine.issues.find((x) => x.id === id) || D.magazine.issues[0];
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--gray-soft)' }}>
        <DS.NavBar items={NAV_ITEMS} activeId="magazine" onNavigate={nav} cartCount={bag} onBag={() => cart.setOpen(true)} logoSrc={CFG.logoSrc} bagIconSrc={CFG.bagIconSrc} />
        <window.MellowCart.Drawer cart={cart} />
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <K.IssuePage issue={iss} onNav={nav} onAdd={addToBag} />
        </div>
      </div>
    );
  }
  if (page === 'about') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
        <DS.NavBar items={NAV_ITEMS} activeId="about" onNavigate={nav} cartCount={bag} onBag={() => cart.setOpen(true)} logoSrc={CFG.logoSrc} bagIconSrc={CFG.bagIconSrc} />
        <window.MellowCart.Drawer cart={cart} />
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <K.AboutStory onNav={nav} />
          <DS.FooterBar signupWidth={260} />
        </div>
      </div>
    );
  }
  if (page === 'product') {
    const id = new URLSearchParams(window.location.search).get('id');
    const prod = D.products.find((x) => x.id === id) || D.products[0];
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
        <DS.NavBar items={NAV_ITEMS} activeId="shop" onNavigate={nav} cartCount={bag} onBag={() => cart.setOpen(true)} logoSrc={CFG.logoSrc} bagIconSrc={CFG.bagIconSrc} />
        <window.MellowCart.Drawer cart={cart} />
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <K.ProductFullPage product={prod} onAdd={addToBag} onBack={() => nav('shop')} />
          <DS.FooterBar signupWidth={260} />
        </div>
      </div>
    );
  }
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      <DS.NavBar items={NAV_ITEMS} activeId={page} onNavigate={nav} cartCount={bag} onBag={() => cart.setOpen(true)} logoSrc={CFG.logoSrc} bagIconSrc={CFG.bagIconSrc} />
        <window.MellowCart.Drawer cart={cart} />
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'var(--split-left) 1px 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {left}
          <DS.FooterBar signupWidth={260} style={{ flexShrink: 0 }} />
        </div>
        <div style={{ background: 'var(--border-rule)' }}></div>
        <div style={{ minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {showFilterBar && (
            <DS.FilterBar filterOpen={leftMode === 'filter'} onFilterToggle={toggleFilter} view={view} viewOptions={opts} onViewChange={setView}
              style={Object.assign({ padding: 'var(--space-3) var(--page-pad)', position: 'sticky', top: 0, background: 'var(--paper)', zIndex: 2 }, CFG.filterBarBorder ? { borderBottom: 'var(--rule)' } : null)} />
          )}
          {!showFilterBar && page === 'rockgames' && <div style={{ height: 'var(--space-3)' }}></div>}
          {right}
        </div>
      </div>
      {zoom && (
        <div onClick={() => setZoom(null)} style={{ position: 'fixed', inset: 0, background: CFG.zoomBg || 'rgba(20,20,20,0.94)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', zIndex: 10 }}>
          <img src={zoom} alt="" style={{ maxWidth: '92%', maxHeight: '92%', objectFit: 'contain' }} />
        </div>
      )}
    </div>
  );
}
function Root() {
  const [coords] = React.useState(() => D.destinations[Math.floor(Math.random() * D.destinations.length)]);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {CFG.coordStrip && <CoordStrip coords={coords} />}
      <div style={{ flex: 1, minHeight: 0 }}><App /></div>
      <VersionBar />
    </div>
  );
}
window.loadMellowDS('').then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
});
