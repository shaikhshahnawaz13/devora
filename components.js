// DEVORA — UI Components

// ── ICONS ─────────────────────────────────────────────────────────────────
const IC={
  logo:'<rect x="2" y="2" width="5" height="18" rx="1.5" fill="var(--acc)"/><rect x="2" y="2" width="13" height="5" rx="1.5" fill="var(--acc)"/><rect x="2" y="15" width="13" height="5" rx="1.5" fill="var(--acc)"/><rect x="8" y="6" width="10" height="3" rx="1" fill="var(--grn)"/><rect x="8" y="10.5" width="8" height="3" rx="1" fill="var(--grn)" opacity=".5"/><rect x="8" y="15.5" width="10" height="3" rx="1" fill="var(--grn)"/>',
  search:'<circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  settings:'<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2" fill="none"/>',
  user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>',
  fork:'<circle cx="12" cy="18" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="18" cy="6" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M6 9v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9" stroke="currentColor" stroke-width="2" fill="none"/>',
  x:'<path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  back:'<path d="m15 18-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  ext:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><polyline points="15 3 21 3 21 9" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
  database:'<ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" stroke="currentColor" stroke-width="2" fill="none"/>',
  api:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
  ai:'<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
  test:'<polyline points="9 11 12 14 22 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
  docker:'<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2" fill="none"/>',
  ci:'<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" stroke="currentColor" stroke-width="2" fill="none"/>',
  ts:'<polyline points="16 18 22 12 16 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><polyline points="8 6 2 12 8 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
  rt:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>',
  state:'<polyline points="1 4 1 10 7 10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M3.51 15a9 9 0 1 0 .49-4.95" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
  chart:'<line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  trending:'<polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  map:'<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
  repo:'<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
  spinner:'<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  check:'<path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>',
  info:'<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  dash:'<rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" fill="none" rx="1"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" fill="none" rx="1"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" fill="none" rx="1"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" fill="none" rx="1"/>',
};
const ico=(name,sz=14,col='currentColor',cls='')=>`<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" style="color:${col};flex-shrink:0;display:inline-block;vertical-align:middle" class="${cls}">${IC[name]||''}</svg>`;
const logoSVG=(sz=22)=>`<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none">${IC.logo}</svg>`;

// ── SCORE RING ─────────────────────────────────────────────────────────────
function scoreRing(val,sz=110){
  const c=sCol(val),r=(sz/2)-9,circ=2*Math.PI*r,prog=(val/100)*circ;
  return`<div class="ring-wrap" style="width:${sz}px;height:${sz}px">
    <svg width="${sz}" height="${sz}" style="transform:rotate(-90deg)">
      <circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="var(--s3)" stroke-width="6"/>
      <circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="${c}" stroke-width="6" stroke-dasharray="${prog.toFixed(1)} ${circ.toFixed(1)}" stroke-linecap="round"/>
    </svg>
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
      <span style="font-family:var(--mono);font-size:${sz>130?24:sz>80?17:12}px;font-weight:700;color:${c}">${val}</span>
    </div>
  </div>`;
}

// ── SCORE BAR ──────────────────────────────────────────────────────────────
function scoreBar(label,val,desc){
  const c=sCol(val);
  return`<div style="margin-bottom:${desc?13:9}px">
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px">
      <span style="font-size:12px;font-weight:500;color:var(--text)">${label}</span>
      <span style="font-family:var(--mono);font-size:12px;font-weight:700;color:${c}">${val}</span>
    </div>
    <div class="bar-t" style="height:5px"><div class="bar-f" style="width:${val}%;background:${c}"></div></div>
    ${desc?`<p style="font-size:10px;color:var(--t3);margin-top:4px">${desc}</p>`:''}
  </div>`;
}
function miniBar(label,val){
  const c=sCol(val);
  return`<div style="margin-bottom:7px">
    <div style="display:flex;justify-content:space-between;margin-bottom:3px">
      <span style="font-size:11px;color:var(--t2)">${label}</span>
      <span style="font-family:var(--mono);font-size:11px;font-weight:700;color:${c}">${val}</span>
    </div>
    <div class="bar-t"><div class="bar-f" style="width:${val}%;background:${c}"></div></div>
  </div>`;
}

