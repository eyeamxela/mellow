/* Public demo integration. No privileged credentials belong in this file. */
(() => {
  const API = 'https://mellow-judging-production.up.railway.app';
  const h = React.createElement;
  window.RockGamesConsole = function ConnectedRockGames() {
    const [contest, setContest] = React.useState(null);
    const [error, setError] = React.useState('');
    const [busy, setBusy] = React.useState(false);
    const [receipt, setReceipt] = React.useState(null);
    const [requestId, setRequestId] = React.useState(() => crypto.randomUUID());
    const [values, setValues] = React.useState({title:'',team:'',contactEmail:'',videoUrl:'',location:'',minutes:'4',seconds:'00',description:'',consent:false,website:''});
    const loadContest = () => fetch(API+'/api/public/contest',{credentials:'omit',cache:'no-store'}).then(async response => {
      if (!response.ok) throw new Error('The entry desk is temporarily unavailable. Please try again.');
      setContest(await response.json()); setError('');
    }).catch(e => setError(e.message));
    React.useEffect(() => { loadContest(); }, []);
    const field = (name,label,props={}) => h('label',{className:'rg-field'},h('span',null,label),h('input',{name,value:values[name],onChange:e=>setValues(v=>({...v,[name]:e.target.value})),...props}));
    async function submit(event) {
      event.preventDefault();if(busy||!contest?.accepting)return;
      setBusy(true);setError('');
      try {
        const response=await fetch(API+'/api/public/submissions',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({
          ...values,requestId,contestId:contest.contestId,durationSeconds:Number(values.minutes)*60+Number(values.seconds)
        })});
        const data=await response.json();if(!response.ok)throw new Error(data.error||'Your entry could not be received.');
        setReceipt(data);
      } catch(e) { setError(e.message==='Failed to fetch'?'Connection interrupted. Your details are still here. Retry to safely check the same submission.':e.message); }
      finally { setBusy(false); }
    }
    return h('section',{className:'rg-connected',id:'submit-film','aria-label':'Rock Games demo submission'},
      h('div',{className:'rg-terminal-top'},h('span',null,'MRG / ENTRY DESK'),h('span',null,contest?'● CONNECTED':'○ CONNECTING')),
      h('div',{className:'rg-screen'},h('div',{className:'rg-kicker'},'CLIMBING. FILMMAKING. COMMUNITY.'),h('h2',null,receipt?'Your film is in.':'Every good story\nstarts outside.'),h('p',null,receipt?'Received by the judging room. Your entry is waiting for an organizer’s eligibility check.':'Bring the crew. Tell the story. Send your YouTube link to the Rock Games judging room.'),h('div',{className:'rg-screen-line'},'01 / SUBMIT  →  02 / REVIEW  →  03 / JUDGE')),
      h('div',{className:'rg-form-wrap'},
        h('div',{className:'rg-section-head'},h('strong',null,receipt?'Submission received':'Load your film.'),h('span',null,'CONNECTED DEMO')),
        h('p',{className:'rg-help'},'Demo entries only. This rehearsal is separate from the official contest. YouTube links · 3–10 minutes · one film per team per round.'),
        receipt ? h('div',{className:'rg-receipt',role:'status'},h('span',{className:'rg-kicker'},'SAVED TO THE JUDGING ROOM'),h('h3',null,values.title),h('p',null,values.team+' / Pending eligibility review'),h('p',null,'Receipt'),h('code',null,receipt.receipt),h('p',{className:'rg-help'},'Keep this receipt for the demo. A confirmation email is not sent. Judges will see your film after the organizer approves and assigns it.'),h('button',{className:'rg-submit',type:'button',onClick:()=>{setReceipt(null);setRequestId(crypto.randomUUID());setValues(v=>({...v,title:'',team:'',videoUrl:'',description:'',consent:false}));loadContest();}},'Submit another demo film ↗')) :
        h('form',{onSubmit:submit},h('fieldset',{disabled:busy},
          field('title','Film title',{required:true,maxLength:160,placeholder:'A story worth telling'}),
          h('div',{className:'rg-form-grid'},field('team','Team / crew name',{required:true,maxLength:120,placeholder:'Your crew'}),field('contactEmail','Contact email',{type:'email',required:true,maxLength:254,autoComplete:'email',placeholder:'you@example.com'})),
          field('videoUrl','YouTube link',{type:'url',required:true,maxLength:500,placeholder:'https://www.youtube.com/watch?v=…'}),
          h('div',{className:'rg-form-grid'},field('location','Filming location',{maxLength:160,placeholder:'Place, country'}),h('div',{className:'rg-duration'},field('minutes','Minutes',{type:'number',min:3,max:10,required:true}),field('seconds','Seconds',{type:'number',min:0,max:59,required:true}))),
          h('label',{className:'rg-field'},h('span',null,'A little about the film'),h('textarea',{name:'description',maxLength:3000,value:values.description,onChange:e=>setValues(v=>({...v,description:e.target.value})),rows:3,placeholder:'What brought this story together?'})),
          h('label',{className:'rg-honey','aria-hidden':'true'},'Website',h('input',{name:'website',tabIndex:-1,autoComplete:'off',value:values.website,onChange:e=>setValues(v=>({...v,website:e.target.value}))})),
          h('label',{className:'rg-consent'},h('input',{type:'checkbox',required:true,checked:values.consent,onChange:e=>setValues(v=>({...v,consent:e.target.checked}))}),h('span',null,'I have permission to submit this film and understand this is a demo entry.')),
          error&&h('p',{className:'rg-error',role:'alert'},error),
          !contest&&h('button',{type:'button',className:'rg-retry',onClick:loadContest},'Reconnect to entry desk ↻'),
          contest&&!contest.accepting&&h('p',{role:'status'},'This round is closed. The organizer can open a new rehearsal round.'),
          h('button',{className:'rg-submit',type:'submit',disabled:busy||!contest?.accepting},busy?'Sending your film…':'Send to the judging room ↗'),
          h('p',{className:'rg-help'},'Your email stays private. Film length is declared here and checked by the organizer. No video files are uploaded.')
        ))),h('div',{className:'rg-terminal-bottom'},h('span',null,contest?.name||'Mellow Rock Games'),h('span',null,'KEEP IT HUMAN.')));
  };
})();
