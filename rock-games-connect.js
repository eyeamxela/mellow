// Original MRG TV console, with private-backend submission integration.
// Preserve the supplied hardware UI; do not replace it with a separate form.
// Hardware realism modeled on the reference photo: putty chassis, grooved panels,
// rounded CRT glass w/ scanlines + vignette, micro readouts, digit keypad, screws.
(function () {
  const C = {
    chassis: '#c9c5b9',
    chassisHi: '#dedbd2',
    chassisLo: '#a6a194',
    well: '#b7b2a4',
    line: '#57544b',
    ink: '#26231d',
    label: '#33302a',
    bezel: '#75726a',
    bezelDark: '#45433c',
    screen: '#0b1118',
    crt: '#a9c0d6',
    green: '#9fd08a',
    amber: '#d8c07a'
  };
  const bevelOut = {
    borderTop: '1px solid ' + C.chassisHi,
    borderLeft: '1px solid ' + C.chassisHi,
    borderRight: '1px solid ' + C.chassisLo,
    borderBottom: '1px solid ' + C.chassisLo,
    outline: '1px solid ' + C.line
  };
  const bevelIn = {
    borderTop: '1px solid ' + C.chassisLo,
    borderLeft: '1px solid ' + C.chassisLo,
    borderRight: '1px solid ' + C.chassisHi,
    borderBottom: '1px solid ' + C.chassisHi,
    outline: '1px solid ' + C.line
  };
  const lbl = extra => Object.assign({
    fontFamily: 'var(--font-mono)',
    fontSize: 8,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: C.label,
    whiteSpace: 'nowrap'
  }, extra);
  function parseSource(raw) {
    const url = (raw || '').trim();
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.protocol !== 'https:') return null;
      const host = u.hostname.toLowerCase();
      const id = host === 'youtu.be' ? u.pathname.slice(1) :
        ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host) ?
          (u.pathname === '/watch' ? u.searchParams.get('v') : u.pathname.match(/^\/(?:shorts|embed)\/([\w-]+)$/)?.[1]) : null;
      if (!/^[\w-]{11}$/.test(id || '')) return null;
      return {type: 'youtube', id, embed: 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1', thumb: 'https://img.youtube.com/vi/' + id + '/0.jpg'};
    } catch { return null; }
  }

  // Public, fictional demo metadata only. No applicant emails, scores or judge data.
  const DEMO_FILMS = ["Granite Afterglow", "Low Gravity", "The Quiet Send", "Moss and Motion", "A Different Beta", "Last Light Club", "Beyond the Crux", "Skin in the Game", "Weather Window", "Small Holds Big Dreams", "The Long Approach", "One More Burn", "Above the Pines", "Valley of Stone", "Rest Day Rebels", "Chalk Lines", "Pocket Universe", "Cold Rock Warm Hands", "The Good Friction", "Finding the Edge", "Evening Sessions", "The Unfinished Line", "Wild Exposure", "Softer Landings", "Through the Roof", "No Easy Way", "Dust and Daylight", "The Great Traverse", "Thin Air Stories", "Between Two Boulders", "Back to the Block", "Under the Overhang", "Trail to Tomorrow", "Project Season", "Friction Theory", "Rock Paper Patience", "The Send Forecast", "Campfire Beta", "Hands on Granite", "Against the Grain", "A Little Further", "Nightfall Sessions", "The Other Side", "Ridge Walkers", "Off the Ground", "Gravity Optional", "Waiting for Winter", "Open Air Cinema", "The Next Attempt", "Home Before Dark"];
  const PAGE_SIZE = 12;
  const entryNumber = channel => String(channel.n).padStart(6, '0');
  const STORE = 'mellow-mrg-console-channels-v2';
  const VOTE = 'mellow-mrg-console-vote-v2';
  function loadChannels() {
    let saved = [];
    try {
      const current = localStorage.getItem(STORE);
      saved = current === null
        ? JSON.parse(localStorage.getItem('mellow-mrg-console-channels') || '[]').map(c => ({...c, n: c.n + DEMO_FILMS.length}))
        : JSON.parse(current);
      saved = saved.filter(c => Number.isInteger(c.n) && c.n > DEMO_FILMS.length && c.n <= 1000 && c.src);
    } catch { saved = []; }
    const capacity = Math.ceil((Math.max(DEMO_FILMS.length, ...saved.map(c => c.n)) + 1) / PAGE_SIZE) * PAGE_SIZE;
    const base = Array.from({length: capacity}, (_, i) => ({n: i + 1, callsign: null, src: null}));
    DEMO_FILMS.forEach((title, i) => {
      base[i] = {n: i + 1, title, callsign: 'CREW ' + String(i + 1).padStart(2, '0'), demo: true, src: parseSource('https://youtu.be/aqz-KE-bpKQ')};
    });
    saved.forEach(c => { base[c.n - 1] = {n: c.n, callsign: c.callsign, title: c.title, src: c.src}; });
    return base;
  }

  // --- hardware primitives ---
  function Screw({
    style
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: Object.assign({
        position: 'absolute',
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, ' + C.chassisHi + ', ' + C.chassisLo + ' 60%, ' + C.line + ')',
        outline: '1px solid ' + C.line
      }, style)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 1,
        right: 1,
        top: 3,
        height: 1,
        background: C.line,
        transform: 'rotate(38deg)'
      }
    }));
  }
  function Ruler() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: 8,
        margin: '0 2px',
        background: 'repeating-linear-gradient(90deg, ' + C.line + ' 0 1px, transparent 1px 7px)',
        opacity: 0.55
      }
    });
  }
  function Groove() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: 0,
        borderTop: '1px solid ' + C.chassisLo,
        borderBottom: '1px solid ' + C.chassisHi,
        margin: '2px 0'
      }
    });
  }
  function Vents({
    n = 5
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, Array.from({
      length: n
    }).map((_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        height: 2,
        background: C.chassisLo,
        borderBottom: '1px solid ' + C.chassisHi
      }
    })));
  }
  function Led({
    on,
    color
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        flexShrink: 0,
        borderRadius: '50%',
        outline: '1px solid ' + C.line,
        background: on ? color || C.green : '#3a3d33',
        boxShadow: on ? '0 0 4px ' + (color || C.green) : 'none'
      }
    });
  }
  function Readout({
    tag,
    val,
    color,
    width
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 7
      })
    }, tag), /*#__PURE__*/React.createElement("span", {
      style: Object.assign({}, bevelIn, {
        display: 'block',
        background: C.screen,
        color: color || C.green,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.08em',
        padding: '2px 6px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width
      })
    }, val));
  }
  function Key({
    children,
    on,
    dim,
    onClick,
    wide,
    tall,
    disabled = false
  }) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
      disabled,
      style: Object.assign({}, on ? bevelIn : bevelOut, {
        appearance: 'none',
        cursor: 'pointer',
        padding: wide ? '5px 10px' : tall ? '8px 0' : '4px 0',
        minWidth: wide ? 0 : 24,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        background: on ? C.ink : 'linear-gradient(180deg, ' + C.chassisHi + ', ' + C.chassis + ' 45%, ' + C.well + ')',
        color: on ? C.green : dim ? '#8d887b' : C.ink,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase'
      })
    }, children);
  }
  function Glass({
    children,
    radius = 14
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        background: C.screen,
        borderRadius: radius,
        overflow: 'hidden',
        outline: '1px solid #000',
        flex: 1
      }
    }, children, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        borderRadius: radius,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        borderRadius: radius,
        background: 'radial-gradient(ellipse 120% 105% at 50% 48%, transparent 62%, rgba(0,0,0,0.55) 100%)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        borderRadius: radius,
        background: 'linear-gradient(112deg, rgba(255,255,255,0.10) 0%, transparent 22%)'
      }
    }));
  }
  function Bezel({
    children,
    pad = 10
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'linear-gradient(180deg, ' + C.bezel + ', ' + C.bezelDark + ')',
        borderRadius: 8,
        padding: pad,
        outline: '1px solid ' + C.line,
        display: 'flex',
        flex: 1,
        minHeight: 0,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)'
      }
    }, children);
  }
  window.RockGamesConsole = function RockGamesConsole() {
    const API = 'https://mellow-judging-production.up.railway.app';
    const [contest, setContest] = React.useState(null);
    const [busy, setBusy] = React.useState(false);
    const sending = React.useRef(false);
    const pending = React.useRef(null);
    const [filmTitle, setFilmTitle] = React.useState('');
    const [duration, setDuration] = React.useState('');
    const [consent, setConsent] = React.useState(false);
    const [connectionError, setConnectionError] = React.useState('');
    async function connect() {
      try {
        const response = await fetch(API + '/api/public/contest', {credentials: 'omit', cache: 'no-store'});
        if (!response.ok) throw new Error('Entry desk unavailable. Reconnect to try again.');
        setContest(await response.json()); setConnectionError('');
      } catch (error) { setConnectionError(error.message); }
    }
    React.useEffect(() => { connect(); }, []);
    const [channels, setChannels] = React.useState(loadChannels);
    const [active, setActive] = React.useState(() => {
      const c = loadChannels();
      const f = c.find(x => x.src);
      return f ? f.n : 1;
    });
    const [feedPage, setFeedPage] = React.useState(0);
    const [tape, setTape] = React.useState('');
    const [editing, setEditing] = React.useState(false);
    const [preview, setPreview] = React.useState(null);
    const playing = !!preview;
    const playChannel = channel => setPreview(channel.src ? {source: channel.src, key: crypto.randomUUID(), label: channel.title || entryNumber(channel)} : null);
    const [previewError, setPreviewError] = React.useState('');
    const editField = (setter, value) => { setEditing(true); setter(value); };
    const [callsign, setCallsign] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [termLines, setTermLines] = React.useState(['MRG ENTRY TERMINAL v1.0', 'READY.', 'INSERT TAPE TO BEGIN_']);
    const [typed, setTyped] = React.useState(0);
    const [blink, setBlink] = React.useState(true);
    React.useEffect(() => {
      const t = setInterval(() => setBlink(b => !b), 530);
      return () => clearInterval(t);
    }, []);
    React.useEffect(() => {
      setTyped(0);
      const total = termLines.join('').length;
      const t = setInterval(() => setTyped(n => {
        if (n >= total) {
          clearInterval(t);
          return n;
        }
        return n + 2;
      }), 18);
      return () => clearInterval(t);
    }, [termLines]);
    const [voted, setVoted] = React.useState(() => {
      try {
        return localStorage.getItem(VOTE);
      } catch (e) {
        return null;
      }
    });
    const [clock, setClock] = React.useState('--:--:--');
    React.useEffect(() => {
      const t = setInterval(() => setClock(new Date().toISOString().slice(11, 19)), 1000);
      return () => clearInterval(t);
    }, []);
    const ch = channels[active - 1];
    const parsed = parseSource(tape);
    const nextSlot = channels.find(c => !c.src) || channels[active - 1];
    const durationMatch = duration.match(/^(\d{1,2}):([0-5]\d)$/);
    const durationSeconds = durationMatch ? Number(durationMatch[1]) * 60 + Number(durationMatch[2]) : 0;
    const ready = !!parsed && !!filmTitle.trim() && !!callsign.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && durationSeconds >= 180 && durationSeconds <= 600 && consent && !!contest?.accepting && !busy;
    const liveLines = [
      'MRG ENTRY TERMINAL v1.0',
      '> YOUTUBE: ' + tape,
      '> TEAM: ' + callsign,
      '> EMAIL: ' + email,
      '> FILM: ' + filmTitle,
      '> LENGTH: ' + duration,
      '> PERMISSION: ' + (consent ? 'CONFIRMED' : 'AWAITING CONFIRMATION'),
      '',
      previewError || (preview ? 'TAPE PREVIEW PLAYING · COMPLETE DETAILS TO SUBMIT_' : parsed ? 'SIGNAL READY · PRESS ENTER TO PLAY PREVIEW_' : 'PASTE A YOUTUBE LINK, THEN PRESS ENTER_')
    ];
    const playPreview = event => {
      if (event.key !== 'Enter' || event.nativeEvent?.isComposing || busy) return;
      event.preventDefault();
      setEditing(true);
      if (!parsed) { setPreview(null); setPreviewError('INVALID SIGNAL · ENTER A VALID YOUTUBE LINK_'); return; }
      setPreviewError('');
      // Remount on each Enter, including replaying the same link.
      setPreview({source: parsed, key: crypto.randomUUID()});
    };
    const filled = channels.filter(c => c.src);
    const pageCount = Math.ceil(channels.length / PAGE_SIZE);
    const visibleChannels = channels.slice(feedPage * PAGE_SIZE, (feedPage + 1) * PAGE_SIZE);
    const commit = list => {
      if (!list.some(c => !c.src)) list = list.concat(Array.from({length: PAGE_SIZE}, (_, i) => ({n: list.length + i + 1, callsign: null, src: null})));
      setChannels(list);
      try {
        localStorage.setItem(STORE, JSON.stringify(list.filter(c => c.src && !c.demo)));
      } catch (e) {}
    };
    const loadTape = async () => {
      if (!ready || sending.current) return;
      sending.current = true; setBusy(true); setEditing(false);
      setTermLines(['> LOAD TAPE', 'TRANSMITTING TO JUDGING ROOM...', 'PLEASE WAIT_']);
      const payload = {contestId: contest.contestId, title: filmTitle.trim(), team: callsign.trim(), contactEmail: email.trim(), videoUrl: tape.trim(), durationSeconds, consent, website: ''};
      const fingerprint = JSON.stringify(payload);
      if (pending.current?.fingerprint !== fingerprint) pending.current = {fingerprint, requestId: crypto.randomUUID()};
      try {
        const response = await fetch(API + '/api/public/submissions', {
          method: 'POST', credentials: 'omit', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({...payload, requestId: pending.current.requestId})
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Your film was not received. Try again.');
        commit(channels.map(c => c.n === nextSlot.n ? {n: c.n, callsign: callsign.toUpperCase().slice(0, 12), title: filmTitle.trim(), src: parsed} : c));
        setActive(nextSlot.n); setFeedPage(Math.floor((nextSlot.n - 1) / PAGE_SIZE));
        setPreview(null); setPreviewError('');
        setTape(''); setCallsign(''); setEmail(''); setFilmTitle(''); setDuration(''); setConsent(false);
        pending.current = null;
        setTermLines(['> LOAD TAPE', 'TRANSMISSION ........ OK', 'FILM: ' + payload.title, 'CREW: ' + payload.team, '', '*** ENTRY RECEIVED ***', 'PENDING ORGANIZER REVIEW', 'RECEIPT: ' + result.receipt, '', 'DEMO ENTRY · NO EMAIL SENT', 'READY._']);
      } catch (error) {
        setTermLines(['> TRANSMISSION NOT CONFIRMED', error.message === 'Failed to fetch' ? 'CONNECTION INTERRUPTED. RETRY LOAD TAPE.' : error.message, 'YOUR DETAILS ARE STILL HERE.', 'RETRIES USE THE SAME RECEIPT REQUEST._']);
      } finally { sending.current = false; setBusy(false); }
    };
    const fieldStyle = Object.assign({}, bevelIn, {width: '100%', boxSizing: 'border-box', background: C.screen, color: C.green, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', padding: '6px 8px'});
    const detailField = (label, value, change, props = {}) => React.createElement('label', {style: {display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0}},
      React.createElement('span', {style: lbl({fontSize: 7})}, label),
      React.createElement('input', {value, onChange: e => editField(change, e.target.value), disabled: busy, style: fieldStyle, ...props}));
    const eject = () => {
      if (ch.demo) { setPreview(null); return; }
      commit(channels.map(c => c.n === active ? {
        n: c.n,
        callsign: null,
        src: null
      } : c));
      setPreview(null);
    };
    const vote = () => {
      if (voted || !ch.src) return;
      try {
        localStorage.setItem(VOTE, String(ch.n));
      } catch (e) {}
      setVoted(String(ch.n));
    };
    // The main screen is reserved for the background broadcast.
    const screenBody = /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "crt-static",
      style: {
        position: 'absolute',
        inset: 0,
        opacity: 0.45
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: '46%',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        letterSpacing: '0.34em',
        color: C.crt,
        textShadow: '0 0 6px rgba(169,192,214,0.8)'
      }
    }, 'BROADCAST STANDBY'));
    return /*#__PURE__*/React.createElement("div", {
      "data-m": "console-pad",
      className: "rg-tv-connected",
      style: {
        padding: 'var(--page-pad)',
        minHeight: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: Object.assign({}, bevelOut, {
        position: 'relative',
        background: 'linear-gradient(180deg, ' + C.chassisHi + ' 0%, ' + C.chassis + ' 3%, ' + C.chassis + ' 97%, ' + C.well + ' 100%)',
        padding: '14px 12px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      })
    }, /*#__PURE__*/React.createElement(Screw, {
      style: {
        top: 4,
        left: 4
      }
    }), /*#__PURE__*/React.createElement(Screw, {
      style: {
        top: 4,
        right: 4
      }
    }), /*#__PURE__*/React.createElement(Screw, {
      style: {
        bottom: 4,
        left: 4
      }
    }), /*#__PURE__*/React.createElement(Screw, {
      style: {
        bottom: 4,
        right: 4
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 9,
        fontWeight: 700
      })
    }, "MRG \xB7 MELLOW ROCK GAMES \u2014 BROADCAST TERMINAL"), /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 9
      })
    }, contest ? (contest.accepting ? 'UNIT 07 · CONNECTED DEMO' : 'UNIT 07 · ROUND CLOSED') : 'UNIT 07 · CONNECTING')), /*#__PURE__*/React.createElement(Groove, null), /*#__PURE__*/React.createElement("div", {
      "data-m": "console-row",
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: Object.assign({}, bevelIn, {
        flex: '2 1 360px',
        minWidth: 320,
        background: C.chassis,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      })
    }, /*#__PURE__*/React.createElement(Ruler, null), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'flex-end',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Readout, {
      tag: "UTC",
      val: clock
    }), /*#__PURE__*/React.createElement(Readout, {
      tag: "CH",
      val: String(active).padStart(2, '0')
    }), /*#__PURE__*/React.createElement(Readout, {
      tag: "ENTRY",
      val: ch.src ? entryNumber(ch) : '\u2014\u2014\u2014',
      color: C.crt
    }), /*#__PURE__*/React.createElement(Readout, {
      tag: "SIG",
      val: ch.src ? playing ? 'LOCK' : 'STBY' : 'NULL',
      color: ch.src ? C.green : C.amber
    })), /*#__PURE__*/React.createElement(Bezel, null, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '4 / 3',
        width: '100%',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(Glass, null, screenBody))), /*#__PURE__*/React.createElement(Ruler, null), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Key, {
      wide: true,
      on: playing && !!ch.src,
      onClick: () => playChannel(ch)
    }, '\u25b8', " PLAY"), /*#__PURE__*/React.createElement(Key, {
      wide: true,
      on: !playing,
      onClick: () => setPreview(null)
    }, '\u25a0', " STOP"), /*#__PURE__*/React.createElement(Key, {
      wide: true,
      dim: !ch.src,
      onClick: eject
    }, '\u23cf', " EJECT"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        gap: 5,
        alignItems: 'center',
        marginLeft: 'auto',
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement(Led, {
      on: !!ch.src && playing
    }), " ", /*#__PURE__*/React.createElement("span", {
      style: lbl()
    }, "LOCK"), /*#__PURE__*/React.createElement(Led, {
      on: !!ch.src && !playing,
      color: C.amber
    }), " ", /*#__PURE__*/React.createElement("span", {
      style: lbl()
    }, "STBY")))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: '1 1 250px',
        minWidth: 250,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: Object.assign({}, bevelIn, {
        background: C.chassis,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      })
    }, /*#__PURE__*/React.createElement("span", {
      style: lbl()
    }, "ENTRY LOG"), /*#__PURE__*/React.createElement(Bezel, {
      pad: 6
    }, /*#__PURE__*/React.createElement(Glass, {
      radius: 8
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 3,
        height: 74,
        padding: '8px 10px 10px',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(169,192,214,0.13) 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, rgba(169,192,214,0.13) 0 1px, transparent 1px 14px)'
      }
    }), visibleChannels.map(c => /*#__PURE__*/React.createElement("span", {
      key: c.n,
      style: {
        flex: 1,
        height: c.src ? 18 + c.n % 4 * 12 : 3,
        background: c.n === active ? C.green : c.src ? C.crt : 'rgba(169,192,214,0.25)',
        boxShadow: c.src ? '0 0 4px rgba(169,192,214,0.6)' : 'none'
      }
    }))))), /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 7
      })
    }, "DEMO FILMS 50 · YOUR TAPES ", filled.filter(c => !c.demo).length)), /*#__PURE__*/React.createElement("div", {
      style: Object.assign({}, bevelIn, {
        background: C.chassis,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flex: 1
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lbl()
    }, "FEED REGISTER"), /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 7
      })
    }, filled.length, " LOADED · ", feedPage * PAGE_SIZE + 1, "–", Math.min((feedPage + 1) * PAGE_SIZE, channels.length))), /*#__PURE__*/React.createElement("div", {
      style: Object.assign({}, bevelIn, {
        background: C.screen,
        padding: 6,
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3px 10px',
        alignContent: 'start'
      })
    }, visibleChannels.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.n,
      type: 'button',
      'aria-label': 'Entry ' + entryNumber(c) + (c.src ? ': ' + (c.title || 'Your tape') : ': Empty'),
      'aria-pressed': c.n === active,
      title: c.demo ? c.title + ' · Fictional demo / shared sample footage' : c.title || 'Empty channel',
      onClick: () => {
        setActive(c.n);
        playChannel(c);
      },
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 6,
        padding: '5px 4px',
        appearance: 'none',
        border: 0,
        textAlign: 'left',
        minWidth: 0,
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.08em',
        color: c.n === active ? C.green : c.src ? C.crt : '#39434e',
        background: c.n === active ? 'rgba(159,208,138,0.12)' : 'transparent',
        borderBottom: '1px solid rgba(169,192,214,0.12)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, entryNumber(c), c.src ? '' : ' —',
      c.title && React.createElement('span', {style: {display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 3, fontSize: 8, opacity: .8}}, c.title)), /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0
      }
    }, voted === String(c.n) ? '●' : c.src ? '○' : '')))),
    React.createElement('div', {style: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8}},
      React.createElement(Key, {wide: true, disabled: feedPage === 0, onClick: () => setFeedPage(p => p - 1)}, '← PREV'),
      React.createElement('span', {style: lbl({fontSize: 8})}, 'PAGE ' + (feedPage + 1) + ' / ' + pageCount),
      React.createElement(Key, {wide: true, disabled: feedPage === pageCount - 1, onClick: () => setFeedPage(p => p + 1)}, 'NEXT →')
    ), React.createElement('span', {style: lbl({fontSize: 7, whiteSpace: 'normal', lineHeight: 1.5})}, '50 FICTIONAL APPLICANTS · SHARED SAMPLE FOOTAGE'),
    /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(Key, {
      wide: true,
      dim: !ch.src || !!voted,
      on: voted === String(active),
      onClick: vote
    }, voted === String(active) ? '● VOTED' : voted ? 'VOTE USED' : '● VOTE CH ' + String(active).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 7,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      })
    }, "\u25CF = YOUR VOTE \xB7 ONE PER TERMINAL"))))), /*#__PURE__*/React.createElement(Groove, null), /*#__PURE__*/React.createElement("div", {
      "data-m": "console-row",
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: Object.assign({}, bevelIn, {
        flex: '1 1 330px',
        minWidth: 300,
        background: C.chassis,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lbl()
    }, "SUBMIT YOUR ENTRY"), /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 7,
        color: '#77725f'
      })
    }, parsed ? 'ASSIGNS CH ' + (nextSlot ? String(nextSlot.n).padStart(2, '0') : '\u2014 BOARD FULL') : 'YOUTUBE LINK · DEMO ENTRY')), /*#__PURE__*/React.createElement("div", {
      className: "rg-tv-entry-grid",
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 55%) minmax(0, 1fr)',
        gap: 12,
        alignItems: 'stretch'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 7
      })
    }, preview?.label ? "APPLICANT · " + preview.label : "TAPE PREVIEW"), /*#__PURE__*/React.createElement(Bezel, {
      pad: 8
    }, /*#__PURE__*/React.createElement(Glass, {
      radius: 10
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '16 / 9',
        width: '100%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, preview && (preview.source.type === 'file' ? React.createElement('video', {
      key: preview.key, src: preview.source.src, controls: true, autoPlay: true,
      style: {width: '100%', height: '100%', objectFit: 'contain'}
    }) : /*#__PURE__*/React.createElement("iframe", {
      key: preview.key,
      src: preview.source.embed,
      title: "tape preview",
      frameBorder: "0",
      allow: "autoplay; encrypted-media; fullscreen",
      allowFullScreen: true,
      style: {
        width: '100%', height: '100%', border: 'none', display: 'block'
      }
    })), !preview && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.3em',
        color: C.crt
      }
    }, parsed ? "PRESS ENTER TO PLAY" : "PREVIEW")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 5,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Led, {
      on: !!preview || !!parsed
    }), " ", /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 7
      })
    }, preview ? 'PLAYING ON LOWER SCREEN' : parsed ? 'SIGNAL VERIFIED' : 'AWAITING SIGNAL'))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 7
      })
    }, "YOUTUBE LINK"), /*#__PURE__*/React.createElement("input", {
      value: tape,
      "aria-label": "YouTube link",
      disabled: busy,
      onChange: e => { editField(setTape, e.target.value); setPreview(null); setPreviewError(''); },
      onKeyDown: playPreview,
      placeholder: "HTTPS://YOUTU.BE/\u2026",
      spellCheck: "false",
      style: Object.assign({}, bevelIn, {
        width: '100%',
        boxSizing: 'border-box',
        background: C.screen,
        color: C.green,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.06em',
        padding: '6px 8px',
        outline: 'none'
      })
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 7
      })
    }, "TEAM / CALLSIGN"), /*#__PURE__*/React.createElement("input", {
      value: callsign,
      "aria-label": "Team or callsign",
      disabled: busy,
      onChange: e => editField(setCallsign, e.target.value),
      placeholder: "YOUR NAME",
      spellCheck: "false",
      maxLength: 120,
      style: Object.assign({}, bevelIn, {
        width: '100%',
        boxSizing: 'border-box',
        background: C.screen,
        color: C.green,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.06em',
        padding: '6px 8px',
        outline: 'none'
      })
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 7
      })
    }, "EMAIL"), /*#__PURE__*/React.createElement("input", {
      value: email,
      "aria-label": "Contact email",
      disabled: busy,
      onChange: e => editField(setEmail, e.target.value),
      placeholder: "YOU@EMAIL.COM",
      spellCheck: "false",
      type: "email",
      style: Object.assign({}, bevelIn, {
        width: '100%',
        boxSizing: 'border-box',
        background: C.screen,
        color: C.green,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.06em',
        padding: '6px 8px',
        outline: 'none'
      })
    }))), React.createElement('div', {style: {display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 90px', gap: 6}},
      detailField('FILM TITLE', filmTitle, setFilmTitle, {placeholder: 'YOUR FILM', maxLength: 160}),
      detailField('LENGTH · 3–10 MIN', duration, setDuration, {placeholder: 'MM:SS', maxLength: 5, 'aria-label': 'Film length in minutes and seconds'})
    ), React.createElement('label', {style: {...lbl({fontSize: 8, whiteSpace: 'normal', lineHeight: 1.5}), display: 'flex', alignItems: 'flex-start', gap: 5}},
      React.createElement('input', {type: 'checkbox', checked: consent, disabled: busy, onChange: e => editField(setConsent, e.target.checked), style: {margin: 0, accentColor: C.ink}}),
      'I HAVE PERMISSION TO SUBMIT THIS FILM. THIS IS A DEMO ENTRY.'
    ), connectionError && React.createElement('div', {role: 'alert', style: lbl({whiteSpace: 'normal', color: '#802a1d'})}, connectionError,
      React.createElement(Key, {wide: true, onClick: connect}, 'RECONNECT')),
    contest && !contest.accepting && React.createElement('div', {role: 'status', style: lbl({whiteSpace: 'normal'})}, 'THIS ROUND IS CLOSED.'),
    /*#__PURE__*/React.createElement(Key, {
      wide: true,
      dim: !ready,
      on: ready,
      disabled: !ready,
      onClick: loadTape
    }, busy ? 'TRANSMITTING…' : '\u2b07 LOAD TAPE'), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        flex: 1,
        minHeight: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 7
      })
    }, "TERMINAL"), /*#__PURE__*/React.createElement("div", {
      role: "status",
      "aria-label": "Submission terminal",
      style: Object.assign({}, bevelIn, {
        flex: 1,
        minHeight: 120,
        background: C.screen,
        padding: '10px 12px',
        position: 'relative',
        overflow: 'hidden'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 1px, transparent 1px 3px)'
      }
    }), /*#__PURE__*/React.createElement("pre", {
      style: {
        margin: 0,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        lineHeight: 1.55,
        letterSpacing: '0.08em',
        color: C.green,
        textShadow: '0 0 5px rgba(159,208,138,0.65)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
      }
    }, editing ? liveLines.join('\n') : (() => {
      let n = typed,
        out = [];
      for (const l of termLines) {
        if (n <= 0) break;
        out.push(l.slice(0, n));
        n -= l.length;
      }
      return out.join('\n');
    })(), /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: blink ? 1 : 0
      }
    }, '\u2588')))))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 2px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 7
      })
    }, "SER NO 1994-MRG-07"), /*#__PURE__*/React.createElement("span", {
      style: lbl({
        fontSize: 7
      })
    }, "ENTRIES SENT TO JUDGES · CHANNELS + VOTES ARE LOCAL PREVIEWS"))));
  };
})();