// ── FILE CHECK ─────────────────────────────────────────────────────────────
function fileCheck(f){
  const ok='<path d="M20 6 9 17l-5-5" stroke="var(--grn)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
  const no='<path d="M18 6 6 18M6 6l12 12" stroke="var(--t3)" stroke-width="1.5" stroke-linecap="round" fill="none"/>';
  const row=(l,v)=>`<div class="fc ${v?'ok':'no'}"><svg width="10" height="10" viewBox="0 0 24 24">${v?ok:no}</svg><span>${l}</span></div>`;
  return`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px 6px">
    ${row('README',f.r)}${row('LICENSE',f.l)}${row('.gitignore',f.g)}
    ${row('Tests',f.t)}${row('CI/CD',f.ci)}${row('Deps',f.dep)}
    ${row('Deployed',f.deploy)}${row('src/',f.src)}${row('Config',f.cfg)}
  </div>`;
}

// ── DEPTH BADGES ───────────────────────────────────────────────────────────
function depthBadges(sigs){
  if(!sigs.length)return`<p style="font-size:11px;color:var(--t3);font-style:italic">No advanced signals detected.</p>`;
  const imap={lock:'lock',database:'database',api:'api',ai:'ai',test:'test',docker:'docker',ci:'ci',ts:'ts',rt:'rt',state:'state'};
  return`<div style="display:flex;flex-wrap:wrap;gap:5px">${sigs.map(s=>`<span class="db">${ico(imap[s.icon]||'check',11,'var(--acc2)')} ${s.label}</span>`).join('')}</div>`;
}

// ── LANG BAR ───────────────────────────────────────────────────────────────
function langBar(scored){
  const map={};scored.forEach(r=>{if(r.language)map[r.language]=(map[r.language]||0)+1;});
  const total=Object.values(map).reduce((a,b)=>a+b,0)||1;
  const sorted=Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,8);
  if(!sorted.length)return`<p style="font-size:11px;color:var(--t3)">No language data.</p>`;
  return`<div class="lb" style="margin-bottom:12px">${sorted.map(([l,c])=>`<div style="width:${(c/total*100).toFixed(1)}%;background:${langColor(l)};min-width:2px" title="${l}: ${c} repo${c>1?'s':''}"></div>`).join('')}</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:7px">
    ${sorted.map(([l,c])=>{const pct=(c/total*100).toFixed(0);return`<div class="card-flat">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
        <div style="width:7px;height:7px;border-radius:2px;background:${langColor(l)};flex-shrink:0"></div>
        <span style="font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${l}</span>
      </div>
      <div style="font-family:var(--mono);font-size:15px;font-weight:700">${c}</div>
      <div style="font-size:10px;color:var(--t3);margin-bottom:4px">${pct}%</div>
      <div class="bar-t" style="height:2px"><div class="bar-f" style="width:${pct}%;background:${langColor(l)}"></div></div>
    </div>`;}).join('')}
  </div>`;
}

// ── PENTAGON RADAR ─────────────────────────────────────────────────────────────
const PENTA_META = {
  reputation:{ label:'Reputation', color:'#f59e0b', desc:'Stars, forks and followers. High community engagement = high score.', improve:'Share projects on Reddit, LinkedIn and dev.to to earn stars.' },
  activity:  { label:'Activity',   color:'#34d399', desc:'Recency of commits, active repo ratio in last 6 months, and account age.', improve:'Aim for 3–5 commits every week to maximise this score.' },
  depth:     { label:'Depth',      color:'#f87171', desc:'Technical signals found: Auth, Database, API, Docker, CI/CD, TypeScript, AI/ML, Real-time, Testing, State Mgmt.', improve:'Add a database or authentication layer to a project — biggest depth boost.' },
  diversity: { label:'Diversity',  color:'#a78bfa', desc:'Variety of programming languages and project types across your repos.', improve:'Build one project in a second language (Python, Go) to raise this quickly.' },
  quality:   { label:'Quality',    color:'#60a5fa', desc:'Average documentation health: README, LICENSE, .gitignore, tests, CI/CD, deployment.', improve:'Add README, LICENSE and deploy every project — these three alone make a big difference.' }
};

