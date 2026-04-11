// DEVORA — App

const APP={
  view:'landing', tab:'overview', mt:'overview',
  username:'', step:'', data:null,
  myData:null, myLoading:false,
  progress:[], aiData:null, aiLoading:false, aiErr:false,
  roadmap:null, roadmapIsAI:false,
  showSettings:false,
  authMode:'login', authErr:'', authMsg:'', authLoading:false,
  panel:null, // {name, src} for full-page repo detail

  goto(view,authMode){
    this.view=view;
    if(authMode)this.authMode=authMode;
    this.authErr=''; this.authMsg='';
    render();
  }
};

// ── WAVE THEME ─────────────────────────────────────────────────────────────
// Shrink OLD theme color away from click point, revealing NEW theme underneath
function doWave(e){
  const cur=document.documentElement.getAttribute('data-theme')||'dark';
  const next=cur==='dark'?'light':'dark';
  const ov=document.getElementById('wave-overlay');
  const x=e.clientX, y=e.clientY;

  // Set wave origin
  document.documentElement.style.setProperty('--wx', x+'px');
  document.documentElement.style.setProperty('--wy', y+'px');

  // Overlay = OLD theme background color, covering everything
  ov.style.background = cur==='dark' ? '#0f0f11' : '#f5f5f7';
  ov.style.clipPath = 'circle(200vmax at '+x+'px '+y+'px)';
  ov.style.opacity = '1';

  // Apply new theme IMMEDIATELY underneath the overlay
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('dv_theme', next);

  // Next frame: shrink overlay away from click point → reveals new theme
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      ov.classList.add('wave-shrink');
    });
  });

  setTimeout(()=>{
    ov.classList.remove('wave-shrink');
    ov.style.clipPath='circle(0px at 50% 50%)';
    ov.style.opacity='0';
    render();
  }, 560);
}

// ── RENDER ──────────────────────────────────────────────────────────────────
function render(){
  const cv=APP.view;
  let rendered=false;
  if(cv==='loading'){vLoading();rendered=true;}
  else if(cv==='auth'){vAuth();rendered=true;}
  else if(cv==='dash'){vDash();rendered=true;}
  else if(cv==='analyze'&&APP.data){vAnalyze();rendered=true;}
  else if(getCU()&&getCUGithubUsername()){
    if(!APP.myData&&!APP.myLoading){loadMyDash();rendered=true;}
    else if(APP.myData||APP.myLoading){vDash();rendered=true;}
  }
  if(!rendered)vLanding();
  // Hide preloader after first render
  if(!APP._preHidden){
    APP._preHidden=true;
    requestAnimationFrame(()=>{
      const p=document.getElementById('preloader');
      if(p){p.classList.add('hidden');setTimeout(()=>p.remove(),450);}
    });
  }
}

// ── SEARCH ──────────────────────────────────────────────────────────────────
function doSearch(){
  const inp=document.getElementById('main-q');
  const u=(inp?inp.value:'').trim();
  if(!u){showErr('Please enter a GitHub username.');return;}
  if(!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(u)){showErr('Invalid username format.');return;}
  startAnalysis(u);
}
function quickSearch(u){startAnalysis(u);}
function navSearch(){const inp=document.getElementById('nav-q');const u=(inp?inp.value:'').trim();if(u&&/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(u))startAnalysis(u);}
function showErr(msg){const el=document.getElementById('main-err');if(el){el.innerHTML=`<div class="al al-error">${msg}</div>`;el.style.display='block';}}

async function startAnalysis(username){
  APP.username=username; APP.view='loading'; APP.step='Starting';
  APP.data=null; APP.aiData=null; APP.aiErr=false;
  APP.roadmap=null; APP.roadmapIsAI=false; APP.tab='overview'; APP.progress=[];
  render();
  try{
    const data=await analyzeProfile(username,step=>{
      APP.step=step;
      const el=document.getElementById('step-t');
      if(el)el.textContent=step+'…';
    });
    APP.data=data; APP.view='analyze';
    if(getCU()){APP.progress=await sbLoadProgress(username);await sbSave(username,data);}
    else{APP.roadmap=localRoadmap(data);}
    render();
    if(getCU()){
      setTimeout(()=>doAI(),400);
      setTimeout(()=>doRoadmap(),2500);
    }
  }catch(e){
    APP.view='landing';render();
    requestAnimationFrame(()=>{
      const i=document.getElementById('main-q');if(i)i.value=username;
      showErr(e.msg||(e.status===404?`User "@${username}" not found on GitHub.`:'Something went wrong. Check your connection.'));
    });
  }
}

