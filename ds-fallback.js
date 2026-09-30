// Resolves the Mellow DS component namespace. Prefers the compiled _ds_bundle.js global;
// falls back to fetching + Babel-transforming the component sources directly.
// Requires React + Babel standalone to be loaded first. Usage: window.loadMellowDS('../..').then(NS => …)
window.loadMellowDS = function (root) {
  root = root || '.';
  if (window.__MELLOW_DS) return Promise.resolve(window.__MELLOW_DS);
  var need = ['Button', 'InvertLabel', 'TextInput', 'EmailSignup', 'Choice', 'Accordion', 'ProductCard', 'SizeSelector', 'StockNotice', 'SizeChart', 'FilterBar', 'FilterPanel', 'BagIndicator', 'NavBar', 'FooterBar', 'VideoSlot'];
  var found = null;
  Object.getOwnPropertyNames(window).forEach(function (k) {
    if (found) return;
    try {
      var v = window[k];
      if (v && typeof v === 'object' && v !== window && need.every(function (n) { return typeof v[n] === 'function'; })) found = v;
    } catch (e) {}
  });
  if (found) { window.__MELLOW_DS = found; return Promise.resolve(found); }
  var files = ['core/Button.jsx', 'core/InvertLabel.jsx', 'core/TextInput.jsx', 'core/EmailSignup.jsx', 'core/Choice.jsx', 'core/Accordion.jsx', 'commerce/BagIndicator.jsx', 'commerce/ProductCard.jsx', 'commerce/SizeSelector.jsx', 'commerce/StockNotice.jsx', 'commerce/SizeChart.jsx', 'commerce/FilterBar.jsx', 'commerce/FilterPanel.jsx', 'navigation/NavBar.jsx', 'navigation/FooterBar.jsx', 'media/VideoSlot.jsx'];
  return Promise.all(files.map(function (f) {
    return fetch(root + '/components/' + f).then(function (r) { if (!r.ok) throw new Error('fetch failed: ' + f); return r.text(); });
  })).then(function (texts) {
    var src = texts.join('\n')
      .replace(/(^|\n)[ \t]*import[^\n]*/g, '\n')
      .replace(/export function/g, 'function');
    var body = src + '\nreturn {' + need.join(',') + '};';
    try {
      var code = Babel.transform('window.__buildMellowDS = function(React){' + body + '}', { presets: [['react', { runtime: 'classic', pragma: 'React.createElement', pragmaFrag: 'React.Fragment' }]] }).code + '\n//# sourceURL=mellow-ds-built.js';
      (0, eval)(code);
      window.__MELLOW_DS = window.__buildMellowDS(React);
    } catch (e) {
      console.error('mellow ds fallback build failed:', e && e.message, e && e.stack);
      throw e;
    }
    return window.__MELLOW_DS;
  });
};
