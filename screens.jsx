// Screen components for the Mellow split site. Requires window.__MELLOW_DS (resolved in index.html)
// and window.MELLOW_DATA. Registers window.MellowKit.
(function () {
  try {
  const K = (window.MellowKit = window.MellowKit || {});
  const D = window.MELLOW_DATA;
  const mono = (size, extra) => Object.assign({
    fontFamily: 'var(--font-mono)', fontSize: size, color: 'var(--text-body)',
    letterSpacing: 'var(--tracking-caps)',
  }, extra);

  // Editable image block: drag a new image onto it (or click) to replace; the drop persists per slot id.
  const Pic = ({ id, src, h, fit, pos, alt, style, onClick }) => (
    <div onClick={onClick} style={Object.assign({ position: 'relative', width: '100%', height: h || '100%', overflow: 'hidden', cursor: onClick ? 'zoom-in' : undefined }, style)}>
      <image-slot id={'pic-' + id} src={src} shape="rect" fit={fit || 'cover'} placeholder={alt ? alt.toUpperCase() : 'DROP IMAGE'} style={{ width: '100%', height: '100%', display: 'block' }}></image-slot>
    </div>
  );
  K.Pic = Pic;

  // ---------- LANDING ----------
  K.LandingLeft = function ({ coords }) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)' }}>
        <span style={{ fontFamily: 'var(--font-utility)', fontSize: 'var(--text-lg)', color: 'var(--text-body)', letterSpacing: '0.01em' }}>{coords}</span>
      </div>
    );
  };
  K.LandingRight = function () {
    return (
      <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
        <Pic id="landing-streetview" src={D.streetview} alt="street view" />
        <span style={mono('var(--text-2xs)', { position: 'absolute', bottom: 8, right: 10, background: 'var(--paper)', padding: '2px 6px' })}>GOOGLE STREET VIEW EMBED — STATIC IN THIS KIT</span>
      </div>
    );
  };

  // ---------- SHOP ----------
  K.ShopHeroLeft = function () {
    return (
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Pic id="shop-hero" src={D.heroImage} alt="drop hero" />
      </div>
    );
  };

  K.ProductDetailLeft = function ({ product, onAdd }) {
    const DS = window.__MELLOW_DS;
    const [size, setSize] = React.useState(null);
    const [mainImg, setMainImg] = React.useState(product.detailImage || product.image);
    React.useEffect(() => { setMainImg(product.detailImage || product.image); setSize(null); }, [product.id]);
    return (
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '54% 1fr', gap: 'var(--space-4)', padding: 'var(--space-4)', overflowY: 'auto', overflowX: 'hidden', alignContent: 'start' }}>
        <div style={{ minWidth: 0 }}>
          <Pic id={product.id + '-pdp'} src={mainImg} alt={product.name} fit="contain" style={{ aspectRatio: '1 / 1' }} h={'auto'} />
          {product.thumbs && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
              {product.thumbs.map((t) => (
                <span key={t} onClick={() => setMainImg(t)} style={{ width: 56, height: 56, border: mainImg === t ? 'var(--control-border)' : 'var(--rule)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', background: 'var(--paper)' }}>
                  <img src={t} alt="" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'flex-start', paddingTop: 'var(--space-5)', minWidth: 0 }}>
          <div style={mono('var(--text-sm)')}>{product.name}</div>
          <div style={mono('var(--text-sm)')}>{product.price}</div>
          <div style={mono('var(--text-2xs)', { whiteSpace: 'pre-line', lineHeight: 'var(--leading-body)', letterSpacing: '0.03em' })}>{product.desc || 'CUSTOM GARMENT DYED. MADE IN USA.'}</div>
          {product.stock && product.stock <= 2 && <DS.StockNotice count={product.stock} />}
          <DS.SizeSelector sizes={product.sizes || ['S', 'M', 'L', 'XL']} value={size} onChange={setSize} />
          <DS.Button label="ADD TO BAG" onClick={() => onAdd(product, size)} />
          <div style={{ marginTop: 'var(--space-2)' }}>
            <div style={mono('var(--text-sm)', { marginBottom: 'var(--space-2)' })}>SIZE CHART</div>
            <DS.SizeChart />
          </div>
        </div>
      </div>
    );
  };

  K.FilterLeft = function ({ filters, setFilters }) {
    const DS = window.__MELLOW_DS;
    return (
      <div style={{ flex: 1, padding: 'var(--space-5)', overflow: 'auto' }}>
        <DS.FilterPanel value={filters} onChange={setFilters} />
      </div>
    );
  };

  K.ProductGridRight = function ({ items, view, onSelect, imageHeight }) {
    const DS = window.__MELLOW_DS;
    const cols = view === 'ALL' ? 9 : parseInt(view, 10) || 3;
    const lines = [];
    for (let i = 1; i < cols; i++) lines.push((100 / cols) * i);
    return (
      <div style={{ position: 'relative', padding: '0 var(--page-pad) var(--space-7)' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {lines.map((pct) => <span key={pct} style={{ position: 'absolute', top: 0, bottom: 0, left: pct + '%', width: 1, background: 'var(--border-rule)' }}></span>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', 1fr)', columnGap: 'var(--space-6)', rowGap: 'var(--space-7)' }}>
          {items.map((p, i) => (
            <DS.ProductCard key={p.id + '-' + i} image={p.image} hoverImage={p.hoverImage} name={p.name} price={p.price} meta={p.meta}
              imageHeight={imageHeight || (cols >= 9 ? 90 : cols >= 6 ? 140 : 250)} onClick={() => onSelect(p)} />
          ))}
        </div>
      </div>
    );
  };

  // ---------- MAGAZINE ----------
  K.MagazineLeft = function () {
    const DS = window.__MELLOW_DS;
    const M = D.magazine;
    return (
      <div style={{ flex: 1, padding: 'var(--space-5)', overflow: 'auto' }}>
        <div style={mono('var(--text-sm)', { marginBottom: 'var(--space-4)' })}>{M.intro}</div>
        <div style={mono('var(--text-sm)', { whiteSpace: 'pre-line', lineHeight: 'var(--leading-body)', letterSpacing: '0.02em', marginBottom: 'var(--space-5)' })}>{M.copy}</div>
        <div style={mono('var(--text-sm)', { marginBottom: 'var(--space-3)' })}>HOW IT WORKS:</div>
        <div style={mono('var(--text-sm)', { whiteSpace: 'pre-line', lineHeight: 'var(--leading-body)', letterSpacing: '0.02em', marginBottom: 'var(--space-5)' })}>{M.how}</div>
        <DS.Button label="SUBSCRIBE" onClick={() => {}} />
      </div>
    );
  };

  K.IssueLeft = function ({ issue }) {
    return (
      <div style={{ flex: 1, padding: 'var(--space-5)', overflow: 'auto' }}>
        <div style={mono('var(--text-sm)', { whiteSpace: 'pre-line', lineHeight: 'var(--leading-body)' })}>{issue.details}</div>
      </div>
    );
  };

  K.IssueRight = function ({ issue, onZoom }) {
    const imgs = [issue.image, issue.back].filter(Boolean);
    return (
      <div style={{ padding: '0 var(--page-pad) var(--space-7)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 'var(--space-6)' }}>
          {imgs.map((im) => (
            <Pic key={im} id={issue.id + '-cover-' + im.split('/').pop()} src={im} alt={issue.name} onClick={() => onZoom(im)} style={{ aspectRatio: '3 / 4' }} h={'auto'} />
          ))}
        </div>
        {issue.spreads && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: 'var(--space-6)', marginTop: 'var(--space-7)' }}>
            {issue.spreads.map((s) => <Pic key={s} id={issue.id + '-spread-' + s.split('/').pop()} src={s} alt="spread" onClick={() => onZoom(s)} style={{ aspectRatio: '4 / 3' }} h={'auto'} />)}
          </div>
        )}
      </div>
    );
  };

  // ---------- ROCK GAMES ----------
  K.RockGamesLeft = function () {
    const DS = window.__MELLOW_DS;
    const M = D.mrg;
    return (
      <div style={{ flex: 1, padding: 'var(--space-5)', overflow: 'auto' }}>
        <Pic id="mrg-logo-left" src={M.logo} alt="MRG" fit="contain" h={120} style={{ width: 300, maxWidth: '100%' }} />
        <div style={mono('var(--text-sm)', { lineHeight: 'var(--leading-body)', letterSpacing: '0.02em', margin: 'var(--space-5) 0' })}>{M.blurb}</div>
        <div style={mono('var(--text-xl)', { lineHeight: 1.1 })}>{M.purse}</div>
        <div style={mono('var(--text-display)', { lineHeight: 1.2, marginBottom: 'var(--space-5)' })}>{M.purseLabel}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {M.sections.map((s, i) => <DS.Accordion key={s.title} title={s.title} defaultOpen={i === 0}>{s.body}</DS.Accordion>)}
        </div>
      </div>
    );
  };

  K.RockGamesRight = function () {
    const DS = window.__MELLOW_DS;
    const M = D.mrg;
    const [user, setUser] = React.useState('');
    const [pass, setPass] = React.useState('');
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [vote, setVote] = React.useState(null);
    const [voted, setVoted] = React.useState(false);
    return (
      <div style={{ padding: '0 var(--page-pad) var(--space-7)' }}>
        <div style={{ textAlign: 'center', margin: 'var(--space-5) 0 var(--space-6)' }}>
          {!loggedIn ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={mono('var(--text-lg)')}>LOGIN TO VOTE</span>
              <span style={mono('var(--text-lg)')}>(USERNAME/PASSWORD)</span>
              <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
                <DS.TextInput placeholder="USERNAME" width={140} value={user} onChange={setUser} />
                <DS.TextInput placeholder="PASSWORD" type="password" width={140} value={pass} onChange={setPass} />
                <DS.Button label="LOGIN" size="sm" onClick={() => user.trim() && setLoggedIn(true)} style={{ height: 28 }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={mono('var(--text-lg)')}>HELLO {user.toUpperCase() || '______'}</span>
              <span style={mono('var(--text-md)')}>{M.round}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                {M.videos.map((v) => <DS.Choice key={v} label={v} selected={vote === v} disabled={voted} onSelect={() => setVote(v)} />)}
              </div>
              {!voted
                ? <DS.Button label="SUBMIT" size="sm" disabled={!vote} onClick={() => setVoted(true)} />
                : <span style={mono('var(--text-xs)')}>VOTE RECORDED — ONE PER ROUND</span>}
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          {M.videos.map((v) => <DS.VideoSlot key={v} caption={v} />)}
        </div>
      </div>
    );
  };
  // ---------- ABOUT (full-page lookbook) ----------
  K.AboutPage = function ({ onBack, backLabel, onAdd }) {
    const DS = window.__MELLOW_DS;
    const byId = (id) => D.products.find((p) => p.id === id);
    const ShopBlock = ({ id, w }) => {
      const p = byId(id);
      if (!p) return null;
      const sizes = (p.sizes || ['S', 'M', 'L', 'XL']).map((s) => (typeof s === 'string' ? { label: s } : s));
      const [size, setSize] = React.useState(null);
      return (
        <div style={{ background: 'var(--paper)', border: 'var(--control-border)', padding: 16, maxWidth: w || 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <span onClick={() => { window.location.href = 'product.html?id=' + encodeURIComponent(p.id); }} style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', cursor: 'pointer', textDecoration: 'underline' })}>{p.name}</span>
            <span style={mono('var(--text-2xs)', { flexShrink: 0 })}>{p.price}</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {sizes.map((s) => (
              <span key={s.label} onClick={s.soldOut ? undefined : () => setSize(s.label)} style={{ flex: 1, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: size === s.label ? '1px solid var(--ink)' : 'var(--rule)', background: size === s.label ? 'var(--surface-inverse)' : 'var(--paper)', color: size === s.label ? 'var(--text-inverse)' : s.soldOut ? 'var(--text-muted)' : 'var(--text-body)', textDecoration: s.soldOut ? 'line-through' : 'none', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, cursor: s.soldOut ? 'not-allowed' : 'pointer', userSelect: 'none' }}>{s.label}</span>
            ))}
          </div>
          <DS.Button label={size ? 'BUY NOW — ' + size : 'SELECT A SIZE'} disabled={!size} size="sm" onClick={() => size && onAdd && onAdd(p, size)} style={{ alignSelf: 'stretch', padding: '8px 0' }} />
        </div>
      );
    };
    const cap = (t, w) => (
      <div style={mono('var(--text-2xs)', { lineHeight: 1.9, letterSpacing: '0.06em', maxWidth: w || 440, whiteSpace: 'pre-line' })}>{t}</div>
    );
    return (
      <div style={{ background: 'var(--gray-soft)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'var(--space-7) var(--page-pad) 110px', boxSizing: 'border-box' }}>
          {backLabel !== null && <div onClick={onBack} style={mono('var(--text-2xs)', { cursor: 'pointer', letterSpacing: '0.12em', marginBottom: 'var(--space-6)' })}>{backLabel || 'BACK TO SHOP'}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', columnGap: 'var(--space-5)' }}>
            <div style={{ gridColumn: '1 / 5', gridRow: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 23, letterSpacing: '0.05em', color: 'var(--text-body)', lineHeight: 'var(--leading-tight)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>KEEP THINGS REAL</div>
              <div style={mono('var(--text-2xs)', { letterSpacing: '0.1em', marginTop: 'var(--space-3)' })}>MELLOW — CLIMBING APPAREL & MEDIA</div>
              <div style={{ width: '58%', marginTop: 84 }}>
                <Pic id="mag-vol2-cover-1" src="/assets/live/mag-vol2-cover.png" alt="mellow magazine" style={{ aspectRatio: '3 / 4' }} h={'auto'} fit="cover" />
              </div>
            </div>
            <div style={{ gridColumn: '5 / 13', gridRow: 1 }}>
              <div style={{ background: 'var(--paper)', padding: 12 }}>
                <div style={{ height: 480, overflow: 'hidden' }}>
                  <Pic id="streetview-forest-2" src="/assets/imagery/streetview-forest.png" alt="on location" h={'100%'} fit="cover" />
                </div>
              </div>
            </div>
            <div style={{ gridColumn: '1 / 5', gridRow: 2, marginTop: 40 }}>
              <ShopBlock id="colorblind-teal" />
            </div>
            <div style={{ gridColumn: '5 / 11', gridRow: 2, marginTop: 40 }}>
              {cap('MELLOW IS A CLIMBING APPAREL AND MEDIA BRAND. CUSTOM GARMENT-DYED BLANKS, SCREEN-PRINTED AND SEWN IN THE USA, RELEASED IN SMALL DROPS — WHEN SOMETHING SELLS OUT, IT IS USUALLY GONE.')}
            </div>
            <div style={{ gridColumn: '1 / 8', gridRow: 3, marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: 'var(--space-3)' }}>
              <Pic id="spread-1-3" src="/assets/live/spread-1.png" alt="magazine spread" h={130} fit="cover" />
              <Pic id="spread-2-4" src="/assets/live/spread-2.png" alt="magazine spread" h={130} fit="cover" />
              <Pic id="spread-3-5" src="/assets/live/spread-3.png" alt="magazine spread" h={130} fit="cover" />
            </div>
            <div style={{ gridColumn: '5 / 11', gridRow: 4, marginTop: 64 }}>
              {cap('"WE\u2019VE ALWAYS TRIED TO KEEP THINGS REAL. THE MAGAZINE, THE VIDEOS, THE ROCK GAMES — THEY ARE ALL JUST OTHER WAYS TO KEEP THAT GOING."', 470)}
            </div>
            <div style={{ gridColumn: '1 / 7', gridRow: 5, marginTop: 72 }}>
              <Pic id="hero-colorblind-tees-6" src="/assets/products/hero-colorblind-tees.png" alt="color blind tees" h={520} fit="cover" />
            </div>
            <div style={{ gridColumn: '7 / 11', gridRow: 5, marginTop: 72, alignSelf: 'center' }}>
              <Pic id="mag-vol1-cover-7" src="/assets/live/mag-vol1-cover.png" alt="mellow magazine volume 01" h={380} fit="cover" />
            </div>
            <div style={{ gridColumn: '5 / 11', gridRow: 6, marginTop: 96 }}>
              {cap('THE MELLOW ROCK GAMES — A VIDEO-BASED CLIMBING COMPETITION THAT HIGHLIGHTS TALENT, CREATIVITY, AND THE CULTURE OF OUTDOOR CLIMBING. A PLATFORM FOR CLIMBERS AND FILMMAKERS TO SHOWCASE THEIR BEST WORK IN A COMMUNITY-DRIVEN CONTEST.')}
            </div>
            <div style={{ gridColumn: '1 / 8', gridRow: 7, marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: 'var(--space-3)' }}>
              <Pic id="tile-mcd-teal-8" src="/assets/products/tile-mcd-teal.png" alt="m.c.d. crewneck teal" h={130} fit="cover" />
              <Pic id="tile-mcd-brown-9" src="/assets/products/tile-mcd-brown.png" alt="m.c.d. crewneck brown" h={130} fit="cover" />
              <Pic id="tile-tee-black-flame-10" src="/assets/products/tile-tee-black-flame.png" alt="m.c.d. tee black" h={130} fit="cover" />
            </div>
            <div style={{ gridColumn: '8 / 13', gridRow: 7, marginTop: 56, alignSelf: 'center' }}>
              <ShopBlock id="colorblind-brown" />
            </div>
            <div style={{ gridColumn: '5 / 13', gridRow: 8, marginTop: 64 }}>
              <Pic id="tile-tee-white-photo-11" src="/assets/products/tile-tee-white-photo.png" alt="urban mountain tee" h={470} fit="cover" pos="50% 30%" />
            </div>
            <div style={{ gridColumn: '1 / 6', gridRow: 9, marginTop: 80 }}>
              <Pic id="web-thermal-white-12" src="/assets/live/web-thermal-white.png" alt="urban mountain long sleeve" h={400} fit="cover" />
            </div>
            <div style={{ gridColumn: '7 / 11', gridRow: 9, marginTop: 80, alignSelf: 'center' }}>
              <ShopBlock id="mcd-navy" />
            </div>
            <div style={{ gridColumn: '5 / 11', gridRow: 10, marginTop: 80 }}>
              {cap('CUSTOM GARMENT DYED WITH SCREEN-PRINTED BACK AND SEWN MELLOW NECK LABEL. 6.5OZ JERSEY, STANDARD FIT — 100% COTTON, MADE IN USA.')}
            </div>
            <div style={{ gridColumn: '1 / 8', gridRow: 11, marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: 'var(--space-3)' }}>
              <Pic id="tile-crew-green-13" src="/assets/products/tile-crew-green.png" alt="mellow crew green" h={130} fit="cover" />
              <Pic id="tile-crew-red-14" src="/assets/products/tile-crew-red.png" alt="mellow crew red" h={130} fit="cover" />
              <Pic id="tile-tee-lilac-15" src="/assets/products/tile-tee-lilac.png" alt="urban mountain tee lilac" h={130} fit="cover" />
            </div>
            <div style={{ gridColumn: '5 / 11', gridRow: 12, marginTop: 72 }}>
              {cap('"INSIDE: STORIES, PHOTOS, AND CREATIVE PIECES YOU WON\u2019T FIND ONLINE."', 470)}
            </div>
            <div style={{ gridColumn: '1 / 7', gridRow: 13, marginTop: 80 }}>
              <Pic id="mag-black-back-16" src="/assets/magazine/mag-black-back.png" alt="mellow magazine back cover" h={520} fit="cover" pos="50% 20%" />
            </div>
            <div style={{ gridColumn: '7 / 11', gridRow: 13, marginTop: 80, alignSelf: 'center' }}>
              <Pic id="og-tee-white-17" src="/assets/live/og-tee-white.png" alt="gorilla tee" h={360} fit="cover" />
              <div style={{ marginTop: 16 }}><ShopBlock id="og-m-chocolate" w="100%" /></div>
            </div>
            <div style={{ gridColumn: '4 / 11', gridRow: 14, marginTop: 88, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: 'var(--space-3)' }}>
              <Pic id="tile-ls-bone-18" src="/assets/products/tile-ls-bone.png" alt="long sleeve bone" h={150} fit="cover" />
              <Pic id="tile-ls-black-19" src="/assets/products/tile-ls-black.png" alt="pocket long sleeve black" h={150} fit="cover" />
              <Pic id="tile-tee-peace-black-20" src="/assets/products/tile-tee-peace-black.png" alt="peace tee black" h={150} fit="cover" />
            </div>
            <div style={{ gridColumn: '5 / 11', gridRow: 15, marginTop: 72 }}>
              {cap('SMALL DROPS, NO RESTOCK PROMISES — WHEN SOMETHING SELLS OUT, IT IS USUALLY GONE.')}
            </div>
            <div style={{ gridColumn: '1 / 4', gridRow: 16, marginTop: 88, alignSelf: 'end' }}>
              <Pic id="tile-tee-yellow-21" src="/assets/products/tile-tee-yellow.png" alt="tee yellow" h={210} fit="cover" />
            </div>
            <div style={{ gridColumn: '4 / 13', gridRow: 16, marginTop: 88 }}>
              <Pic id="streetview-forest-22" src="/assets/imagery/streetview-forest.png" alt="on location" h={500} fit="cover" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---------- PRODUCT FULL PAGE (collage PDP) ----------
  K.ProductFullPage = function ({ product, onAdd, onBack }) {
    const DS = window.__MELLOW_DS;
    const [size, setSize] = React.useState(null);
    const p = product;
    const imgs = (p.thumbs && p.thumbs.length ? p.thumbs : [p.detailImage || p.image, p.hoverImage].filter(Boolean));
    const main = p.detailImage || p.image;
    const second = p.hoverImage || imgs[1] || main;
    const idx = (n) => '(' + String(701 + ((p.id || '').length * 13 + n * 7) % 280 + n * 4).padStart(4, '0') + ')';
    const cap = (t) => <div style={mono('var(--text-2xs)', { letterSpacing: '0.18em', color: 'var(--text-body)', marginTop: 'var(--space-2)' })}>{t}</div>;
    let matN = 0;
    const mat = (src, h, pos) => (
      <div style={{ background: 'var(--gray-soft)', padding: '7%', boxSizing: 'border-box' }}>
        <div style={{ height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <Pic id={p.id + '-mat-' + (++matN)} src={src} alt={p.name} fit="contain" />
        </div>
      </div>
    );
    const specRow = (a, b) => (
      <div style={{ padding: '8px 10px', borderBottom: 'var(--rule)' }}>
        <div style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em' })}>{a}</div>
        {b && <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', letterSpacing: '0.08em' })}>{b}</div>}
      </div>
    );
    return (
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'var(--space-6) var(--page-pad) var(--space-8)', boxSizing: 'border-box' }}>
        <div onClick={onBack} style={mono('var(--text-2xs)', { cursor: 'pointer', letterSpacing: '0.12em', marginBottom: 'var(--space-7)' })}>BACK TO SHOP</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', columnGap: 'var(--space-5)', rowGap: 'var(--space-7)' }}>
          <div style={{ gridColumn: '1 / 3', gridRow: 1 }}>
            <div style={{ background: 'var(--gray-soft)', height: 130, overflow: 'hidden' }}>
              <Pic id={p.id + '-main'} src={main} alt={p.name} />
            </div>
            {cap(idx(1))}
          </div>
          <div style={{ gridColumn: '1 / 7', gridRow: 2 }}>
            {mat(main, 470)}
            {cap(idx(2))}
          </div>
          <div style={{ gridColumn: '7 / 11', gridRow: 2, paddingTop: 90 }}>
            <span style={{ fontFamily: 'var(--font-blackletter)', fontSize: 'var(--text-xl)', color: 'var(--text-body)', display: 'block', marginBottom: 'var(--space-3)' }}>mellow</span>
            <div style={{ border: 'var(--control-border)', maxWidth: 300 }}>
              {specRow(p.name, p.id ? 'MLW' + p.id.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6) : null)}
              {specRow(p.price || '$—', 'GARMENT DYED · MADE IN USA')}
              <div style={{ padding: '8px 10px' }}>
                <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', letterSpacing: '0.08em', whiteSpace: 'pre-line', lineHeight: 1.8 })}>{(p.desc || '6.5OZ JERSEY, STANDARD FIT').split('\n\n')[0]}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'flex-start', marginTop: 'var(--space-5)' }}>
              {p.stock && p.stock <= 2 && <DS.StockNotice count={p.stock} />}
              <DS.SizeSelector sizes={p.sizes || ['S', 'M', 'L', 'XL']} value={size} onChange={setSize} />
              <DS.Button label={size ? 'ADD TO BAG — ' + size : 'SELECT A SIZE'} disabled={!size} onClick={() => size && onAdd && onAdd(p, size)} />
            </div>
          </div>
          <div style={{ gridColumn: '7 / 11', gridRow: 3 }}>
            <div style={{ background: 'var(--gray-soft)', height: 300, overflow: 'hidden' }}>
              <Pic id={p.id + '-second'} src={second} alt={p.name} />
            </div>
            {cap(idx(3))}
          </div>
          <div style={{ gridColumn: '4 / 11', gridRow: 4, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: 'var(--space-5)' }}>
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div style={{ background: 'var(--gray-soft)', height: 150, overflow: 'hidden' }}>
                  <Pic id={p.id + '-tile-' + i} src={imgs[i % imgs.length] || main} alt={p.name} />
                </div>
                {cap(idx(4 + i))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ---------- ISSUE DETAIL (full-page editorial, per magazine volume) ----------
  K.IssuePage = function ({ issue, onNav, onAdd }) {
    const DS = window.__MELLOW_DS;
    const M = D.magazine;
    const [zoom, setZoom] = React.useState(null);
    const imgs = [issue.image, issue.back].concat(issue.spreads || []).filter(Boolean);
    const pick = (i) => imgs[i % imgs.length];
    const cap = (t, w) => (
      <div style={mono('var(--text-2xs)', { lineHeight: 1.9, letterSpacing: '0.06em', maxWidth: w || 450, whiteSpace: 'pre-line' })}>{t}</div>
    );
    let imN = 0;
    const im = (src, h, extra) => (
      <Pic id={issue.id + '-' + (++imN)} src={src} alt={issue.name} h={h} onClick={() => setZoom(src)} style={extra} />
    );
    const fLink = (t, fn) => (
      <div key={t} onClick={fn} style={mono('var(--text-2xs)', { letterSpacing: '0.08em', cursor: 'pointer', marginBottom: 6 })}>{t}</div>
    );
    const vol2 = /volume 02/i.test(issue.name);
    return (
      <div style={{ background: 'var(--gray-soft)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'var(--space-7) var(--page-pad) 0', boxSizing: 'border-box' }}>
          <div onClick={() => onNav && onNav('magazine')} style={mono('var(--text-2xs)', { cursor: 'pointer', letterSpacing: '0.12em', marginBottom: 'var(--space-6)' })}>BACK TO MAGAZINE</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', columnGap: 'var(--space-5)' }}>
            <div style={{ gridColumn: '5 / 11', gridRow: 1 }}>
              {cap(issue.name.toUpperCase() + ' — ' + (issue.meta || 'HARD COVER') + '. INSIDE: STORIES, PHOTOS, AND CREATIVE PIECES YOU WON\u2019T FIND ONLINE — THE KIND OF MAG YOU\u2019LL WANT TO KEEP ON THE COFFEE TABLE OR THE BOOKSHELF.')}
            </div>
            <div style={{ gridColumn: '1 / 8', gridRow: 2, marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: 'var(--space-3)' }}>
              {im(pick(2), 130)}
              {im(pick(3), 130)}
              {im(pick(4), 130)}
            </div>
            <div style={{ gridColumn: '5 / 13', gridRow: 3, marginTop: 56 }}>
              {im(issue.image, 480, { objectPosition: '50% 25%' })}
            </div>
            <div style={{ gridColumn: '1 / 6', gridRow: 4, marginTop: 72 }}>
              {im(pick(1), 400)}
            </div>
            <div style={{ gridColumn: '5 / 11', gridRow: 5, marginTop: 72 }}>
              {cap(vol2
                ? 'FEATURE PIECES FROM BABSI ZANGERL, SEAN BAILEY, BROOKE RABOUTOU, HAMISH MCARTHUR, KATIE LAMB, ETHAN SALVO, AND MORE. 120 PAGES, HARD COVER.'
                : (issue.details || '').replace(/\n+/g, '. ').toUpperCase() + '. EXCLUSIVE CONTENT FROM SOME OF THE MOST RESPECTED NAMES IN THE GAME.')}
            </div>
            <div style={{ gridColumn: '1 / 8', gridRow: 6, marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: 'var(--space-3)' }}>
              {im(pick(5), 130)}
              {im(pick(6), 130)}
              {im(pick(7), 130)}
            </div>
            <div style={{ gridColumn: '5 / 11', gridRow: 7, marginTop: 56 }}>
              {cap('WE\u2019VE ALWAYS TRIED TO KEEP THINGS REAL — THIS MAGAZINE IS ANOTHER WAY TO KEEP THAT GOING.')}
              <div style={{ marginTop: 'var(--space-4)' }}>
                <DS.Button label="ADD TO BAG" onClick={() => onAdd && onAdd(issue)} />
              </div>
            </div>
            <div style={{ gridColumn: '1 / 4', gridRow: 8, marginTop: 80, alignSelf: 'end' }}>
              {im(pick(3), 210, { objectPosition: '25% 50%' })}
            </div>
            <div style={{ gridColumn: '4 / 13', gridRow: 8, marginTop: 80 }}>
              {im(pick(1), 520, { objectPosition: '50% 20%' })}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 2fr 2fr', columnGap: 'var(--space-5)', alignItems: 'start', padding: '90px 0 40px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-blackletter)', fontSize: 'var(--text-xl)', color: 'var(--text-body)' }}>mellow</span>
              <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', marginTop: 'var(--space-3)' })}>© {new Date().getFullYear()} MELLOW</div>
            </div>
            <div>
              <div style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.1em', marginBottom: 10 })}>SHOP</div>
              {fLink('ALL PRODUCTS', () => onNav && onNav('shop'))}
              {fLink('MAGAZINE', () => onNav && onNav('magazine'))}
              {fLink('ROCK GAMES', () => onNav && onNav('rockgames'))}
            </div>
            <div>
              <div style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.1em', marginBottom: 10 })}>HELP</div>
              {fLink('RETURNS & REFUNDS')}
              {fLink('PRIVACY POLICY')}
              {fLink('TERMS OF SERVICE')}
            </div>
            <div>
              <div style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.1em', marginBottom: 10 })}>FIND US</div>
              {fLink('INSTAGRAM')}
              {fLink('YOUTUBE', () => onNav && onNav('youtube'))}
              {fLink('FACEBOOK')}
            </div>
          </div>
        </div>
        {zoom && (
          <div onClick={() => setZoom(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(20,20,20,0.94)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', zIndex: 10 }}>
            <img src={zoom} alt="" style={{ maxWidth: '92%', maxHeight: '92%', objectFit: 'contain' }} />
          </div>
        )}
      </div>
    );
  };

  // ---------- ROCK GAMES INFO (full-page sections: prizes, timeline, judging, deliverables) ----------
  K.RockGamesInfo = function () {
    const M = D.mrg;
    const box = { border: 'var(--rule)', background: 'var(--paper)', padding: '18px 20px' };
    const h2 = (t) => <div style={mono('var(--text-lg)', { fontWeight: 'var(--weight-bold)', letterSpacing: 'var(--tracking-wide)', textAlign: 'center', marginBottom: 'var(--space-6)' })}>{t}</div>;
    const cardTitle = (t) => <div style={mono('var(--text-sm)', { fontWeight: 'var(--weight-bold)', marginBottom: 8 })}>{t}</div>;
    const cardBody = (t) => <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', lineHeight: 1.9, letterSpacing: '0.04em', whiteSpace: 'pre-line' })}>{t}</div>;
    const timeline = [
      ['SUBMISSION WINDOW (APRIL 1ST – MAY 31ST)', "Climbers submit their video segments through Mellow's website."],
      ['QUALIFIERS (JUNE 9TH – JUNE 22ND)', 'Three videos released every Monday, Wednesday, and Friday. The community votes on their favorite video in each heat.'],
      ['FINALS (JUNE 23RD – JUNE 28TH)', 'The top video from each heat moves on to the finals round. A video is released every day.'],
      ['RESULTS (JUNE 29TH)', 'The final six videos compete in a final round of voting — community (30%) and judging panel (70%). Live stream June 29th at 11am MST to announce the winners.'],
    ];
    const criteria = [
      ['DIFFICULTY / TRY HARD', 'Level of grit or effort'],
      ['CREATIVITY & STYLE', 'Approach and execution of the video and climbing'],
      ['CINEMATOGRAPHY', 'Quality of filming, editing, and storytelling'],
      ['OVERALL CULTURAL IMPACT', 'Influence of the video on climbing culture'],
    ];
    const deliverables = [
      ['FULL VIDEO EXPORT', "Format: H.264 (.mp4)\nVideo thumbnail: 1280×720 (2MB)\nMusic: copyright music is allowed, but must adhere to YouTube's guidelines"],
      ['PROMO ASSETS', '30 second promo video\n10 second promo video\n1–5 still assets'],
      ['REQUIRED INFORMATION', 'YouTube description\nVideo title\nAll required social tags (climber, filmers, photographers etc.)'],
      ['UPLOAD TO GOOGLE DRIVE', 'All assets must be uploaded to a Google Drive folder, shared with media@mellowclimbing.com or to anyone with the link.'],
    ];
    return (
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '64px var(--page-pad) 72px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 72 }}>
        {/* header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-5)' }}>
          <Pic id="mrg-logo-center" src={M.logo} alt="MRG" fit="contain" h={130} style={{ width: 320, maxWidth: '80%' }} />
          <div style={mono('var(--text-sm)', { lineHeight: 'var(--leading-body)', letterSpacing: '0.02em', textAlign: 'center', maxWidth: 560, textTransform: 'none' })}>{M.blurb}</div>
          <div style={{ border: 'var(--control-border)', padding: '26px 56px', textAlign: 'center' }}>
            <div style={mono('var(--text-display)', { fontWeight: 'var(--weight-bold)', lineHeight: 1.2 })}>{M.purse}</div>
            <div style={mono('var(--text-sm)', { marginTop: 6 })}>{M.purseLabel}</div>
          </div>
        </div>
        {/* prizes */}
        <div>
          {h2('PRIZES')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
            {[['1ST PLACE', '$10,000'], ['2ND PLACE', '$5,000'], ['3RD PLACE', '$2,500'], ['CINEMATOGRAPHY', '$2,500']].map(([t, v]) => (
              <div key={t} style={Object.assign({}, box, { textAlign: 'center' })}>
                <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', marginBottom: 8 })}>{t}</div>
                <div style={mono('var(--text-xl)', { fontWeight: 'var(--weight-bold)' })}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        {/* timeline */}
        <div>
          {h2('TIMELINE')}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'var(--ink)' }}></div>
            {timeline.map(([t, b], i) => {
              const rightSide = i % 2 === 0;
              return (
                <div key={t} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: 'var(--space-6)' }}>
                  <div style={{ gridColumn: rightSide ? 2 : 1, position: 'relative', padding: rightSide ? '0 0 0 34px' : '0 34px 0 0' }}>
                    <span style={{ position: 'absolute', top: 8, [rightSide ? 'left' : 'right']: -5, width: 11, height: 11, borderRadius: '50%', background: 'var(--ink)' }}></span>
                    <div style={box}>
                      {cardTitle(t)}
                      {cardBody(b)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* judging */}
        <div>
          {h2('JUDGING CRITERIA')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            {criteria.map(([t, b]) => <div key={t} style={box}>{cardTitle(t)}{cardBody(b)}</div>)}
          </div>
          <div style={Object.assign({}, box, { marginTop: 'var(--space-4)', textAlign: 'center', padding: '24px 20px' })}>
            {cardTitle('JUDGING PANEL')}
            {cardBody('Brooke Raboutou, Daniel Woods, Alex Johnson, Ben Neilson, Tim Kemple')}
          </div>
        </div>
        {/* deliverables */}
        <div>
          {h2('DELIVERABLES')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            {deliverables.map(([t, b]) => <div key={t} style={box}>{cardTitle(t)}{cardBody(b)}</div>)}
          </div>
        </div>
      </div>
    );
  };

  // ---------- ROCK GAMES (full-page: console on top, info columns below) ----------
  K.RockGamesPage = function ({ console: Console }) {
    const DS = window.__MELLOW_DS;
    const M = D.mrg;
    const cap = (t, w) => (
      <div style={mono('var(--text-2xs)', { lineHeight: 1.9, letterSpacing: '0.06em', maxWidth: w || 460, whiteSpace: 'pre-line' })}>{t}</div>
    );
    const head = (t) => <div style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', marginBottom: 14 })}>{t}</div>;
    const ledger = (rows) => (
      <div style={{ borderTop: 'var(--control-border)' }}>
        {rows.map(([a, b], i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 0.8fr) 1.4fr', gap: 14, padding: '10px 0', borderBottom: 'var(--rule)' }}>
            <span style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.1em' })}>{a}</span>
            <span style={mono('var(--text-2xs)', { color: 'var(--text-muted)', letterSpacing: '0.06em', lineHeight: 1.7 })}>{b}</span>
          </div>
        ))}
      </div>
    );
    return (
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 var(--page-pad) 96px', boxSizing: 'border-box' }}>
        <div style={{ margin: '0 calc(-1 * var(--page-pad))' }}>{Console ? <Console /> : <DS.VideoSlot />}</div>
        {/* title row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', columnGap: 'var(--space-5)', marginTop: 56 }}>
          <div style={{ gridColumn: '1 / 5' }}>
            <Pic id="mrg-logo-left" src={M.logo} alt="MRG" fit="contain" h={120} style={{ width: 300, maxWidth: '100%' }} />
            <div style={mono('var(--text-2xs)', { letterSpacing: '0.1em', marginTop: 22 })}>{M.round}</div>
          </div>
          <div style={{ gridColumn: '5 / 12' }}>
            {cap(M.blurb.toUpperCase(), 620)}
            <div style={{ marginTop: 18 }}>{cap(M.format.toUpperCase(), 620)}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 28 }}>
              <span style={mono('var(--text-display)', { fontWeight: 'var(--weight-bold)', lineHeight: 1 })}>{M.purse}</span>
              <span style={mono('var(--text-xs)', { letterSpacing: '0.12em' })}>{M.purseLabel.toUpperCase()}</span>
            </div>
          </div>
        </div>
        {/* timeline */}
        <div style={{ marginTop: 72 }}>
          {head('TIMELINE')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: 'var(--control-border)' }}>
            {M.timeline.map(([n, t, d, s], i) => (
              <div key={n} style={{ padding: '18px 16px 22px 0', borderRight: i < 3 ? 'var(--rule)' : 'none', paddingLeft: i ? 16 : 0 }}>
                <div style={mono('var(--text-xl)', { fontWeight: 'var(--weight-bold)', lineHeight: 1 })}>{n}</div>
                <div style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.1em', marginTop: 14 })}>{t}</div>
                <div style={mono('var(--text-2xs)', { letterSpacing: '0.1em', marginTop: 4 })}>{d}</div>
                <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', letterSpacing: '0.06em', marginTop: 8, lineHeight: 1.7 })}>{s}</div>
              </div>
            ))}
          </div>
        </div>
        {/* prizes + judging */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', columnGap: 'var(--space-5)', marginTop: 72 }}>
          <div style={{ gridColumn: '1 / 5' }}>
            {head('PRIZES')}
            <div style={{ borderTop: 'var(--control-border)' }}>
              {M.prizes.map(([t, v]) => (
                <div key={t} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '11px 0', borderBottom: 'var(--rule)' }}>
                  <span style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.1em' })}>{t}</span>
                  <span style={mono('var(--text-sm)', { fontWeight: 'var(--weight-bold)', flexShrink: 0 })}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: '5 / 13' }}>
            {head('JUDGING CRITERIA')}
            {ledger(M.judging)}
            <div style={{ marginTop: 18 }}>{cap('JUDGING PANEL — ' + M.panel.toUpperCase(), 700)}</div>
          </div>
        </div>
        {/* rules + deliverables */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', columnGap: 'var(--space-5)', marginTop: 72 }}>
          <div style={{ gridColumn: '1 / 8' }}>
            {head('RULES')}
            {ledger(M.rules)}
          </div>
          <div style={{ gridColumn: '8 / 13' }}>
            {head('DELIVERABLES')}
            {ledger(M.deliverables)}
          </div>
        </div>
        {/* how to submit + imagery */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', columnGap: 'var(--space-5)', marginTop: 72, alignItems: 'start' }}>
          <div style={{ gridColumn: '1 / 6' }}>
            {head('HOW TO SUBMIT')}
            <div style={{ borderTop: 'var(--control-border)' }}>
              {['SUBMISSION WINDOW OPENS SEP 30 — SCROLL TO THE TAPE DECK ON THE CONSOLE ABOVE', 'PASTE YOUR YOUTUBE / .MP4 LINK AND CHECK THE PREVIEW', 'ENTER A CALLSIGN (TEAM NAME) AND PRESS LOAD TAPE', 'YOUR FEED IS ASSIGNED THE NEXT OPEN CHANNEL. ONE ENTRY PER TEAM.'].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: 'var(--rule)' }}>
                  <span style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', width: 22, flexShrink: 0 })}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={mono('var(--text-2xs)', { letterSpacing: '0.08em', lineHeight: 1.7 })}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: '7 / 13' }}>
            <Pic id="streetview-forest-23" src="/assets/imagery/streetview-forest.png" alt="on location" h={300} fit="cover" />
            <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: 10 })}>CLIMBS MUST HAVE BEEN SENT IN 2026</div>
          </div>
        </div>
      </div>
    );
  };

  // ---------- ABOUT (brand story — distinct from the lookbook home) ----------
  K.AboutStory = function ({ onNav }) {
    const DS = window.__MELLOW_DS;
    const cap = (t, w) => (
      <div style={mono('var(--text-2xs)', { lineHeight: 1.9, letterSpacing: '0.06em', maxWidth: w || 460, whiteSpace: 'pre-line' })}>{t}</div>
    );
    const head = (t) => <div style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', marginBottom: 14 })}>{t}</div>;
    const pillars = [
      ['APPAREL', 'CUSTOM GARMENT-DYED BLANKS. SCREEN-PRINTED AND SEWN IN THE USA. 6.5OZ JERSEY, STANDARD FIT. RELEASED IN SMALL DROPS.', 'shop', '/assets/products/tile-mcd-teal.png'],
      ['MAGAZINE', 'A BIANNUAL HARDCOVER. STORIES, PHOTOS, AND CREATIVE PIECES YOU WON\u2019T FIND ONLINE.', 'magazine', '/assets/live/mag-vol2-cover.png'],
      ['YOUTUBE', 'FILMS, TRIPS, AND SESSIONS FROM THE CREW AND FRIENDS OF MELLOW.', 'youtube', '/assets/imagery/streetview-forest.png'],
      ['ROCK GAMES', 'A VIDEO-BASED CLIMBING COMPETITION. COMMUNITY-JUDGED, $20K TOTAL PRIZE PURSE.', 'rockgames', '/assets/live/mrg-hero.png'],
    ];
    const values = [
      ['KEEP THINGS REAL', 'NO HYPE. NO FILTERS. THE WORK SPEAKS.'],
      ['MADE IN USA', 'CUT, DYED, PRINTED, AND SEWN DOMESTICALLY.'],
      ['SMALL DROPS', 'LIMITED RUNS. WHEN IT SELLS OUT, IT IS USUALLY GONE.'],
      ['PRINT MATTERS', 'A MAGAZINE YOU KEEP ON THE SHELF, NOT IN A FEED.'],
      ['COMMUNITY FIRST', 'CLIMBERS AND FILMMAKERS DECIDE THE ROCK GAMES.'],
    ];
    return (
      <div style={{ background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'var(--space-7) var(--page-pad) 110px', boxSizing: 'border-box' }}>
          {/* title */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', columnGap: 'var(--space-5)', borderBottom: 'var(--control-border)', paddingBottom: 40 }}>
            <div style={{ gridColumn: '1 / 6' }}>
              <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: 18 })}>ABOUT</div>
              <div style={{ fontFamily: 'var(--font-blackletter)', fontSize: 96, lineHeight: 0.9, color: 'var(--text-body)' }}>mellow</div>
              <div style={mono('var(--text-2xs)', { letterSpacing: '0.1em', marginTop: 18 })}>CLIMBING APPAREL & MEDIA — EST. USA</div>
            </div>
            <div style={{ gridColumn: '7 / 12', alignSelf: 'end' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-body)', color: 'var(--text-body)', letterSpacing: '0.02em' }}>
                Mellow is a climbing apparel and media brand. We make garment-dyed, made-in-USA blanks, publish a hardcover print magazine, run a YouTube channel, and host the Mellow Rock Games — a community-judged video climbing competition. We’ve always tried to keep things real; everything else is just another way to keep that going.
              </div>
            </div>
          </div>
          {/* pillars */}
          <div style={{ marginTop: 56 }}>
            {head('WHAT WE DO')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: 'var(--rule)', borderLeft: 'var(--rule)' }}>
              {pillars.map(([t, body, target, img]) => (
                <div key={t} onClick={() => onNav && onNav(target)} style={{ borderRight: 'var(--rule)', borderBottom: 'var(--rule)', padding: 18, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--gray-soft)' }}>
                    <Pic id={'pillar-' + t.replace(/\W+/g, '-').toLowerCase()} src={img} alt={t} fit="contain" style={{ width: '80%', height: '80%' }} h={'80%'} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={mono('var(--text-xs)', { fontWeight: 'var(--weight-bold)' })}>{t}</span>
                    <span style={mono('var(--text-xs)')}>→</span>
                  </div>
                  {cap(body)}
                </div>
              ))}
            </div>
          </div>
          {/* values ledger + image */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', columnGap: 'var(--space-5)', marginTop: 72, alignItems: 'start' }}>
            <div style={{ gridColumn: '1 / 7' }}>
              {head('WHAT WE STAND FOR')}
              <div style={{ borderTop: 'var(--control-border)' }}>
                {values.map(([t, s], i) => (
                  <div key={t} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1.4fr', gap: 16, padding: '14px 0', borderBottom: 'var(--rule)' }}>
                    <span style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)' })}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.1em' })}>{t}</span>
                    <span style={mono('var(--text-2xs)', { color: 'var(--text-muted)', letterSpacing: '0.08em', lineHeight: 1.7 })}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: '8 / 13' }}>
              <Pic id="hero-colorblind-tees-24" src="/assets/products/hero-colorblind-tees.png" alt="color blind tees" h={420} fit="cover" pos="left top" />
              <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: 10 })}>COLOR BLIND TEES — GARMENT DYED, MADE IN USA</div>
            </div>
          </div>
          {/* process */}
          <div style={{ marginTop: 72 }}>
            {head('HOW A DROP HAPPENS')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderTop: 'var(--control-border)' }}>
              {[['01', 'BLANKS', 'US-MILLED 6.5OZ JERSEY'], ['02', 'DYE', 'CUSTOM GARMENT DYE, SMALL BATCH'], ['03', 'PRINT', 'SCREEN-PRINTED BACK GRAPHIC'], ['04', 'SEW', 'MELLOW NECK LABEL SEWN IN'], ['05', 'DROP', 'RELEASED ONLINE. NO RESTOCK PROMISES.']].map(([n, t, s], i) => (
                <div key={n} style={{ padding: '18px 16px 22px 0', paddingLeft: i ? 16 : 0, borderRight: i < 4 ? 'var(--rule)' : 'none' }}>
                  <div style={mono('var(--text-xl)', { fontWeight: 'var(--weight-bold)', lineHeight: 1 })}>{n}</div>
                  <div style={mono('var(--text-2xs)', { fontWeight: 'var(--weight-bold)', letterSpacing: '0.1em', marginTop: 14 })}>{t}</div>
                  <div style={mono('var(--text-2xs)', { color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: 6, lineHeight: 1.7 })}>{s}</div>
                </div>
              ))}
            </div>
          </div>
          {/* contact */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', columnGap: 'var(--space-5)', marginTop: 72, borderTop: 'var(--control-border)', paddingTop: 40 }}>
            <div style={{ gridColumn: '1 / 5' }}>{head('CONTACT')}{cap('MELLOWCLIMBING@GMAIL.COM\nWHOLESALE, PRESS, AND ROCK GAMES ENQUIRIES WELCOME.')}</div>
            <div style={{ gridColumn: '5 / 9' }}>{head('FIND US')}{cap('INSTAGRAM\nYOUTUBE\nFACEBOOK')}</div>
            <div style={{ gridColumn: '9 / 13' }}>{head('NEWSLETTER')}{cap('FIRST TO HEAR ABOUT NEW DROPS. NO SPAM.')}<div style={{ marginTop: 14 }}><DS.EmailSignup width="100%" /></div></div>
          </div>
        </div>
      </div>
    );
  };

  } catch (e) { console.error('SCREENS ERR', e && e.message, e && e.stack); }
})();