function pentagonRadar(scores){
  const keys=['reputation','activity','depth','diversity','quality'];
  const vals=keys.map(k=>Math.min(100,scores[k]||0));
  const cx=128,cy=120,r=70,n=5;
  const pt=(i,f)=>{
    const a=i*2*Math.PI/n - Math.PI/2;
    return{ x:+(cx+Math.cos(a)*r*f).toFixed(1), y:+(cy+Math.sin(a)*r*f).toFixed(1) };
  };
  const ps=(i,f)=>{ const p=pt(i,f); return p.x+','+p.y; };
  const grid=f=>'<polygon points="'+Array.from({length:n},(_,i)=>ps(i,f)).join(' ')+'" fill="none" stroke="var(--border)" stroke-width="1"/>';
  const axes=Array.from({length:n},(_,i)=>{
    const o=pt(i,1);
    return '<line x1="'+cx+'" y1="'+cy+'" x2="'+o.x+'" y2="'+o.y+'" stroke="var(--s3)" stroke-width="1"/>';
  }).join('');
  const labelsEl=keys.map((k,i)=>{
    const a=i*2*Math.PI/n - Math.PI/2;
    const lx=(cx+Math.cos(a)*(r+20)).toFixed(1);
    const ly=(cy+Math.sin(a)*(r+20)).toFixed(1);
    const ax=Math.cos(a);
    const anchor=ax>0.25?'start':ax<-0.25?'end':'middle';
    return '<text x="'+lx+'" y="'+ly+'" text-anchor="'+anchor+'" dominant-baseline="middle" font-size="9" fill="var(--t2)" font-family="Inter,sans-serif" font-weight="600">'+PENTA_META[k].label+'</text>';
  }).join('');
  const dataPoints=vals.map((v,i)=>ps(i,v/100)).join(' ');
  // DOTS ONLY — no text, no numbers. Numbers appear only on hover/click via JS tooltip.
  const dotsEl=vals.map((v,i)=>{
    const p=pt(i,v/100);
    const col=PENTA_META[keys[i]].color;
    const k=keys[i];
    return '<circle class="pv" cx="'+p.x+'" cy="'+p.y+'" r="6" fill="'+col+'" stroke="var(--bg)" stroke-width="2" style="cursor:pointer" onmouseenter="pvHover(event,\''+k+'\','+v+')" onmouseleave="pvLeave()" onclick="pvClick(event,\''+k+'\','+v+')" ontouchstart="pvTouch(event,\''+k+'\','+v+')"/>';
  }).join('');
  return '<div style="position:relative"><svg width="256" height="240" viewBox="0 0 256 240" style="max-width:100%;height:auto">'+grid(1)+grid(.66)+grid(.33)+axes+'<polygon points="'+dataPoints+'" fill="var(--acc)" fill-opacity="0.12" stroke="var(--acc)" stroke-width="1.5" stroke-linejoin="round"/>'+labelsEl+dotsEl+'</svg><p style="font-size:10px;color:var(--t3);text-align:center;margin-top:2px">Tap a dot to see details</p></div>';
}