// ── TAB SWITCH ──────────────────────────────────────────────────────────────
function sTab(t){
  APP.tab=t;
  const pane=document.getElementById('tab-pane');
  if(pane){
    pane.style.opacity='0';pane.style.transform='translateX(6px)';pane.style.transition='opacity .13s,transform .13s';
    setTimeout(()=>{pane.innerHTML=renderATab();pane.style.opacity='1';pane.style.transform='translateX(0)';},110);
  }
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('on'));
  document.querySelector(`.tab[onclick="sTab('${t}')"]`)?.classList.add('on');
}
function sMT(t){
  APP.mt=t;
  const pane=document.getElementById('my-pane');
  if(pane){
    pane.style.opacity='0';pane.style.transform='translateX(6px)';pane.style.transition='opacity .13s,transform .13s';
    setTimeout(()=>{pane.innerHTML=renderMT();pane.style.opacity='1';pane.style.transform='translateX(0)';},110);
  }
  document.querySelectorAll('.sb-item').forEach(b=>b.classList.remove('on'));
  document.querySelector(`.sb-item[onclick="sMT('${t}')"]`)?.classList.add('on');
}

// ── DETAIL PANEL (full-page overlay) ────────────────────────────────────────
async function openPanel(name,src){
  const source=src||'analyze';
  // Show loading immediately
  APP.panel={name,src:source,repo:null,loading:true};
  renderPanel();

  const data=source==='my'?APP.myData:APP.data;
  const username=data?.user?.login||APP.username;
  try{
    let repo=(data?.allRepos||data?.scored||[]).find(r=>r.name===name);
    if(!repo||!repo.sc){
      const base=await ghSafe('/repos/'+username+'/'+name);
      if(!base){APP.panel={name,src:source,repo:null,loading:false,error:true};renderPanel();return;}
      repo=await analyzeRepo(username,base);
    }
    APP.panel={name,src:source,repo,loading:false,error:false};
    renderPanel();
  }catch(e){APP.panel={name,src:source,repo:null,loading:false,error:true,errMsg:e.message};renderPanel();}
}
function closePanel(){APP.panel=null;render();}

function renderPanel(){
  // Render panel in the active view's main area
  if(APP.view==='dash'){
    const pane=document.getElementById('my-pane');
    if(pane){pane.innerHTML=renderPanelContent();pane.style.opacity='1';pane.style.transform='';}
    // Update sidebar active state
    document.querySelectorAll('.sb-item').forEach(b=>b.classList.remove('on'));
  } else if(APP.view==='analyze'){
    const pane=document.getElementById('tab-pane');
    if(pane){pane.innerHTML=renderPanelContent();pane.style.opacity='1';pane.style.transform='';}
  }
}

