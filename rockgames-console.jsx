// MRG broadcast console — V5 Fieldbook right panel for ROCK GAMES.
// Hardware realism modeled on the reference photo: putty chassis, grooved panels,
// rounded CRT glass w/ scanlines + vignette, micro readouts, digit keypad, screws.
(function () {
  const C = {
    chassis: '#c9c5b9', chassisHi: '#dedbd2', chassisLo: '#a6a194', well: '#b7b2a4',
    line: '#57544b', ink: '#26231d', label: '#33302a',
    bezel: '#75726a', bezelDark: '#45433c', screen: '#0b1118',
    crt: '#a9c0d6', green: '#9fd08a', amber: '#d8c07a',
  };
  const bevelOut = { borderTop: '1px solid ' + C.chassisHi, borderLeft: '1px solid ' + C.chassisHi, borderRight: '1px solid ' + C.chassisLo, borderBottom: '1px solid ' + C.chassisLo, outline: '1px solid ' + C.line };
  const bevelIn = { borderTop: '1px solid ' + C.chassisLo, borderLeft: '1px solid ' + C.chassisLo, borderRight: '1px solid ' + C.chassisHi, borderBottom: '1px solid ' + C.chassisHi, outline: '1px solid ' + C.line };
  const lbl = (extra) => Object.assign({ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.label, whiteSpace: 'nowrap' }, extra);

  function parseSource(raw) {
    const url = (raw || '').trim();
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,20})/);
    if (yt) return { type: 'youtube', id: yt[1], embed: 'https://www.youtube-nocookie.com/embed/' + yt[1] + '?autoplay=1', thumb: 'https://img.youtube.com/vi/' + yt[1] + '/0.jpg' };
    if (/\.(mp4|webm)(\?|$)/.test(url)) return { type: 'file', src: url };
    if (/^https?:\/\//.test(url)) return { type: 'iframe', embed: url };
    return null;
  }

  const STORE = 'mellow-mrg-console-channels';
  const VOTE = 'mellow-mrg-console-vote';
  function loadChannels() {
    const base = Array.from({ length: 12 }, (_, i) => ({ n: i + 1, callsign: null, src: null }));
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || '[]');
      saved.forEach((s) => { if (s && s.n >= 1 && s.n <= 12) base[s.n - 1] = s; });
    } catch (e) {}
    return base;
  }

  // --- hardware primitives ---
  function Screw({ style }) {
    return <span style={Object.assign({ position: 'absolute', width: 7, height: 7, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, ' + C.chassisHi + ', ' + C.chassisLo + ' 60%, ' + C.line + ')', outline: '1px solid ' + C.line }, style)}>
      <span style={{ position: 'absolute', left: 1, right: 1, top: 3, height: 1, background: C.line, transform: 'rotate(38deg)' }}></span>
    </span>;
  }
  function Ruler() {
    return <div style={{ height: 8, margin: '0 2px', background: 'repeating-linear-gradient(90deg, ' + C.line + ' 0 1px, transparent 1px 7px)', opacity: 0.55 }}></div>;
  }
  function Groove() {
    return <div style={{ height: 0, borderTop: '1px solid ' + C.chassisLo, borderBottom: '1px solid ' + C.chassisHi, margin: '2px 0' }}></div>;
  }
  function Vents({ n = 5 }) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: n }).map((_, i) => <span key={i} style={{ height: 2, background: C.chassisLo, borderBottom: '1px solid ' + C.chassisHi }}></span>)}
    </div>;
  }
  function Led({ on, color }) {
    return <span style={{ width: 8, height: 8, flexShrink: 0, borderRadius: '50%', outline: '1px solid ' + C.line, background: on ? (color || C.green) : '#3a3d33', boxShadow: on ? '0 0 4px ' + (color || C.green) : 'none' }}></span>;
  }
  function Readout({ tag, val, color, width }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span style={lbl({ fontSize: 7 })}>{tag}</span>
        <span style={Object.assign({}, bevelIn, { display: 'block', background: C.screen, color: color || C.green, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', padding: '2px 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width })}>{val}</span>
      </div>
    );
  }
  function Key({ children, on, dim, onClick, wide, tall }) {
    return (
      <button onClick={onClick} style={Object.assign({}, on ? bevelIn : bevelOut, {
        appearance: 'none', cursor: 'pointer', padding: wide ? '5px 10px' : tall ? '8px 0' : '4px 0', minWidth: wide ? 0 : 24, whiteSpace: 'nowrap', flexShrink: 0,
        background: on ? C.ink : 'linear-gradient(180deg, ' + C.chassisHi + ', ' + C.chassis + ' 45%, ' + C.well + ')',
        color: on ? C.green : dim ? '#8d887b' : C.ink,
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      })}>{children}</button>
    );
  }
  function Glass({ children, radius = 14 }) {
    return (
      <div style={{ position: 'relative', background: C.screen, borderRadius: radius, overflow: 'hidden', outline: '1px solid #000', flex: 1 }}>
        {children}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: radius, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px)' }}></div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: radius, background: 'radial-gradient(ellipse 120% 105% at 50% 48%, transparent 62%, rgba(0,0,0,0.55) 100%)' }}></div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: radius, background: 'linear-gradient(112deg, rgba(255,255,255,0.10) 0%, transparent 22%)' }}></div>
      </div>
    );
  }
  function Bezel({ children, pad = 10 }) {
    return (
      <div style={{ background: 'linear-gradient(180deg, ' + C.bezel + ', ' + C.bezelDark + ')', borderRadius: 8, padding: pad, outline: '1px solid ' + C.line, display: 'flex', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)' }}>
        {children}
      </div>
    );
  }

  window.RockGamesConsole = function RockGamesConsole() {
    const [channels, setChannels] = React.useState(loadChannels);
    const [active, setActive] = React.useState(() => { const c = loadChannels(); const f = c.find((x) => x.src); return f ? f.n : 1; });
    const [playing, setPlaying] = React.useState(false);
    const [tape, setTape] = React.useState('');
    const [callsign, setCallsign] = React.useState('');
    const [buf, setBuf] = React.useState('');
    const [voted, setVoted] = React.useState(() => { try { return localStorage.getItem(VOTE); } catch (e) { return null; } });
    const [clock, setClock] = React.useState('--:--:--');
    React.useEffect(() => {
      const t = setInterval(() => setClock(new Date().toISOString().slice(11, 19)), 1000);
      return () => clearInterval(t);
    }, []);

    const ch = channels[active - 1];
    const parsed = parseSource(tape);
    const nextSlot = channels.find((c) => !c.src);
    const filled = channels.filter((c) => c.src);

    const commit = (list) => { setChannels(list); try { localStorage.setItem(STORE, JSON.stringify(list.filter((c) => c.src))); } catch (e) {} };
    const loadTape = () => {
      if (!parsed || !nextSlot) return;
      const list = channels.map((c) => c.n === nextSlot.n ? { n: c.n, callsign: (callsign || 'ANON').toUpperCase().slice(0, 12), src: parsed } : c);
      commit(list); setActive(nextSlot.n); setPlaying(false); setTape(''); setCallsign('');
    };
    const eject = () => { commit(channels.map((c) => c.n === active ? { n: c.n, callsign: null, src: null } : c)); setPlaying(false); };
    const vote = () => {
      if (voted || !ch.src) return;
      try { localStorage.setItem(VOTE, String(ch.n)); } catch (e) {}
      setVoted(String(ch.n));
    };
    const press = (d) => setBuf((buf + d).slice(-2));
    const enter = () => { const n = parseInt(buf, 10); if (n >= 1 && n <= 12) { setActive(n); setPlaying(false); } setBuf(''); };

    const screenBody = playing && ch.src
      ? (ch.src.type === 'file'
          ? <video controls autoPlay src={ch.src.src} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', position: 'relative', zIndex: 0 }} />
          : <iframe src={ch.src.embed} title={'CH ' + ch.n} frameBorder="0" allow="autoplay; encrypted-media; fullscreen" allowFullScreen style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} />)
      : <div style={{ position: 'absolute', inset: 0 }}>
          <div className="crt-static" style={{ position: 'absolute', inset: 0, opacity: 0.45 }}></div>
          <span style={{ position: 'absolute', top: '46%', left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.34em', color: C.crt, textShadow: '0 0 6px rgba(169,192,214,0.8)' }}>
            {ch.src ? 'STANDBY \u00b7 CH ' + String(active).padStart(2, '0') : 'NO TAPE \u00b7 CH ' + String(active).padStart(2, '0')}
          </span>
        </div>;

    return (
      <div style={{ padding: 'var(--page-pad)', minHeight: 0 }}>
        <div style={Object.assign({}, bevelOut, { position: 'relative', background: 'linear-gradient(180deg, ' + C.chassisHi + ' 0%, ' + C.chassis + ' 3%, ' + C.chassis + ' 97%, ' + C.well + ' 100%)', padding: '14px 12px 12px', display: 'flex', flexDirection: 'column', gap: 10 })}>
          <Screw style={{ top: 4, left: 4 }} /><Screw style={{ top: 4, right: 4 }} /><Screw style={{ bottom: 4, left: 4 }} /><Screw style={{ bottom: 4, right: 4 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
            <span style={lbl({ fontSize: 9, fontWeight: 700 })}>MRG · MELLOW ROCK GAMES — BROADCAST TERMINAL</span>
            <span style={lbl({ fontSize: 9 })}>UNIT 07 · ROUND 1</span>
          </div>
          <Groove />
          {/* top row: main monitor + right stack */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {/* main monitor */}
            <div style={Object.assign({}, bevelIn, { flex: '2 1 360px', minWidth: 320, background: C.chassis, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 })}>
              <Ruler />
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <Readout tag="UTC" val={clock} />
                <Readout tag="CH" val={String(active).padStart(2, '0')} />
                <Readout tag="ENTRY" val={ch.callsign || '\u2014\u2014\u2014'} color={C.crt} />
                <Readout tag="SIG" val={ch.src ? (playing ? 'LOCK' : 'STBY') : 'NULL'} color={ch.src ? C.green : C.amber} />
              </div>
              <Bezel>
                <div style={{ aspectRatio: '4 / 3', width: '100%', display: 'flex' }}>
                  <Glass>{screenBody}</Glass>
                </div>
              </Bezel>
              <Ruler />
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <Key wide on={playing && !!ch.src} onClick={() => ch.src && setPlaying(true)}>{'\u25b8'} PLAY</Key>
                <Key wide on={!playing} onClick={() => setPlaying(false)}>{'\u25a0'} STOP</Key>
                <Key wide dim={!ch.src} onClick={eject}>{'\u23cf'} EJECT</Key>
                <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center', marginLeft: 'auto', minWidth: 0 }}>
                  <Led on={!!ch.src && playing} /> <span style={lbl()}>LOCK</span>
                  <Led on={!!ch.src && !playing} color={C.amber} /> <span style={lbl()}>STBY</span>
                </span>
              </div>
            </div>
            {/* right stack */}
            <div style={{ flex: '1 1 250px', minWidth: 250, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={Object.assign({}, bevelIn, { background: C.chassis, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 })}>
                <span style={lbl()}>ENTRY LOG</span>
                <Bezel pad={6}>
                  <Glass radius={8}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 74, padding: '8px 10px 10px', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(169,192,214,0.13) 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, rgba(169,192,214,0.13) 0 1px, transparent 1px 14px)' }}></div>
                      {channels.map((c) => (
                        <span key={c.n} style={{ flex: 1, height: c.src ? (18 + (c.n % 4) * 12) : 3, background: c.n === active ? C.green : c.src ? C.crt : 'rgba(169,192,214,0.25)', boxShadow: c.src ? '0 0 4px rgba(169,192,214,0.6)' : 'none' }}></span>
                      ))}
                    </div>
                  </Glass>
                </Bezel>
                <span style={lbl({ fontSize: 7 })}>SLOTS {filled.length}/12 · FREE {12 - filled.length}</span>
              </div>
              <div style={Object.assign({}, bevelIn, { background: C.chassis, padding: 8, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 })}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={lbl()}>FEED REGISTER</span>
                  <span style={lbl({ fontSize: 7 })}>{filled.length}/12 LOADED</span>
                </div>
                <div style={Object.assign({}, bevelIn, { background: C.screen, padding: 6, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 10px', alignContent: 'start' })}>
                  {channels.map((c) => (
                    <div key={c.n} onClick={() => { setActive(c.n); setPlaying(false); }} style={{ display: 'flex', justifyContent: 'space-between', gap: 6, padding: '2px 4px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', color: c.n === active ? C.green : c.src ? C.crt : '#39434e', background: c.n === active ? 'rgba(159,208,138,0.12)' : 'transparent', borderBottom: '1px solid rgba(169,192,214,0.12)' }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{String(c.n).padStart(2, '0')} {c.callsign || '—'}</span>
                      <span style={{ flexShrink: 0 }}>{voted === String(c.n) ? '●' : c.src ? '○' : ''}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Key wide dim={!ch.src || !!voted} on={voted === String(active)} onClick={vote}>{voted === String(active) ? '● VOTED' : voted ? 'VOTE USED' : '● VOTE CH ' + String(active).padStart(2, '0')}</Key>
                  <span style={lbl({ fontSize: 7, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' })}>● = YOUR VOTE · ONE PER TERMINAL</span>
                </div>
              </div>
            </div>
          </div>
          <Groove />
          {/* bottom row: keypad + tape deck */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={Object.assign({}, bevelIn, { flex: '0 1 190px', minWidth: 170, background: C.chassis, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 })}>
              <span style={lbl()}>CHANNEL SELECT</span>
              <Readout tag="DIRECT" val={buf ? 'CH ' + buf + '_' : 'CH __'} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {[1,2,3,4,5,6,7,8,9].map((d) => <Key key={d} tall onClick={() => press(String(d))}>{d}</Key>)}
                <Key tall onClick={() => setBuf('')}>CLR</Key>
                <Key tall onClick={() => press('0')}>0</Key>
                <Key tall on={!!buf} onClick={enter}>ENT</Key>
              </div>
              <Vents n={4} />
            </div>
            <div style={Object.assign({}, bevelIn, { flex: '2 1 330px', minWidth: 300, background: C.chassis, padding: 8, display: 'flex', gap: 10, flexWrap: 'wrap' })}>
              <div style={{ flex: '0 0 138px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={lbl()}>TAPE PREVIEW</span>
                <Bezel pad={5}>
                  <div style={{ width: '100%', aspectRatio: '4 / 3', display: 'flex' }}>
                    <Glass radius={7}>
                      {parsed && parsed.thumb
                        ? <img src={parsed.thumb} alt="tape preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        : <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.24em', color: C.crt }}>{parsed ? 'FEED OK' : 'PREVIEW'}</span>}
                    </Glass>
                  </div>
                </Bezel>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <Led on={!!parsed} /> <span style={lbl({ fontSize: 7 })}>{parsed ? 'SIGNAL VERIFIED' : 'AWAITING SIGNAL'}</span>
                </div>
              </div>
              <div style={{ flex: '1 1 200px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5, justifyContent: 'center' }}>
                <span style={lbl({ overflow: 'hidden', textOverflow: 'ellipsis' })}>SUBMIT YOUR ENTRY — INSERT TAPE (YOUTUBE / .MP4 LINK)</span>
                <div style={Object.assign({}, bevelIn, { background: 'linear-gradient(180deg, ' + C.bezelDark + ', #2b2a25 40%, ' + C.bezelDark + ')', padding: '7px 8px' })}>
                  <input value={tape} onChange={(e) => setTape(e.target.value)} placeholder={'HTTPS://YOUTU.BE/\u2026'} spellCheck="false"
                    style={{ width: '100%', boxSizing: 'border-box', background: C.screen, border: '1px solid #000', color: C.green, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', padding: '5px 8px', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <input value={callsign} onChange={(e) => setCallsign(e.target.value)} placeholder="CALLSIGN" spellCheck="false" maxLength={12}
                    style={Object.assign({}, bevelIn, { flex: '1 1 110px', minWidth: 0, background: C.screen, color: C.green, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', padding: '5px 8px', textTransform: 'uppercase' })} />
                  <Key wide dim={!parsed || !nextSlot} on={!!parsed && !!nextSlot} onClick={loadTape}>{'\u2b07'} LOAD TAPE</Key>
                </div>
                <span style={lbl({ fontSize: 7, color: '#77725f' })}>{parsed ? 'ASSIGNS CH ' + (nextSlot ? String(nextSlot.n).padStart(2, '0') : '\u2014 BOARD FULL') : 'PASTE A LINK TO VERIFY SIGNAL\u2026'}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
            <span style={lbl({ fontSize: 7 })}>SER NO 1994-MRG-07</span>
            <span style={lbl({ fontSize: 7 })}>ENTRIES STORED LOCALLY · ONE VOTE PER TERMINAL</span>
          </div>
        </div>
      </div>
    );
  };
})();