// ── REPO CARD ──────────────────────────────────────────────────────────────
function repoCard(repo,rank,clickable,src){
  if(src) repo._src=src; // attach source for panel routing
  const{sc,sugg=[],f={},_type,_depthSigs=[]}=repo;
  const c=sCol(sc?.fin||0);
  return`<div class="card${clickable?' card-hover':''}" style="position:relative;overflow:hidden;padding:16px;cursor:${clickable?'pointer':'default'}" ${clickable?`onclick="openPanel('${repo.name}','${repo._src||''}')" tabindex="0"`:''}>
    <div style="position:absolute;top:0;left:0;right:0;height:1.5px;background:${c}"></div>
    <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap">
          ${rank!==undefined?`<div class="rnk" style="color:${RC[rank-1]}">#${rank}</div>`:''}
          <a href="${repo.html_url}" target="_blank" rel="noopener" style="font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;max-width:150px;color:var(--text)" onclick="event.stopPropagation()">${repo.name}</a>
          <span class="tch" style="color:${typeColor(_type)}">${typeLabel(_type)}</span>
        </div>
        <p style="font-size:11px;color:var(--t2);line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;min-height:26px">${repo.description||'No description'}</p>
      </div>
      ${scoreRing(sc?.fin||0,56)}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">
      ${repo.language?`<span class="tag" style="border-left:2px solid ${langColor(repo.language)}">${repo.language}</span>`:''}
      <span class="tag">${ico('star',9,'var(--ylw)')} ${repo.stargazers_count}</span>
      <span class="tag">${ico('fork',9,'var(--t3)')} ${repo.forks_count}</span>
      <span class="tag">${ago(repo.pushed_at)}</span>
      ${repo.fork?`<span class="badge b-yellow">Fork</span>`:''}
    </div>
    <div class="div" style="margin:0 0 10px"></div>
    ${miniBar('Quality',sc?.doc||0)}${miniBar('Activity',sc?.act||0)}${miniBar('Depth',sc?.depth||0)}${miniBar('Popularity',sc?.pop||0)}
    <div class="div" style="margin:10px 0"></div>
    ${fileCheck(f)}
    ${_depthSigs.length?`<div class="div" style="margin:9px 0 7px"></div>
    <p style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Technical Signals</p>
    ${depthBadges(_depthSigs)}`:''}
    ${sugg.length?`<div class="div" style="margin:9px 0 7px"></div>
    <p style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Suggestions (${sugg.length})</p>
    <div style="display:flex;flex-direction:column;gap:4px">${sugg.map(s=>{const cols={crit:'var(--red)',rec:'var(--ylw)',opt:'var(--acc2)'};return`<div class="chip"><div class="chip-dot" style="background:${cols[s.p]}"></div><span>${s.t}</span></div>`;}).join('')}</div>`:''}
    ${clickable?`<p style="font-size:11px;color:var(--acc2);margin-top:10px;text-align:right">${ico('eye',11,'var(--acc2)')} Full analysis</p>`:''}
  </div>`;
}

// ── NAVBAR ─────────────────────────────────────────────────────────────────
function navbar(opts={}){
  const cu=getCU();
  return`<nav class="nav">
    <!-- LEFT: hamburger (dashboard only) + logo -->
    <div style="display:flex;align-items:center;gap:7px;flex-shrink:0">
      ${opts.hamburger?`<button class="hamburger" onclick="toggleSidebar()" title="Open menu" aria-label="Open menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>`:''}
      ${opts.back?`<button class="btn-ghost-sm" onclick="handleBack()">${ico('back',13)} <span class="nav-back-label">Back</span></button>`:''}
      <div class="nav-logo" onclick="handleLogoClick()">
        <div class="logo-mark">${logoSVG(16)}</div>
        <span class="logo-name">Devora</span>
      </div>
    </div>
    <!-- MIDDLE: search bar -->
    ${opts.search?`<div class="nav-search">
      ${ico('search',13,'var(--t3)')}
      <input id="nav-q" type="text" placeholder="Search GitHub username" value="${opts.searchVal||''}" onkeydown="if(event.key==='Enter')navSearch()" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
    </div>`:''}
    <!-- RIGHT: theme + settings + user -->
    <div style="display:flex;align-items:center;gap:5px;flex-shrink:0">
      <button class="t-tog" onclick="doWave(event)" title="Toggle theme" aria-label="Toggle theme"><div class="t-knob"></div></button>
      <button class="btn-ghost-sm nav-settings-btn" onclick="openSettings()" aria-label="Settings">${ico('settings',13)}<span class="settings-label"> Settings</span></button>
      ${cu
        ?`<span class="nav-user-label">${cu.email.split('@')[0]}</span>
          <button class="btn-ghost-sm" style="color:var(--red)" onclick="handleSignOut()" aria-label="Sign out">${ico('logout',12,'var(--red)')}</button>`
        :`<button class="btn-ghost-sm" onclick="APP.goto('auth')" style="display:flex;align-items:center;gap:4px">${ico('user',12)} <span class="settings-label">Sign In</span></button>`
      }
    </div>
  </nav>`;
}

// ── SETTINGS MODAL ─────────────────────────────────────────────────────────
function settingsModal(){
  const cu=getCU(),ghUser=getCUGithubUsername();
  return`<div class="modal-bg" onclick="if(event.target===this)closeSettings()">
  <div class="modal" style="max-width:460px" onclick="event.stopPropagation()">
    <div class="modal-hdr">
      <div style="display:flex;align-items:center;gap:10px">
        ${logoSVG(16)}
        <div>
          <p style="font-size:14px;font-weight:700;line-height:1">Settings</p>
          <p style="font-size:10px;color:var(--t3);margin-top:1px">Devora configuration</p>
        </div>
      </div>
      <button class="btn-ghost-sm" onclick="closeSettings()">${ico('x',12)}</button>
    </div>

    ${cu?`
    <!-- ACCOUNT SECTION -->
    <div style="padding:16px 20px;border-bottom:1px solid var(--border)">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--acc-bg);border:1px solid var(--acc-border);display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico('user',16,'var(--acc2)')}</div>
        <div>
          <p style="font-size:13px;font-weight:600">${cu.email}</p>
          <p style="font-size:11px;color:var(--grn)">Signed in</p>
        </div>
      </div>
      <label style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.6px;display:block;margin-bottom:6px">GitHub Username</label>
      <div style="display:flex;gap:7px">
        <input id="st-ghuser" type="text" placeholder="e.g. shaikhshahnawaz13" value="${ghUser}" style="flex:1;font-family:var(--mono);font-size:13px">
        <button class="btn-sm" onclick="saveGhUser()">Save</button>
      </div>
      <p style="font-size:11px;color:var(--t3);margin-top:5px">Used to auto-load your personal dashboard after login.</p>
    </div>`:`
    <!-- NOT SIGNED IN -->
    <div style="padding:16px 20px;border-bottom:1px solid var(--border)">
      <div class="al al-info" style="margin-bottom:10px">Sign in to unlock AI insights, progress tracking, and your personal dashboard.</div>
      <button class="btn" onclick="closeSettings();APP.goto('auth')">Sign In or Create Account</button>
    </div>`}

    <!-- AI / GROQ SECTION -->
    <div style="padding:16px 20px;border-bottom:1px solid var(--border)">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        ${ico('ai',14,'var(--pur)')}
        <p style="font-size:13px;font-weight:600">Groq API Key</p>
        ${getGroqKey()?'<span class="badge b-green" style="margin-left:auto">Custom key set</span>':'<span class="badge b-yellow" style="margin-left:auto">Using built-in keys</span>'}
      </div>
      <div class="al al-warn" style="margin-bottom:10px;font-size:11px;line-height:1.6">
        <strong>Built-in keys may be rate-limited.</strong> If AI Insights shows an error, add your own free key below. Takes 60 seconds.
      </div>
      <input id="st-groq" type="password" placeholder="gsk_xxxx  — paste your Groq key here" value="${getGroqKey()}" style="margin-bottom:8px;font-family:var(--mono);font-size:12px">
      <div style="background:var(--s2);border:1px solid var(--border);border-radius:var(--r-sm);padding:10px 12px;font-size:11px;color:var(--t2);line-height:2">
        1. Open <a href="https://console.groq.com" target="_blank" style="color:var(--acc2);font-weight:600">console.groq.com</a><br>
        2. Sign up free → API Keys → Create new key<br>
        3. Copy the key (starts with <span class="code">gsk_</span>) → paste above → Save Settings
      </div>
    </div>

    <!-- GITHUB TOKEN SECTION -->
    <div style="padding:16px 20px;border-bottom:1px solid var(--border)">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        ${ico('repo',14,'var(--acc2)')}
        <p style="font-size:13px;font-weight:600">GitHub Token</p>
        <span class="badge b-acc" style="margin-left:auto">Optional</span>
      </div>
      <input id="st-gh" type="password" placeholder="ghp_xxxx  (optional — built-in token active)" value="${localStorage.getItem('dv_gh')||''}" style="margin-bottom:6px;font-family:var(--mono);font-size:12px">
      <p style="font-size:11px;color:var(--t3);line-height:1.65">A built-in token is active. Add yours for 5000 req/hr instead of 60. Get one at GitHub → Settings → Developer settings → Tokens (classic) → public_repo scope.</p>
    </div>

    <!-- SAVE BUTTON -->
    <div style="padding:14px 20px;display:flex;gap:8px;align-items:center">
      <button class="btn" onclick="saveSettings()" style="flex:1">Save Settings</button>
      ${cu?`<button class="btn-danger" onclick="handleSignOut()">Sign out</button>`:''}
    </div>
  </div></div>`;
}

// ── INSIGHT BLOCK ──────────────────────────────────────────────────────────
function insightBlock(title,items,col){
  const c=col==='green'?'var(--grn)':col==='red'?'var(--red)':'var(--acc2)';
  return`<div class="ib" style="border-top:1.5px solid ${c}">
    <div class="it" style="color:${c}">${title}</div>
    ${items.map((s,i)=>`<div class="ir"><div class="in-n">${i+1}</div><span>${s}</span></div>`).join('')}
  </div>`;
}

// ── ROADMAP VIEW ───────────────────────────────────────────────────────────
function roadmapView(rm,isAI,onEnhance){
  return`<div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <div class="sh" style="margin-bottom:0"><div class="sh-dot" style="background:var(--grn)"></div>Roadmap <span class="badge ${isAI?'b-purple':'b-gray'}" style="font-size:10px">${isAI?'AI Generated':'Rule-Based'}</span></div>
      ${!isAI&&onEnhance?`<button class="btn-ghost-sm" onclick="${onEnhance}">Enhance with AI</button>`:''}
    </div>
    <div class="al al-info" style="margin-bottom:16px;font-size:12px">${rm.focus||''}</div>
    ${(rm.steps||[]).map((s,i)=>`<div class="ri">
      <div class="rn">${i+1}</div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:4px">
          <span style="font-size:13px;font-weight:600">${s.title}</span>
          <span class="pb" style="color:${priColor(s.priority)};border-color:${priColor(s.priority)}40">${s.priority}</span>
          ${s.timeframe?`<span style="font-size:11px;color:var(--t3)">${s.timeframe}</span>`:''}
        </div>
        <p style="font-size:12px;color:var(--t2);line-height:1.65">${s.description}</p>
      </div>
    </div>`).join('')}
  </div>`;
}

// ── PROGRESS VIEW ──────────────────────────────────────────────────────────
function progressView(prog,username){
  if(!prog.length)return`<div>
    <div class="sh"><div class="sh-dot" style="background:var(--ylw)"></div>How Progress Tracking Works</div>
    <div style="display:flex;flex-direction:column;gap:9px;margin-bottom:16px">
      ${['Every time you analyze a profile while signed in, Devora saves the score automatically.',
         'Come back and re-analyze the same username after making improvements to your repositories.',
         'Your history appears here as a timeline — measure real improvement over time.'
        ].map((t,i)=>`<div style="display:flex;gap:11px;align-items:flex-start">
        <div class="step-n">${i+1}</div>
        <p style="font-size:12px;color:var(--t2);line-height:1.65;padding-top:3px">${t}</p>
      </div>`).join('')}
    </div>
    <div class="al al-info" style="font-size:12px">This is your first analysis of <strong>@${username}</strong>. Analyze again after improvements to see progress.</div>
  </div>`;
  const maxS=Math.max(...prog.map(p=>p.portfolio_score),1);
  return`<div>
    <div class="sh"><div class="sh-dot" style="background:var(--ylw)"></div>Score History — @${username}</div>
    <div style="margin-bottom:14px">${prog.map(p=>{const d=new Date(p.created_at);const lbl=`${d.getDate()}/${d.getMonth()+1}/${String(d.getFullYear()).slice(2)}`;return`<div class="pr"><span class="pd">${lbl}</span><div class="bar-t" style="flex:1"><div class="bar-f" style="width:${p.portfolio_score}%;background:${sCol(p.portfolio_score)}"></div></div><span class="ps" style="color:${sCol(p.portfolio_score)}">${p.portfolio_score}</span></div>`;}).join('')}</div>
    ${prog.length>=2?`<div class="div"></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <div class="card-xs" style="text-align:center;flex:1"><div class="sv" style="color:var(--t2);font-size:18px">${prog[0].portfolio_score}</div><div class="sk">First</div></div>
      <div class="card-xs" style="text-align:center;flex:1"><div class="sv" style="color:${sCol(prog[prog.length-1].portfolio_score)};font-size:18px">${prog[prog.length-1].portfolio_score}</div><div class="sk">Latest</div></div>
      <div class="card-xs" style="text-align:center;flex:1"><div class="sv" style="color:${prog[prog.length-1].portfolio_score>=prog[0].portfolio_score?'var(--grn)':'var(--red)'};font-size:18px">${prog[prog.length-1].portfolio_score>=prog[0].portfolio_score?'+':''}${prog[prog.length-1].portfolio_score-prog[0].portfolio_score}</div><div class="sk">Change</div></div>
    </div>`:''}
  </div>`;
}