function cleanRmText(txt, limit){
  if(!txt) return '';
  let s = txt;
  // Remove nested badge image links [![...](...)](...)
  s = s.replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, '');
  // Remove image markdown ![alt](url)
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  // Remove markdown links [text](url) — keep text
  s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  // Remove bare URLs
  s = s.replace(/https?:\/\/\S+/g, '');
  // Remove HTML tags
  s = s.replace(/<[^>]+>/g, '');
  // Remove heading markers
  s = s.replace(/^#{1,6}\s*/gm, '');
  // Remove blockquotes
  s = s.replace(/^>\s*/gm, '');
  // Remove code blocks (triple backtick)
  s = s.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  s = s.replace(/`[^`\n]*`/g, '');
  // Remove bold markers
  s = s.replace(/\*{2,3}([^*\n]*)\*{2,3}/g, '$1');
  s = s.replace(/\*([^*\n]*)\*/g, '$1');
  // Remove italic underscores
  s = s.replace(/_{2,3}([^_\n]*)_{2,3}/g, '$1');
  s = s.replace(/_([^_\n]*)_/g, '$1');
  // Remove horizontal rules
  s = s.replace(/^[-=*]{3,}\s*$/gm, '');
  // Remove table separators
  s = s.replace(/^\|[-|: ]+\|$/gm, '');
  // Normalize list items
  s = s.replace(/^[\s]*[-*+]\s+/gm, '• ');
  s = s.replace(/^[\s]*\d+\.\s+/gm, '• ');
  // Collapse excessive whitespace
  s = s.replace(/\n{3,}/g, '\n\n');
  s = s.replace(/[^\S\n]{2,}/g, ' ');
  // Remove emojis and non-ASCII symbols that render as garbage
  s = s.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA9F}]/gu, '');
  // Remove remaining non-printable / corrupted chars (anything that's not normal text, punctuation, newline)
  s = s.replace(/[^\x20-\x7E\n\r\t]/g, '');
  s = s.replace(/[ \t]+/g, ' ');
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim().slice(0, limit || 800);
}

function renderPanelContent(){
  if(!APP.panel)return'';
  const{name,src,repo,loading,error,errMsg}=APP.panel;
  if(loading)return`<div style="text-align:center;padding:48px 20px">${ico('spinner',28,'var(--acc2)','spin')}<p style="font-size:13px;color:var(--t2);margin-top:14px">Analyzing ${name}…</p></div>`;
  if(error)return`<div style="padding:24px"><div class="al al-error" style="margin-bottom:14px">${errMsg||'Could not load repository.'}</div><button class="btn-sm" onclick="closePanel()">← Back</button></div>`;
  if(!repo)return'';

  const sc=repo.sc||{fin:0,doc:0,act:0,depth:0,pop:0};
  const sugg=repo.sugg||[], f=repo.f||{}, _type=repo._type||'project';
  const _depthSigs=repo._depthSigs||[], rm=repo.rm||{};
  const stier=sc.fin>=80?{l:'Excellent',c:'var(--grn)'}:sc.fin>=60?{l:'Good',c:'var(--acc2)'}:sc.fin>=40?{l:'Fair',c:'var(--ylw)'}:{l:'Needs Work',c:'var(--red)'};
  const sizeMB=repo.size?(Math.round(repo.size/102.4)/10).toFixed(1):'?';
  const ageMonths=Math.round((Date.now()-new Date(repo.created_at))/(864e5*30));
  const starsPerMonth=ageMonths>0?(repo.stargazers_count/ageMonths).toFixed(1):0;

  // Score bar helper
  const sbar=(label,val,sub)=>{
    const c=sCol(val);
    return`<div>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <div><span style="font-size:12px;font-weight:500">${label}</span>${sub?`<span style="font-size:10px;color:var(--t3);margin-left:6px">${sub}</span>`:''}</div>
        <span style="font-family:var(--mono);font-size:12px;font-weight:700;color:${c}">${val}</span>
      </div>
      <div class="bar-t" style="height:5px"><div class="bar-f" style="width:${val}%;background:${c}"></div></div>
    </div>`;
  };

  // Guess project purpose when no README
  const guessAbout=()=>{
    const n=repo.name.replace(/[-_]/g,' ').toLowerCase();
    const d=repo.description||'';
    const lang=repo.language||'';
    const sigs=_depthSigs.map(s=>s.label);
    const parts=[];
    if(d) parts.push(d);
    else{
      if(sigs.includes('AI/ML')) parts.push(`An AI/ML project in ${lang||'code'}.`);
      else if(_type==='fullstack') parts.push(`A full-stack application combining frontend and backend in ${lang||'code'}.`);
      else if(_type==='backend') parts.push(`A backend service or API built with ${lang||'code'}.`);
      else if(_type==='cli') parts.push(`A command-line tool written in ${lang||'code'}.`);
      else if(_type==='static') parts.push(`A static website built with ${lang||'HTML/CSS'}.`);
      else parts.push(`A ${lang||'code'} project named "${repo.name}".`);
    }
    if(sigs.length>0) parts.push(`Detected capabilities: ${sigs.join(', ')}.`);
    if(repo.homepage) parts.push(`Live at: ${repo.homepage}`);
    return parts.join(' ');
  };

  const aboutText = rm.wc>20 ? cleanRmText(rm.text||'', 700) : '';
  const displayAbout = aboutText || guessAbout();

  // All languages from files (try to infer from filenames in contents)
  const langColor2 = l => langColor(l);

  return`<div class="fade-in" style="padding:16px;display:flex;flex-direction:column;gap:12px">

  <!-- HEADER -->
  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
    <button class="btn-ghost-sm" onclick="closePanel()">← Back</button>
    <h2 style="font-size:15px;font-weight:700;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${repo.name}</h2>
    <a href="${repo.html_url}" target="_blank" rel="noopener" class="btn-sm" style="font-size:11px;display:flex;align-items:center;gap:4px">${ico('ext',11)} GitHub</a>
    ${repo.homepage?`<a href="${repo.homepage}" target="_blank" rel="noopener" class="btn-ghost-sm" style="font-size:11px">${ico('ext',11)} Live</a>`:''}
  </div>

  <!-- HERO CARD -->
  <div class="card" style="padding:14px">
    <div style="display:flex;gap:14px;align-items:center;margin-bottom:14px;flex-wrap:wrap">
      ${scoreRing(sc.fin,76)}
      <div style="flex:1;min-width:140px">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px">
          <span class="badge" style="background:${stier.c}18;color:${stier.c};border-color:${stier.c}40">${stier.l}</span>
          <span class="tch" style="color:${typeColor(_type)}">${typeLabel(_type)}</span>
          ${repo.fork?'<span class="badge b-yellow">Fork</span>':''}
          ${repo.language?`<span class="tag" style="border-left:2px solid ${langColor(repo.language)}">${repo.language}</span>`:''}
          ${repo.license?.name?`<span class="tag" style="color:var(--grn)">${repo.license.name}</span>`:''}
        </div>
        <p style="font-size:12px;color:var(--t2);line-height:1.6">${repo.description||'No description set on GitHub.'}</p>
      </div>
    </div>
    <!-- 4 stat cards -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:14px">
      <div class="card-xs" style="text-align:center;padding:8px 4px">
        <div style="display:flex;align-items:center;justify-content:center;gap:4px;margin-bottom:2px">${ico('star',13,'var(--ylw)')}<span style="font-family:var(--mono);font-size:14px;font-weight:700">${repo.stargazers_count}</span></div>
        <div style="font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.4px">Stars</div>
      </div>
      <div class="card-xs" style="text-align:center;padding:8px 4px">
        <div style="display:flex;align-items:center;justify-content:center;gap:4px;margin-bottom:2px">${ico('fork',13,'var(--t2)')}<span style="font-family:var(--mono);font-size:14px;font-weight:700">${repo.forks_count}</span></div>
        <div style="font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.4px">Forks</div>
      </div>
      <div class="card-xs" style="text-align:center;padding:8px 4px">
        <div style="font-family:var(--mono);font-size:13px;font-weight:700;margin-bottom:2px">${ago(repo.pushed_at)}</div>
        <div style="font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.4px">Updated</div>
      </div>
      <div class="card-xs" style="text-align:center;padding:8px 4px">
        <div style="font-family:var(--mono);font-size:13px;font-weight:700;margin-bottom:2px">${sizeMB}MB</div>
        <div style="font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.4px">Size</div>
      </div>
    </div>
    <!-- Score bars -->
    <div style="display:flex;flex-direction:column;gap:8px">
      ${sbar('Quality',sc.doc,'docs, README, license')}
      ${sbar('Activity',sc.act,'recency, commit patterns')}
      ${sbar('Technical Depth',sc.depth,'engineering signals')}
      ${sbar('Community Reach',sc.pop,'stars, forks')}
      ${sc.complexity!==undefined?sbar('Complexity',sc.complexity,'codebase difficulty'):''}
      ${sc.usefulness!==undefined?sbar('Usefulness',sc.usefulness,'real-world value'):''}
    </div>
  </div>

  <!-- PENTAGON FOR THIS REPO -->
  <div class="card" style="padding:14px">
    <div class="sh" style="margin-bottom:4px"><div class="sh-dot" style="background:var(--acc2)"></div>Score Breakdown</div>
    <div style="display:flex;justify-content:center">
      ${pentagonRadar({reputation:sc.pop,activity:sc.act,depth:sc.depth,diversity:sc.complexity||0,quality:sc.doc})}
    </div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:4px">
      ${[['Reach',sc.pop,'var(--ylw)'],['Activity',sc.act,'var(--grn)'],['Depth',sc.depth,'var(--red)'],['Complex.',sc.complexity||0,'var(--acc2)'],['Quality',sc.doc,'var(--blu)']].map(([l,v,c])=>`<div style="text-align:center"><div style="font-family:var(--mono);font-size:12px;font-weight:700;color:${c}">${v}</div><div style="font-size:9px;color:var(--t3)">${l}</div></div>`).join('')}
    </div>
  </div>

  <!-- ABOUT THIS PROJECT -->
  <div class="card" style="padding:14px">
    <div class="sh" style="margin-bottom:10px">
      <div class="sh-dot" style="background:var(--acc2)"></div>
      About This Project
      ${!rm.wc?'<span class="badge b-yellow" style="margin-left:6px;font-size:10px">README missing — inferred</span>':''}
    </div>
    <div style="border-left:2px solid var(--border);padding-left:12px">
      ${displayAbout.split('\n').filter(l=>l.trim()).slice(0,15).map(l=>`<p style="font-size:12px;color:var(--t2);line-height:1.75;margin-bottom:6px">${l.trim()}</p>`).join('')}
    </div>
    ${rm.wc?`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:12px">
      ${[['Words',rm.wc,'var(--text)'],['Headings',rm.h,'var(--acc2)'],['Code blocks',rm.cb,'var(--pur)'],['Links',rm.lk,'var(--grn)']].map(([l,v,c])=>`<div style="text-align:center;padding:8px;background:var(--s2);border:1px solid var(--border);border-radius:5px"><div style="font-family:var(--mono);font-size:15px;font-weight:700;color:${c};margin-bottom:2px">${v}</div><div style="font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.4px">${l}</div></div>`).join('')}
    </div>`:''}
  </div>

  <!-- TECH STACK — all languages + capabilities -->
  <div class="card" style="padding:14px">
    <div class="sh" style="margin-bottom:12px"><div class="sh-dot" style="background:var(--pur)"></div>Tech Stack</div>
    <!-- Primary language row -->
    ${repo.language?`<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--s2);border:1px solid var(--border);border-radius:6px;margin-bottom:10px">
      <div style="width:12px;height:12px;border-radius:3px;background:${langColor(repo.language)};flex-shrink:0"></div>
      <div style="flex:1">
        <span style="font-size:13px;font-weight:600">${repo.language}</span>
        <span style="font-size:10px;color:var(--t3);margin-left:8px">Primary language</span>
      </div>
      ${repo.language==='TypeScript'?'<span class="badge b-blue">Type-safe</span>':repo.language==='Rust'||repo.language==='C'||repo.language==='C++'?'<span class="badge b-red">Systems</span>':repo.language==='Python'?'<span class="badge b-green">Scripting</span>':''}
    </div>`:''}
    <!-- Inferred other languages from signals and type -->
    ${(()=>{
      const extras=[];
      if(_depthSigs.some(s=>s.label==='TypeScript')&&repo.language!=='TypeScript') extras.push({l:'TypeScript',c:'#3178c6',note:'type definitions'});
      if(f.dep&&repo.language==='JavaScript') extras.push({l:'JSON',c:'#cbcb41',note:'config/deps'});
      if(f.docker) extras.push({l:'Shell',c:'#89e051',note:'Docker scripts'});
      if(f.cfg) extras.push({l:'YAML/Config',c:'#6e7681',note:'configuration'});
      if(extras.length===0) return'';
      return`<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
        ${extras.map(e=>`<div style="display:flex;align-items:center;gap:6px;padding:5px 10px;background:var(--s2);border:1px solid var(--border);border-radius:5px">
          <div style="width:8px;height:8px;border-radius:2px;background:${e.c};flex-shrink:0"></div>
          <span style="font-size:11px;font-weight:500">${e.l}</span>
          <span style="font-size:10px;color:var(--t3)">${e.note}</span>
        </div>`).join('')}
      </div>`;
    })()}
    <!-- Detected capabilities — detailed rows, not just badges -->
    ${_depthSigs.length?`
    <p style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px">Detected Capabilities</p>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${_depthSigs.map(s=>{
        const descriptions={Auth:'User authentication — login, sessions, or token-based auth',Database:'Persistent data storage — SQL/NoSQL integration','API Design':'REST or GraphQL API design','AI/ML':'Machine learning or AI API integration',Testing:'Automated test suite',Docker:'Docker containerization','CI/CD':'Continuous integration pipeline',TypeScript:'Static type safety','Real-time':'WebSocket or SSE live updates','State Mgmt':'Frontend state management','Systems Programming':'Low-level systems code'};
        const imap={lock:'lock',database:'database',api:'api',ai:'ai',test:'test',docker:'docker',ci:'ci',ts:'ts',rt:'rt',state:'state',code:'code'};
        const isCode=s.source==='code';
        return`<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--s2);border:1px solid ${isCode?'var(--grn)30':'var(--border)'};border-radius:5px">
          <div style="width:28px;height:28px;border-radius:5px;background:${isCode?'var(--grn-bg)':'var(--acc-bg)'};border:1px solid ${isCode?'var(--grn)30':'var(--acc-border)'};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ico(imap[s.icon]||'check',14,isCode?'var(--grn)':'var(--acc2)')}</div>
          <div style="flex:1">
            <p style="font-size:12px;font-weight:600;margin-bottom:1px">${s.label}</p>
            <p style="font-size:10px;color:var(--t3)">${descriptions[s.label]||'Detected in this repository'}</p>
          </div>
          <div style="display:flex;gap:4px;align-items:center">
            <span class="badge" style="font-size:9px;background:${isCode?'var(--grn-bg)':'var(--ylw-bg)'};color:${isCode?'var(--grn)':'var(--ylw)'};border-color:${isCode?'var(--grn)30':'var(--ylw)30'}">${isCode?'Code':'README'}</span>
            <span class="badge b-acc" style="font-size:9px">+${s.pts}</span>
          </div>
        </div>`;
      }).join('')}
    </div>
    <p style="font-size:10px;color:var(--t3);margin-top:8px">Green border = detected from actual code. Yellow = detected from README only (half points).</p>`:`<div class="al al-info" style="font-size:11px">No advanced signals detected. Add auth, a database, or an API layer to improve depth score.</div>`}
  </div>

  <!-- FILE HEALTH -->
  <div class="card" style="padding:14px">
    <div class="sh" style="margin-bottom:10px"><div class="sh-dot" style="background:var(--grn)"></div>File Health</div>
    ${fileCheck(f)}
    ${repo.topics?.length?`<div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:5px">${repo.topics.map(t=>`<span class="tag" style="color:var(--acc2)">${t}</span>`).join('')}</div>`:''}
  </div>

  <!-- SUGGESTIONS -->
  <div class="card" style="padding:14px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <div class="sh" style="margin-bottom:0"><div class="sh-dot" style="background:var(--red)"></div>How to Improve</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        ${sugg.filter(s=>s.p==='crit').length?`<span class="badge b-red">Critical ${sugg.filter(s=>s.p==='crit').length}</span>`:''}
        ${sugg.filter(s=>s.p==='rec').length?`<span class="badge b-yellow">Recommended ${sugg.filter(s=>s.p==='rec').length}</span>`:''}
        ${sugg.filter(s=>s.p==='opt').length?`<span class="badge b-blue">Optional ${sugg.filter(s=>s.p==='opt').length}</span>`:''}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:5px">
      ${sugg.map((s,i)=>{
        const cols={crit:'var(--red)',rec:'var(--ylw)',opt:'var(--acc2)'};
        const labs={crit:'Critical',rec:'Recommended',opt:'Optional'};
        return`<div class="chip" style="align-items:flex-start">
          <div class="chip-dot" style="background:${cols[s.p]};margin-top:4px"></div>
          <div style="flex:1"><span style="font-size:10px;font-weight:700;color:${cols[s.p]};text-transform:uppercase">${labs[s.p]}</span><span style="color:var(--t3)"> · </span><span style="font-size:12px">${s.t}</span></div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <!-- FOOTER -->
  <div class="card-flat" style="display:flex;flex-wrap:wrap;gap:10px;padding:10px 12px;font-size:11px;color:var(--t3)">
    <span>Created ${new Date(repo.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
    <span>·</span><span>${ageMonths}mo old</span>
    <span>·</span><span>${starsPerMonth} stars/mo</span>
    <span>·</span><span>${repo.open_issues_count||0} issues</span>
    ${repo.watchers_count?`<span>·</span><span>${repo.watchers_count} watching</span>`:''}
  </div>
</div>`;
}

// ── AI ────────────────────────────────────────────────────────────────────
async function doAI(src){
  const data=src==='my'?APP.myData:APP.data;
  if(!data||!getCU())return;
  APP.aiLoading=true;APP.aiData=null;APP.aiErr=false;
  const pane=document.getElementById(src==='my'?'my-pane':'tab-pane');
  if(pane)pane.innerHTML=src==='my'?renderMT():renderATab();
  const ai=await getAIInsights(data);
  APP.aiLoading=false;
  if(!ai){APP.aiErr=true;if(pane)pane.innerHTML=src==='my'?renderMT():renderATab();return;}
  APP.aiData=ai;
  if(getCU())await sbSave(data.user.login,{...data,aiData:ai});
  if(pane)pane.innerHTML=src==='my'?renderMT():renderATab();
}

async function doRoadmap(){
  const data=APP.myData||APP.data;if(!data)return;
  const btn=document.querySelector('[onclick="doRoadmap()"]');if(btn){btn.textContent='Generating…';btn.disabled=true;}
  const rm=await getAIRoadmap(data);
  if(rm){APP.roadmap=rm;APP.roadmapIsAI=true;}
  const id=APP.view==='dash'?'my-pane':'tab-pane';
  const pane=document.getElementById(id);if(pane)pane.innerHTML=APP.view==='dash'?renderMT():renderATab();
}

// ── MY DASHBOARD ─────────────────────────────────────────────────────────
async function loadMyDash(){
  const ghUser=getCUGithubUsername();
  if(!ghUser){APP.view='dash';APP.myData=null;render();return;}
  APP.view='dash';APP.myLoading=true;APP.myData=null;APP.mt='overview';
  APP.aiData=null;APP.aiErr=false;APP.roadmap=null;APP.roadmapIsAI=false;APP.progress=[];
  render();
  try{
    const data=await analyzeProfile(ghUser,()=>{});
    APP.myData=data;APP.myLoading=false;
    if(getCU()){APP.progress=await sbLoadProgress(ghUser);await sbSave(ghUser,data);}
    render();
    setTimeout(()=>doRoadmap(),800);
  }catch(e){APP.myLoading=false;APP.myData=null;render();}
}

// ── AUTH ──────────────────────────────────────────────────────────────────
async function handleAuth(){
  const email=document.getElementById('a-email')?.value.trim();
  const pass=document.getElementById('a-pass')?.value.trim();
  const name=document.getElementById('a-name')?.value.trim();
  const ghuser=document.getElementById('a-ghuser')?.value.trim();
  const m=APP.authMode;
  if(m==='reset'){
    if(!email){APP.authErr='Please enter your email.';vAuth();return;}
    APP.authLoading=true;APP.authErr='';vAuth();
    const r=await sbResetPw(email);APP.authLoading=false;
    if(r.error)APP.authErr=r.error;else APP.authMsg=r.msg||'Reset email sent.';
    vAuth();return;
  }
  if(!email||!pass){APP.authErr='Please fill in all fields.';vAuth();return;}
  if(m==='signup'&&pass.length<6){APP.authErr='Password must be at least 6 characters.';vAuth();return;}
  APP.authLoading=true;APP.authErr='';vAuth();
  const meta=m==='signup'?{full_name:name||'',github_username:ghuser||''}:{};
  const r=m==='login'?await sbSignIn(email,pass):await sbSignUp(email,pass,meta);
  APP.authLoading=false;
  if(r.error){APP.authErr=r.error;vAuth();}
  else if(r.msg){APP.authMsg=r.msg;APP.authMode='login';vAuth();}
}

async function handleSignOut(){
  await sbSignOut();
  APP.myData=null;APP.aiData=null;APP.progress=[];APP.roadmap=null;
  APP.goto('landing');
}

function handleLogoClick(){
  if(getCU()&&getCUGithubUsername()){
    if(!APP.myData&&!APP.myLoading)loadMyDash();
    else{APP.view='dash';render();}
  }else{APP.goto('landing');}
}
function handleBack(){
  if(getCU()&&getCUGithubUsername()&&APP.myData){APP.view='dash';render();}
  else{APP.data=null;APP.goto('landing');}
}

// ── SETTINGS ─────────────────────────────────────────────────────────────
function openSettings(){APP.showSettings=true;render();}
function closeSettings(){APP.showSettings=false;render();}
function attachStHandlers(){
  document.getElementById('st-gh')?.addEventListener('input',e=>setGhToken(e.target.value.trim()));
  document.getElementById('st-groq')?.addEventListener('input',e=>setGroqKey(e.target.value.trim()));
}
function saveSettings(){
  const groqVal=(document.getElementById('st-groq')?.value||'').trim();
  const ghVal=(document.getElementById('st-gh')?.value||'').trim();
  setGroqKey(groqVal);
  setGhToken(ghVal||null);
  const u=(document.getElementById('st-sbu')?.value||'').trim();
  const k=(document.getElementById('st-sbk')?.value||'').trim();
  if(u||k){setSBConfig(u,k);initSB(onAuth);}
  APP.showSettings=false;
  APP.settingsSaved=true;
  render();
  setTimeout(()=>{APP.settingsSaved=false;},3000);
}
async function saveGhUser(){
  const v=document.getElementById('st-ghuser')?.value.trim();
  if(!v)return;
  await sbUpdateGhUser(v);
  closeSettings();
  loadMyDash();
}

// ── AUTH STATE ────────────────────────────────────────────────────────────
function onAuth(ev,sess){
  if(ev==='SIGNED_IN'&&APP.view==='auth'){
    APP.authErr='';APP.authMsg='';
    const gh=getCUGithubUsername();
    if(gh)loadMyDash();else APP.goto('landing');
  }
  if(ev==='SIGNED_OUT'){APP.myData=null;APP.progress=[];APP.aiData=null;render();}
  if(ev==='INITIAL')render();
}

// ── KEYBOARD ──────────────────────────────────────────────────────────────
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(APP.showSettings){closeSettings();return;}
    if(document.getElementById('dp')?.classList.contains('open')){closePanel();return;}
  }
});

