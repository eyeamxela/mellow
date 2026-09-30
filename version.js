// Runtime version switcher: THEME (visual concept) × LAYOUT (brief-faithful vs extended pages).
// Persists in localStorage; applies theme tokens to :root before React renders. Loaded by every page.
(function () {
  var THEMES = {
    v1: { name: 'CONTACT SHEET', vars: {}, logo: true, cfg: {} },
    v2: { name: 'DARKROOM', logo: false, cfg: { zoomBg: 'rgba(0,0,0,0.94)' }, vars: { '--ink': '#ece9e2', '--paper': '#141414', '--gray-hairline': '#3c3c3c', '--gray-muted': '#8f8f8f', '--gray-soft': '#1e1e1e', '--moss': '#86b364', '--surface-media': '#000000' } },
    v3: { name: 'BROADSHEET', logo: true, cfg: { viewOptions: ['2', '4', 'ALL'], shopH: [400, 210, 100], magH: [420, 200], broadsheetHero: true, filterBarBorder: true }, vars: { '--font-mono': "'Helvetica Neue', Helvetica, Arial, sans-serif", '--gray-hairline': '#141414', '--tracking-caps': '0.08em', '--text-2xs': '11px', '--text-md': '15px', '--leading-body': '1.5' } },
    v4: { name: 'MANILA ARCHIVE', logo: false, cfg: { viewOptions: ['3', '6', '9'], defaultView: '6', zoomBg: 'rgba(36,29,18,0.94)', imgFilter: 'sepia(0.14) saturate(0.92)' }, vars: { '--ink': '#241d12', '--paper': '#e9e2d0', '--gray-hairline': '#b9ad90', '--gray-muted': '#8a7d63', '--gray-soft': '#ddd4be', '--moss': '#4e6a2e', '--surface-media': '#241d12', '--tracking-caps': '0.06em' } },
    v5: { name: 'FIELDBOOK', logo: false, cfg: { zoomBg: 'rgba(13,16,10,0.95)', coordStrip: true, navH: 56 }, vars: { '--ink': '#a8c78a', '--paper': '#0d100a', '--gray-hairline': '#2e3627', '--gray-muted': '#64735a', '--gray-soft': '#161b12', '--moss': '#d7e8c2', '--surface-media': '#000000' } },
  };
  var LAYOUTS = { brief: 'BRIEF', extended: 'EXTENDED' };
  var q = new URLSearchParams(location.search);
  var get = function (k, d) { try { return q.get(k) || localStorage.getItem('mellow-' + k) || d; } catch (e) { return q.get(k) || d; } };
  var theme = THEMES[get('theme', 'v1')] ? get('theme', 'v1') : 'v1';
  var layout = LAYOUTS[get('layout', 'extended')] ? get('layout', 'extended') : 'extended';
  try { localStorage.setItem('mellow-theme', theme); localStorage.setItem('mellow-layout', layout); } catch (e) {}

  var T = THEMES[theme];
  var root = document.documentElement;
  Object.keys(T.vars).forEach(function (k) { root.style.setProperty(k, T.vars[k]); });
  if (T.cfg.imgFilter) { var st = document.createElement('style'); st.textContent = 'img{filter:' + T.cfg.imgFilter + '}'; document.head.appendChild(st); }

  window.MELLOW_VERSION = { theme: theme, layout: layout, THEMES: THEMES, LAYOUTS: LAYOUTS, themeName: T.name };
  window.KIT_CONFIG = Object.assign({}, window.KIT_CONFIG || {}, T.cfg, {
    logoSrc: T.logo ? '/assets/logo-mellow.png' : undefined,
    bagIconSrc: T.logo ? '/assets/icon-bag.png' : undefined,
    bagKey: 'mellow-bag',
    brief: layout === 'brief',
    lookbookHome: layout === 'extended',
  });
  window.setMellowVersion = function (patch) {
    try { if (patch.theme) localStorage.setItem('mellow-theme', patch.theme); if (patch.layout) localStorage.setItem('mellow-layout', patch.layout); } catch (e) {}
    var u = new URL(location.href); u.searchParams.delete('theme'); u.searchParams.delete('layout'); location.href = u.toString();
  };
})();