// ── LIGHT MODE ON LOAD ────────────────────────────────────────────────────
const _savedTheme=localStorage.getItem('dv_theme')||'dark';
document.documentElement.setAttribute('data-theme',_savedTheme);

// ── PENTAGON TOOLTIP ─────────────────────────────────────────────────────
function _showPentaTT(x, y, key, val){
  const meta = PENTA_META[key]; if(!meta) return;
  const tt = document.getElementById('penta-tt'); if(!tt) return;
  document.getElementById('ptt-title').textContent = meta.label;
  document.getElementById('ptt-score').textContent = val + ' / 100';
  document.getElementById('ptt-score').style.color = meta.color;
  document.getElementById('ptt-desc').textContent = meta.desc;
  document.getElementById('ptt-improve').textContent = '↑ How to improve: ' + meta.improve;
  // Position tooltip — keep in viewport
  tt.style.left = '0px'; tt.style.top = '0px'; tt.style.opacity = '0'; tt.style.display = 'block';
  const tw = tt.offsetWidth || 220, th = tt.offsetHeight || 100;
  const lx = Math.max(8, Math.min(x + 12, window.innerWidth - tw - 8));
  const ly = y - th - 8 < 8 ? y + 16 : y - th - 8;
  tt.style.left = lx + 'px'; tt.style.top = ly + 'px'; tt.style.opacity = '1';
  tt.classList.add('show');
}
function pvHover(e, key, val){ if(window._ptPinned) return; _showPentaTT(e.clientX, e.clientY, key, val); }
function pvLeave(){ if(window._ptPinned) return; const tt=document.getElementById('penta-tt'); if(tt){tt.classList.remove('show');tt.style.display='none';} }
function pvClick(e, key, val){
  e.stopPropagation();
  if(window._ptPinned){ window._ptPinned=false; pvLeave(); return; }
  window._ptPinned = true;
  _showPentaTT(e.clientX, e.clientY, key, val);
}
function pvTouch(e, key, val){
  e.preventDefault();
  const t=e.touches[0];
  window._ptPinned = false;
  _showPentaTT(t.clientX, t.clientY, key, val);
  clearTimeout(window._ptTid);
  window._ptTid = setTimeout(()=>{ window._ptPinned=false; pvLeave(); }, 3500);
}
// Close pinned tooltip when clicking elsewhere
document.addEventListener('click', ()=>{ if(window._ptPinned){window._ptPinned=false;pvLeave();} });

// ── SIDEBAR MOBILE TOGGLE + SWIPE ────────────────────────────────────────
function toggleSidebar(){
  const sb=document.querySelector('.sidebar');
  const ov=document.querySelector('.sb-overlay');
  if(!sb)return;
  const isOpen=sb.classList.contains('mobile-open');
  if(isOpen){ sb.classList.remove('mobile-open'); if(ov)ov.classList.remove('show'); }
  else { sb.classList.add('mobile-open'); if(ov)ov.classList.add('show'); }
}
function closeSidebar(){
  const sb=document.querySelector('.sidebar');
  const ov=document.querySelector('.sb-overlay');
  if(sb)sb.classList.remove('mobile-open');
  if(ov)ov.classList.remove('show');
}
// Swipe right to open sidebar, swipe left on sidebar to close
(function initSwipe(){
  let sx=0,sy=0;
  document.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
  document.addEventListener('touchend',e=>{
    const dx=e.changedTouches[0].clientX-sx;
    const dy=e.changedTouches[0].clientY-sy;
    if(Math.abs(dx)<Math.abs(dy)*1.5)return; // mostly vertical swipe — ignore
    const sb=document.querySelector('.sidebar');
    const isOpen=sb&&sb.classList.contains('mobile-open');
    if(dx>60&&sx<40&&!isOpen) toggleSidebar();   // swipe right from left edge
    if(dx<-60&&isOpen) closeSidebar();             // swipe left anywhere when open
  },{passive:true});
})();

// ── INIT ──────────────────────────────────────────────────────────────────
initSB(onAuth);
render();
