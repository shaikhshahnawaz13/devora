// DEVORA — Views

// ── LANDING ────────────────────────────────────────────────────────────────
function vLanding(){
  const cu=getCU();
  document.getElementById('root').innerHTML=`
  ${navbar({})}
  <div class="page-center fade-in">
  <div class="hero-wrap">
    <div style="display:inline-flex;align-items:center;gap:8px;background:var(--acc-bg);border:1px solid var(--acc-border);border-radius:100px;padding:5px 14px;font-size:12px;color:var(--acc2);margin-bottom:22px">
      ${ico('ai',12,'var(--acc2)')} AI-powered portfolio intelligence
    </div>
    <h1 style="font-size:52px;font-weight:800;letter-spacing:-2.5px;line-height:1.05;margin-bottom:12px" class="grad-text">Devora</h1>
    <p style="font-size:16px;color:var(--t2);font-weight:400;margin-bottom:6px;letter-spacing:-.2px">Developer Intelligence Platform</p>
    <p style="font-size:13px;color:var(--t3);margin-bottom:36px">Score any GitHub profile across 5 dimensions · AI insights via Groq · Track growth over time</p>

    <div class="border-grad" style="padding:18px;margin-bottom:10px;text-align:left">
      <label style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.7px;display:block;margin-bottom:7px">GitHub Username</label>
      <input id="main-q" type="text" placeholder="Enter username e.g. shaikhshahnawaz13" maxlength="39" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="font-size:14px;margin-bottom:8px">
      <div id="main-err" style="display:none;margin-bottom:8px"></div>
      <button class="btn" style="font-size:14px;padding:10px" onclick="doSearch()">Analyze Profile</button>
      <p style="text-align:center;font-size:11px;color:var(--t3);margin-top:9px">
        Try: <button class="lnk" onclick="quickSearch('torvalds')">torvalds</button> · <button class="lnk" onclick="quickSearch('gaearon')">gaearon</button> · <button class="lnk" onclick="quickSearch('sindresorhus')">sindresorhus</button>
      </p>
    </div>

    ${cu
      ?`<div class="al al-success" style="margin-bottom:8px;font-size:12px">Signed in as <strong>${cu.email}</strong>${getCUGithubUsername()?` · <button class="lnk" onclick="APP.goto('dash')" style="font-weight:600">My Dashboard →</button>`:''}</div>`
      :`<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:8px">
          <button class="btn-ghost" style="font-size:12px;padding:9px" onclick="APP.goto('auth','signup')">Create Free Account</button>
          <button class="btn-ghost" style="font-size:12px;padding:9px" onclick="APP.goto('auth','login')">Sign In</button>
        </div>`
    }
    <p style="font-size:11px;color:var(--t3);text-align:center">AI insights active · No setup required · Free forever</p>
  </div>

  <div class="content-w">
    <!-- STATS -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:36px">
      ${[['5','Dimensions'],['10+','Signals'],['7','Types'],['Free','Forever']].map(([n,l])=>`
      <div class="card-xs" style="text-align:center">
        <div style="font-family:var(--mono);font-size:20px;font-weight:700;color:var(--acc2);margin-bottom:2px">${n}</div>
        <div style="font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;font-weight:600">${l}</div>
      </div>`).join('')}
    </div>

    <div class="sep"></div>

    <!-- HOW IT WORKS -->
    <div style="margin-bottom:36px">
      <h2 style="font-size:18px;font-weight:700;margin-bottom:3px;letter-spacing:-.3px">How It Works</h2>
      <p style="font-size:12px;color:var(--t3);margin-bottom:16px">From username to insights in seconds</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${[['01','Enter a GitHub Username','Type any GitHub username. Devora fetches all public repositories using the GitHub REST API. No login required.'],
           ['02','Deep Repository Analysis','Each repo is scored on project type, technical depth (auth, databases, Docker, CI/CD, TypeScript, AI), documentation, activity, and deployment.'],
           ['03','Portfolio Score and Roadmap','5-dimension portfolio score, AI strengths and weaknesses via Groq, personalized 5-step roadmap, and progress tracking over time.'],
          ].map(([n,t,d])=>`<div class="card" style="display:flex;gap:12px;align-items:flex-start;padding:14px">
          <div class="step-n">${n}</div>
          <div><p style="font-size:13px;font-weight:600;margin-bottom:3px">${t}</p><p style="font-size:12px;color:var(--t2);line-height:1.65">${d}</p></div>
        </div>`).join('')}
      </div>
    </div>

    <div class="sep"></div>

    <!-- FEATURES -->
    <div style="margin-bottom:36px">
      <h2 style="font-size:18px;font-weight:700;margin-bottom:3px;letter-spacing:-.3px">What Devora Analyzes</h2>
      <p style="font-size:12px;color:var(--t3);margin-bottom:16px">Far beyond stars and followers</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:10px">
        ${[['chart','var(--acc2)','5-Dimension Score','Reputation, Activity, Technical Depth, Diversity, Quality — properly weighted'],
           ['eye','var(--pur)','Type Detection','Fullstack, Backend, Frontend App, CLI, ML/AI, Library, Static'],
           ['trending','var(--grn)','Technical Depth','Auth, Database, API, Docker, TypeScript, AI, CI/CD, Real-time'],
           ['repo','var(--ylw)','Per-Repo Analysis','Quality, activity, depth, popularity scored individually'],
           ['ai','var(--orn||\'#e3b341\')','Groq AI Insights','Strengths, weaknesses, career readiness, 5 action items'],
           ['chart','var(--red)','Progress Tracking','Save history and measure real improvement over time'],
          ].map(([ic,col,t,d])=>`<div class="feat">
          <div class="feat-icon">${ico(ic,16,col)}</div>
          <p style="font-size:12px;font-weight:600;margin-bottom:4px">${t}</p>
          <p style="font-size:11px;color:var(--t2);line-height:1.6">${d}</p>
        </div>`).join('')}
      </div>
    </div>

    <div class="sep"></div>

    <!-- WHY SIGN UP -->
    <div style="margin-bottom:36px">
      <h2 style="font-size:18px;font-weight:700;margin-bottom:3px;letter-spacing:-.3px">Why Create an Account?</h2>
      <p style="font-size:12px;color:var(--t3);margin-bottom:16px">Free forever — unlock these features</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:8px;margin-bottom:16px">
        ${[['AI insights — strengths, weaknesses, career readiness','var(--pur)'],['Personalized 5-step AI roadmap','var(--acc2)'],['Progress tracking — watch your score grow','var(--ylw)'],['Full personal dashboard with sidebar','var(--grn)'],['Deep-dive any repo with slide-in panel','var(--red)'],['Search and compare any GitHub profile','var(--orn||\'#e3b341\')']].map(([t,c])=>`<div class="card card-hover" style="display:flex;gap:8px;padding:12px">
          <div style="width:5px;height:5px;border-radius:50%;background:${c};flex-shrink:0;margin-top:4px"></div>
          <span style="font-size:11px;color:var(--t2);line-height:1.55">${t}</span>
        </div>`).join('')}
      </div>
      ${!cu?`<button class="btn" style="max-width:220px;margin:0 auto;display:block" onclick="APP.goto('auth','signup')">Create Free Account</button>`:''}
    </div>

    <div class="sep"></div>

    <div style="text-align:center;padding-bottom:32px">
      <p style="font-size:11px;color:var(--t3)">Devora · Zero dependencies · GitHub REST API · Groq AI · Supabase · <a href="https://github.com/shaikhshahnawaz13/devora" target="_blank">Open Source</a></p>
    </div>
  </div>
  </div>
  ${APP.showSettings?settingsModal():''}`;
  requestAnimationFrame(()=>{
    const i=document.getElementById('main-q');
    if(i){i.focus();i.onkeydown=e=>{if(e.key==='Enter')doSearch();};}
    if(APP.showSettings)attachStHandlers();
  });
}

// ── AUTH ────────────────────────────────────────────────────────────────────
function vAuth(){
  const m=APP.authMode,isL=m==='login',isS=m==='signup',isR=m==='reset';
  document.getElementById('root').innerHTML=`
  ${navbar({})}
  <div style="min-height:calc(100vh - 52px);display:flex;align-items:center;justify-content:center;padding:24px">
  <div style="width:100%;max-width:380px">
    <div style="text-align:center;margin-bottom:24px" class="fade-in">
      <div style="display:inline-flex;align-items:center;gap:9px;margin-bottom:18px">
        <div class="logo-mark" style="width:38px;height:38px;border-radius:8px">${logoSVG(20)}</div>
        <span style="font-size:26px;font-weight:800;letter-spacing:-1px" class="grad-text">Devora</span>
      </div>
      <h2 style="font-size:18px;font-weight:700;margin-bottom:4px;letter-spacing:-.3px">${isL?'Welcome back':isS?'Create account':'Reset password'}</h2>
      <p style="font-size:12px;color:var(--t2)">${isL?'Sign in to access AI insights and your dashboard':isS?'Free forever — save analyses and track your growth':'Enter your email to receive a reset link'}</p>
    </div>
    <div class="card fade-in" style="padding:22px">
      ${APP.authErr?`<div class="al al-error" style="margin-bottom:12px">${APP.authErr}</div>`:''}
      ${APP.authMsg?`<div class="al al-success" style="margin-bottom:12px">${APP.authMsg}</div>`:''}
      ${isS?`<label style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px">Full Name</label>
      <input id="a-name" type="text" placeholder="Your full name" autocomplete="name" style="margin-bottom:10px">
      <label style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px">GitHub Username</label>
      <input id="a-ghuser" type="text" placeholder="e.g. shaikhshahnawaz13" autocomplete="off" autocorrect="off" autocapitalize="off" style="margin-bottom:4px">
      <p style="font-size:11px;color:var(--t3);margin-bottom:10px">Used to auto-load your personal dashboard after login.</p>`:''}
      ${!isR?`<label style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px">Email</label>
      <input id="a-email" type="email" placeholder="you@example.com" autocomplete="email" style="margin-bottom:10px">
      <label style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px">Password</label>
      <input id="a-pass" type="password" placeholder="${isS?'At least 6 characters':'Your password'}" autocomplete="${isL?'current-password':'new-password'}">`:
      `<label style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px">Email</label>
      <input id="a-email" type="email" placeholder="you@example.com" autocomplete="email">`}
      <button class="btn" style="margin-top:14px;font-size:13px" onclick="handleAuth()">
        ${APP.authLoading?(isL?'Signing in…':isS?'Creating account…':'Sending…'):(isL?'Sign In':isS?'Create Account':'Send Reset Email')}
      </button>
      ${isL?`<p style="text-align:center;font-size:12px;color:var(--t3);margin-top:9px"><button class="lnk" onclick="APP.authMode='reset';APP.authErr='';vAuth()">Forgot password?</button></p>`:''}
      <div class="div"></div>
      ${isR?`<button class="btn-ghost" style="width:100%;font-size:12px" onclick="APP.authMode='login';APP.authErr='';vAuth()">Back to sign in</button>`:
        `<button class="btn-ghost" style="width:100%;font-size:12px" onclick="APP.authMode='${isL?'signup':'login'}';APP.authErr='';vAuth()">${isL?'Create a free account':'Already have an account? Sign in'}</button>`}
      <div class="div"></div>
      <button class="btn-ghost" style="width:100%;font-size:12px" onclick="APP.goto('landing')">Continue without account</button>
    </div>
  </div></div>
  ${APP.showSettings?settingsModal():''}`;
  requestAnimationFrame(()=>{
    const e=document.getElementById('a-email'),p=document.getElementById('a-pass');
    if(e)e.onkeydown=k=>{if(k.key==='Enter')handleAuth();};
    if(p)p.onkeydown=k=>{if(k.key==='Enter')handleAuth();};
    if(APP.showSettings)attachStHandlers();
  });
}

// ── LOADING ─────────────────────────────────────────────────────────────────
function vLoading(){
  document.getElementById('root').innerHTML=`
  ${navbar({})}
  <div style="height:calc(100vh - 52px);display:flex;align-items:center;justify-content:center">
  <div style="text-align:center;max-width:300px;padding:20px">
    <div style="width:48px;height:48px;border-radius:10px;background:var(--s1);border:1px solid var(--border);margin:0 auto 18px;display:flex;align-items:center;justify-content:center">
      ${ico('spinner',24,'var(--acc2)','spin')}
    </div>
    <h2 style="font-size:16px;font-weight:700;margin-bottom:4px;letter-spacing:-.3px">Analyzing</h2>
    <p style="font-family:var(--mono);font-size:12px;color:var(--acc2);margin-bottom:4px">@${APP.username}</p>
    <p id="step-t" style="font-size:12px;color:var(--t3);margin-bottom:22px">${APP.step}…</p>
    <div style="display:flex;flex-direction:column;gap:6px;text-align:left">
      ${['Fetch user profile','Load all repositories','Detect project types','Analyze technical depth','Compute portfolio score'].map(s=>`
      <div class="card-xs" style="display:flex;align-items:center;gap:9px;padding:8px 10px">
        <div style="width:3px;height:3px;border-radius:50%;background:var(--acc2);flex-shrink:0"></div>
        <span style="font-size:11px;color:var(--t2)">${s}</span>
      </div>`).join('')}
    </div>
  </div></div>`;
}

// ── ANALYZE PAGE ─────────────────────────────────────────────────────────────
function vAnalyze(){
  const d=APP.data;if(!d){APP.goto('landing');return;}
  const{user,topRepos,scored,portfolioScore,scores,total,totalStars,totalForks,original}=d;
  const pc=sCol(portfolioScore);
  document.getElementById('root').innerHTML=`
  ${navbar({search:true,searchVal:APP.username,back:true})}
  <div class="page-full fade-in">

  <!-- OVERVIEW CARD -->
  <div class="card" style="margin-bottom:12px;padding:16px">
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      ${scoreRing(portfolioScore,100)}
      <div style="flex:1;min-width:140px">
        <div style="display:flex;align-items:center;gap:7px;margin-bottom:4px;flex-wrap:wrap">
          ${user.avatar_url?`<img src="${user.avatar_url}" width="20" height="20" style="border-radius:50%;border:1px solid var(--border)" onerror="this.style.display='none'">`:''}
          <a href="${user.html_url}" target="_blank" rel="noopener" style="font-size:13px;font-weight:600">${user.name||user.login}</a>
          <span style="font-size:11px;color:var(--t3);font-family:var(--mono)">@${user.login}</span>
        </div>
        ${user.bio?`<p style="font-size:11px;color:var(--t2);margin-bottom:6px;line-height:1.5">${user.bio}</p>`:''}
        <p style="font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;font-weight:600">Portfolio Score</p>
        <p style="font-size:22px;font-weight:800;color:${pc};letter-spacing:-.5px;line-height:1;margin-bottom:4px">${sTier(portfolioScore)}</p>
        <p style="font-size:11px;color:var(--t2);line-height:1.6;margin-bottom:12px">${sDesc(portfolioScore)}</p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
          ${[['Repos',total],['Stars',totalStars],['Forks',totalForks],['Followers',user.followers||0],['Original',original],['Analyzed',scored.length]].map(([l,v])=>`
          <div class="card-xs" style="text-align:center;padding:7px 6px">
            <div style="font-family:var(--mono);font-size:14px;font-weight:700;margin-bottom:2px">${v}</div>
            <div style="font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.3px;font-weight:600">${l}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- DIM SCORES STRIP -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px" class="dim-strip">
    ${[['Reputation',scores.reputation,'Stars, forks, followers'],['Activity',scores.activity,'Recency, consistency'],['Technical Depth',scores.depth,'Tech complexity'],['Diversity',scores.diversity,'Languages, types']].map(([l,v,d])=>`
    <div class="card-xs" style="text-align:center;padding:10px 8px">
      <div style="font-family:var(--mono);font-size:18px;font-weight:700;color:${sCol(v)};line-height:1;margin-bottom:4px">${v}</div>
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.3px;color:var(--text);margin-bottom:2px">${l}</div>
      <div style="font-size:9px;color:var(--t3)">${d}</div>
    </div>`).join('')}
  </div>

  <!-- TABS -->
  <div class="tabs">
    <button class="tab ${APP.tab==='overview'?'on':''}" onclick="sTab('overview')">Overview</button>
    <button class="tab ${APP.tab==='ai'?'on':''}" onclick="sTab('ai')">${getCU()?'AI Insights':'AI Insights (Sign in)'}</button>
    <button class="tab ${APP.tab==='progress'?'on':''}" onclick="sTab('progress')">Progress</button>
    <button class="tab ${APP.tab==='roadmap'?'on':''}" onclick="sTab('roadmap')">Roadmap</button>
  </div>

  <div id="tab-pane" class="slide-in">${renderATab()}</div>

  <div style="text-align:center;padding-top:14px;border-top:1px solid var(--border);margin-top:6px">
    <p style="font-size:11px;color:var(--t3)">Devora · GitHub REST API · ${window._rl!=null?window._rl+' API calls remaining':''}</p>
  </div>
  </div>

  <div class="detail-panel" id="dp">
    <div class="dp-header">
      <span style="font-size:13px;font-weight:700" id="dp-title">Repository Analysis</span>
      <button class="btn-ghost-sm" onclick="closePanel()">${ico('x',12)} Close</button>
    </div>
    <div id="dp-content" style="padding:18px"></div>
  </div>
  <div id="penta-tt" class="penta-tooltip">
    <div class="penta-tooltip-title" id="ptt-title"></div>
    <div class="penta-tooltip-score" id="ptt-score"></div>
    <div class="penta-tooltip-desc" id="ptt-desc"></div>
    <div style="font-size:11px;color:var(--grn);margin-top:6px" id="ptt-improve"></div>
  </div>
  ${APP.showSettings?settingsModal():''}`;
  if(APP.showSettings)requestAnimationFrame(attachStHandlers);
}

function renderATab(){
  const d=APP.data;if(!d)return'';
  const{user,topRepos,scored,portfolioScore,scores}=d;

  if(APP.tab==='overview'){
    const seen=new Set(),allSugg=[];
    topRepos.forEach(r=>(r.sugg||[]).forEach(s=>{if(!seen.has(s.t)){seen.add(s.t);allSugg.push(s);}}));
    allSugg.sort((a,b)=>({crit:0,rec:1,opt:2}[a.p])-({crit:0,rec:1,opt:2}[b.p]));
    return`
    <div class="sh"><div class="sh-dot" style="background:var(--acc2)"></div>Top ${topRepos.length} Repositories <span style="font-size:11px;color:var(--t3);font-weight:400;text-transform:none;letter-spacing:0;margin-left:4px">Click any card for full analysis</span></div>
    <div class="g3" style="margin-bottom:18px">${topRepos.map((r,i)=>repoCard(r,i+1,true)).join('')}</div>
    <div class="g2" style="margin-bottom:18px">
      <div class="card" style="padding:18px">
        <div class="sh"><div class="sh-dot" style="background:var(--grn)"></div>Score Breakdown</div>
        <div style="display:flex;justify-content:center">${pentagonRadar(scores)}</div>
      </div>
      <div class="card" style="padding:18px">
        <div class="sh"><div class="sh-dot" style="background:var(--pur)"></div>Repository Ranking</div>
        <div style="margin-bottom:12px">${topRepos.map(r=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="font-size:11px;font-weight:500;width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:0">${r.name}</span>
          <div class="bar-t" style="flex:1"><div class="bar-f" style="width:${r.sc.fin}%;background:${sCol(r.sc.fin)}"></div></div>
          <span style="font-family:var(--mono);font-size:11px;font-weight:700;color:${sCol(r.sc.fin)};width:20px;text-align:right;flex-shrink:0">${r.sc.fin}</span>
        </div>`).join('')}</div>
        <div class="div"></div>
        ${topRepos.map((r,i)=>`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
          <div style="display:flex;align-items:center;gap:6px">
            <div class="rnk" style="color:${RC[i]}">#${i+1}</div>
            <span style="font-size:11px;color:var(--t2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:110px">${r.name}</span>
          </div>
          <span class="badge ${r.sc.fin>=80?'b-green':r.sc.fin>=60?'b-blue':r.sc.fin>=40?'b-yellow':'b-red'}">${sBadge(r.sc.fin)}</span>
        </div>`).join('')}
      </div>
    </div>
    <div class="g2" style="margin-bottom:18px">
      <div class="card" style="padding:18px">
        <div class="sh"><div class="sh-dot" style="background:var(--acc2)"></div>Language Distribution</div>
        ${langBar(scored)}
      </div>
      <div class="card" style="padding:18px">
        <div class="sh"><div class="sh-dot" style="background:var(--ylw)"></div>Dimension Scores</div>
        ${scoreBar('Reputation',scores.reputation,'Stars, forks, and follower count')}
        ${scoreBar('Activity',scores.activity,'Recency, consistency, account longevity')}
        ${scoreBar('Technical Depth',scores.depth,'Project complexity and advanced signals')}
        ${scoreBar('Diversity',scores.diversity,'Language and project-type variety')}
        ${scoreBar('Quality',scores.quality,'Documentation, structure, deployment')}
      </div>
    </div>
    ${allSugg.length?`
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px">
      <div class="sh" style="margin-bottom:0"><div class="sh-dot" style="background:var(--red)"></div>Improvement Suggestions</div>
      <div style="display:flex;gap:5px">
        ${allSugg.filter(s=>s.p==='crit').length?`<span class="badge b-red">Critical ${allSugg.filter(s=>s.p==='crit').length}</span>`:''}
        ${allSugg.filter(s=>s.p==='rec').length?`<span class="badge b-yellow">Recommended ${allSugg.filter(s=>s.p==='rec').length}</span>`:''}
        ${allSugg.filter(s=>s.p==='opt').length?`<span class="badge b-blue">Optional ${allSugg.filter(s=>s.p==='opt').length}</span>`:''}
      </div>
    </div>
    <div class="card" style="padding:14px">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:6px">
        ${allSugg.slice(0,12).map(s=>{const cols={crit:'var(--red)',rec:'var(--ylw)',opt:'var(--acc2)'};return`<div class="chip"><div class="chip-dot" style="background:${cols[s.p]}"></div><span>${s.t}</span></div>`;}).join('')}
      </div>
    </div>`:''}`;
  }

  if(APP.tab==='ai'){
    if(!getCU())return`<div class="card" style="padding:36px;text-align:center">
      <div style="width:44px;height:44px;border-radius:8px;background:var(--s2);border:1px solid var(--border);margin:0 auto 14px;display:flex;align-items:center;justify-content:center">${ico('ai',22,'var(--acc2)')}</div>
      <h3 style="font-size:15px;font-weight:700;margin-bottom:7px">Sign In for AI Insights</h3>
      <p style="font-size:12px;color:var(--t2);line-height:1.65;margin-bottom:16px">AI analysis is available for logged-in users — strengths, weaknesses, career readiness, and 5 specific action items.</p>
      <div style="display:flex;gap:7px;justify-content:center">
        <button class="btn" style="width:auto;padding:9px 20px" onclick="APP.goto('auth','signup')">Create Free Account</button>
        <button class="btn-ghost" onclick="APP.goto('auth','login')">Sign In</button>
      </div>
    </div>`;
    if(APP.aiLoading)return`<div class="card" style="padding:36px;text-align:center">${ico('spinner',28,'var(--pur)','spin')}<p style="font-size:12px;color:var(--t2);margin-top:12px">Generating AI insights with Groq…</p></div>`;
    if(APP.aiErr)return`<div class="card" style="padding:24px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        ${ico('ai',18,'var(--red)')}
        <h3 style="font-size:14px;font-weight:700;color:var(--red)">Built-in Groq Keys Rate Limited</h3>
      </div>
      <p style="font-size:12px;color:var(--t2);line-height:1.65;margin-bottom:14px">The 4 built-in keys have all hit their free-tier rate limit. You need to add your own free key — it takes under 60 seconds.</p>
      <div class="card-flat" style="font-size:11px;color:var(--t2);line-height:2;margin-bottom:14px">
        <strong style="color:var(--text)">Step 1</strong> — Go to <a href="https://console.groq.com" target="_blank" style="color:var(--acc2)">console.groq.com</a> and sign up (free)<br>
        <strong style="color:var(--text)">Step 2</strong> — Click <strong>API Keys</strong> → <strong>Create API Key</strong><br>
        <strong style="color:var(--text)">Step 3</strong> — Copy the key (starts with <span class="code">gsk_</span>)<br>
        <strong style="color:var(--text)">Step 4</strong> — Paste it in Settings → Groq API Key → Save
      </div>
      <div style="display:flex;gap:7px">
        <button class="btn" style="flex:1" onclick="openSettings()">Open Settings</button>
        <a href="https://console.groq.com" target="_blank" class="btn-ghost" style="flex:1;text-align:center;padding:9px 14px;font-size:12px">Get Free Key</a>
      </div>
    </div>`;
    if(APP.aiData){
      const ai=APP.aiData,rc=ai.readiness?.includes('Not')?'var(--red)':ai.readiness?.includes('Partial')?'var(--ylw)':ai.readiness?.includes('Senior')?'var(--pur)':'var(--grn)';
      return`<div style="display:flex;flex-direction:column;gap:12px">
      <div class="g2">${insightBlock('Strengths',ai.strengths||[],'green')}${insightBlock('Areas to Improve',ai.weaknesses||[],'red')}</div>
      <div class="card" style="padding:16px"><div class="sh" style="margin-bottom:10px"><div class="sh-dot" style="background:var(--pur)"></div>AI Recommendations</div>${(ai.suggestions||[]).map((s,i)=>`<div class="ir"><div class="in-n">${i+1}</div><span>${s}</span></div>`).join('')}</div>
      <div class="g2">
        <div class="ib" style="border-top:1.5px solid ${rc}"><div class="it" style="color:var(--acc2)">Career Readiness</div><p style="font-size:18px;font-weight:800;color:${rc};margin-bottom:6px">${ai.readiness}</p><p style="font-size:12px;color:var(--t2);line-height:1.65">${ai.summary||''}</p></div>
        <div class="ib"><div class="it" style="color:var(--t3)">Analysis Info</div><div style="font-size:12px;color:var(--t2);line-height:2">Model: <span class="code">llama3-8b-8192</span><br>Provider: <strong style="color:var(--pur)">Groq</strong><br>Score: <span class="code">${portfolioScore}/100</span><br>Repos: <span class="code">${scored.length}</span></div></div>
      </div></div>`;
    }
    return`<div class="card" style="padding:36px;text-align:center">
      <div style="width:44px;height:44px;border-radius:8px;background:var(--s2);border:1px solid var(--border);margin:0 auto 14px;display:flex;align-items:center;justify-content:center">${ico('ai',22,'var(--pur)')}</div>
      <h3 style="font-size:15px;font-weight:700;margin-bottom:7px">Generate AI Insights</h3>
      <p style="font-size:12px;color:var(--t2);line-height:1.65;margin-bottom:16px">Analyze <strong>@${APP.username}</strong> with Groq AI — get real strengths, improvement areas, career readiness, and 5 specific recommendations.</p>
      <button class="btn" style="width:auto;padding:10px 24px" onclick="doAI()">Generate AI Insights</button>
    </div>`;
  }
  if(APP.tab==='progress')return`<div class="card" style="padding:18px">${progressView(APP.progress||[],APP.username)}</div>`;
  if(APP.tab==='roadmap'){const rm=APP.roadmap||localRoadmap(APP.data);return`<div class="card" style="padding:18px">${roadmapView(rm,APP.roadmapIsAI,getCU()?'doRoadmap()':null)}</div>`;}
  return'';
}

// ── PERSONAL DASHBOARD ────────────────────────────────────────────────────────
function vDash(){
  const d=APP.myData;
  if(!d){
    document.getElementById('root').innerHTML=`
    ${navbar({search:true,hamburger:true})}
    <div style="height:calc(100vh - 52px);display:flex;align-items:center;justify-content:center">
    <div style="text-align:center;max-width:300px">
      ${APP.myLoading?`${ico('spinner',28,'var(--acc2)','spin')}<p style="font-size:12px;color:var(--t2);margin-top:14px">Loading your dashboard…</p>`:`
      <h3 style="font-size:15px;font-weight:700;margin-bottom:7px">Set your GitHub username</h3>
      <p style="font-size:12px;color:var(--t2);line-height:1.65;margin-bottom:14px">Add your GitHub username in Settings to load your personal dashboard automatically.</p>
      <button class="btn" style="width:auto;padding:9px 20px" onclick="openSettings()">Open Settings</button>`}
    </div></div>
    ${APP.showSettings?settingsModal():''}`;
    if(APP.showSettings)requestAnimationFrame(attachStHandlers);
    return;
  }
  const{user,topRepos,allRepos,scored,portfolioScore,scores,total,totalStars,totalForks}=d;
  document.getElementById('root').innerHTML=`
  ${navbar({search:true})}
  <div class="dash-layout">
  <div class="sb-overlay" onclick="closeSidebar()"></div>

  <!-- SIDEBAR -->
  <div class="sidebar">
    <div class="sb-header">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        ${user.avatar_url?`<img src="${user.avatar_url}" width="28" height="28" style="border-radius:50%;border:1px solid var(--border)">`:''}
        <div style="min-width:0">
          <p style="font-size:12px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${user.name||user.login}</p>
          <p style="font-size:10px;color:var(--t3);font-family:var(--mono)">@${user.login}</p>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span style="font-family:var(--mono);font-size:20px;font-weight:700;color:${sCol(portfolioScore)}">${portfolioScore}</span>
        <span class="badge ${portfolioScore>=70?'b-green':portfolioScore>=55?'b-blue':'b-yellow'}" style="font-size:10px">${sTier(portfolioScore)}</span>
      </div>
    </div>

    <div class="sb-section">
      <div class="sb-label">Dashboard</div>
      <div class="sb-item ${APP.mt==='overview'?'on':''}" onclick="sMT('overview')">${ico('dash',12)} Overview</div>
      <div class="sb-item ${APP.mt==='ai'?'on':''}" onclick="sMT('ai')">${ico('ai',12)} AI Insights</div>
      <div class="sb-item ${APP.mt==='progress'?'on':''}" onclick="sMT('progress')">${ico('trending',12)} Progress</div>
      <div class="sb-item ${APP.mt==='roadmap'?'on':''}" onclick="sMT('roadmap')">${ico('map',12)} Roadmap</div>
      <div class="sb-item" onclick="window.location.href='repo-intel.html'">
        <svg width='12' height='12' viewBox='0 0 24 24' fill='none' style='flex-shrink:0'><circle cx='12' cy='5' r='2' stroke='currentColor' stroke-width='1.5'/><circle cx='5' cy='19' r='2' stroke='currentColor' stroke-width='1.5'/><circle cx='19' cy='19' r='2' stroke='currentColor' stroke-width='1.5'/><line x1='12' y1='7' x2='6.5' y2='17' stroke='currentColor' stroke-width='1.5'/><line x1='12' y1='7' x2='17.5' y2='17' stroke='currentColor' stroke-width='1.5'/></svg>
        Repo Intel
        <span style='font-size:9px;font-weight:700;padding:1px 5px;border-radius:3px;background:var(--acc-bg);color:var(--acc2);border:1px solid var(--acc-border);margin-left:auto;flex-shrink:0'>NEW</span>
      </div>
    </div>

    <div class="sb-section">
      <div class="sb-label">Repositories</div>
      <div class="sb-item ${APP.mt==='all'?'on':''}" onclick="sMT('all')">${ico('repo',12)} All (${(allRepos||[]).length})</div>
      <div class="sb-item ${APP.mt==='top6'?'on':''}" onclick="sMT('top6')">${ico('star',12,'var(--ylw)')} Top 6</div>
    </div>

    <div class="sb-divider"></div>
    <div class="sb-label" style="margin-top:4px">Quick Access</div>
    <div style="flex:1;overflow-y:auto">
      ${(allRepos||[]).slice(0,40).map(r=>`
      <div class="sb-item" onclick="openPanel('${r.name}','my')" title="${r.name}">
        ${ico('repo',11,'var(--t3)')}
        <span class="si-name">${r.name}</span>
        <span class="si-score" style="color:${sCol(r.sc?.fin||0)}">${r.sc?.fin||'—'}</span>
      </div>`).join('')}
    </div>

    <div class="sb-divider"></div>
    <div style="padding:8px 8px">
      <button class="btn-ghost-sm" style="width:100%;display:flex;align-items:center;gap:6px;justify-content:center" onclick="openSettings()">${ico('settings',11)} Settings</button>
    </div>
  </div>

  <!-- MAIN AREA -->
  <div class="main-area">
    <div class="main-content">
      <div id="my-pane">${renderMT()}</div>
    </div>
  </div>
  </div>

  <div class="detail-panel" id="dp">
    <div class="dp-header">
      <span style="font-size:13px;font-weight:700" id="dp-title">Repository Analysis</span>
      <button class="btn-ghost-sm" onclick="closePanel()">${ico('x',12)} Close</button>
    </div>
    <div id="dp-content" style="padding:18px"></div>
  </div>
  <div id="penta-tt" class="penta-tooltip">
    <div class="penta-tooltip-title" id="ptt-title"></div>
    <div class="penta-tooltip-score" id="ptt-score"></div>
    <div class="penta-tooltip-desc" id="ptt-desc"></div>
    <div style="font-size:11px;color:var(--grn);margin-top:6px" id="ptt-improve"></div>
  </div>
  ${APP.showSettings?settingsModal():''}`;
  if(APP.showSettings)requestAnimationFrame(attachStHandlers);
}

function renderMT(){
  const d=APP.myData;if(!d)return'';
  const{user,topRepos,allRepos,scored,portfolioScore,scores,total,totalStars,totalForks}=d;

  if(APP.mt==='overview')return`
  <div class="card" style="margin-bottom:12px;padding:16px">
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      ${scoreRing(portfolioScore,90)}
      <div style="flex:1;min-width:130px">
        <p style="font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;font-weight:600">Portfolio Score</p>
        <p style="font-size:19px;font-weight:800;color:${sCol(portfolioScore)};letter-spacing:-.3px;margin-bottom:3px">${sTier(portfolioScore)}</p>
        ${user.bio?`<p style="font-size:11px;color:var(--t2);margin-bottom:7px;line-height:1.5">${user.bio}</p>`:''}
        <p style="font-size:11px;color:var(--t2);line-height:1.6;margin-bottom:10px">${sDesc(portfolioScore)}</p>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
          ${[['Repos',total],['Stars',totalStars],['Forks',totalForks],['Followers',user.followers||0]].map(([l,v])=>`
          <div class="card-xs" style="text-align:center;padding:7px 4px">
            <div style="font-family:var(--mono);font-size:13px;font-weight:700;margin-bottom:2px">${v}</div>
            <div style="font-size:8px;color:var(--t3);text-transform:uppercase;letter-spacing:.3px;font-weight:600">${l}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px">
    ${[['Rep.',scores.reputation],['Act.',scores.activity],['Depth',scores.depth],['Div.',scores.diversity]].map(([l,v])=>`
    <div class="card-xs" style="text-align:center;padding:10px 6px">
      <div style="font-family:var(--mono);font-size:16px;font-weight:700;color:${sCol(v)};margin-bottom:2px">${v}</div>
      <div style="font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.3px;font-weight:600">${l}</div>
    </div>`).join('')}
  </div>
  <div class="g2" style="margin-bottom:14px">
    <div class="card" style="padding:16px">
      <div class="sh"><div class="sh-dot" style="background:var(--acc2)"></div>Pentagon Breakdown</div>
      <div style="display:flex;justify-content:center">${pentagonRadar(scores)}</div>
    </div>
    <div class="card" style="padding:16px">
      <div class="sh"><div class="sh-dot" style="background:var(--ylw)"></div>Dimension Scores</div>
      ${scoreBar('Reputation',scores.reputation,'Stars, forks, followers')}
      ${scoreBar('Activity',scores.activity,'Recency, consistency')}
      ${scoreBar('Technical Depth',scores.depth,'Complexity signals')}
      ${scoreBar('Diversity',scores.diversity,'Languages, project types')}
      ${scoreBar('Quality',scores.quality,'Docs, structure, deployment')}
    </div>
  </div>
  <div class="card" style="padding:16px">
    <div class="sh"><div class="sh-dot" style="background:var(--pur)"></div>Language Distribution</div>
    ${langBar(scored)}
  </div>`;

  if(APP.mt==='ai'){
    if(APP.aiLoading)return`<div class="card" style="padding:36px;text-align:center">${ico('spinner',28,'var(--pur)','spin')}<p style="font-size:12px;color:var(--t2);margin-top:12px">Generating AI insights…</p></div>`;
    if(APP.aiErr)return`<div class="card" style="padding:20px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">${ico('ai',16,'var(--red)')}<h3 style="font-size:13px;font-weight:700;color:var(--red)">AI Keys Rate Limited</h3></div>
      <div style="background:var(--s2);border:1px solid var(--border);border-radius:6px;padding:10px;margin-bottom:10px;font-size:11px;line-height:1.9;color:var(--t2)">
        1. <strong style="color:var(--text)">console.groq.com</strong> → Sign up free<br>2. API Keys → Create new key (starts with <span class="code">gsk_</span>)<br>3. Paste in Settings → Save → Try again
      </div>
      <button class="btn-sm" onclick="openSettings()">Add Key in Settings</button></div>`;
    if(APP.aiData){const ai=APP.aiData,rc=ai.readiness?.includes('Not')?'var(--red)':ai.readiness?.includes('Partial')?'var(--ylw)':ai.readiness?.includes('Senior')?'var(--pur)':'var(--grn)';return`<div style="display:flex;flex-direction:column;gap:12px"><div class="g2">${insightBlock('Strengths',ai.strengths||[],'green')}${insightBlock('Areas to Improve',ai.weaknesses||[],'red')}</div><div class="card" style="padding:16px"><div class="sh" style="margin-bottom:10px"><div class="sh-dot" style="background:var(--pur)"></div>Recommendations</div>${(ai.suggestions||[]).map((s,i)=>`<div class="ir"><div class="in-n">${i+1}</div><span>${s}</span></div>`).join('')}</div><div class="ib" style="border-top:1.5px solid ${rc}"><div class="it" style="color:${rc}">Career Readiness</div><p style="font-size:18px;font-weight:800;color:${rc};margin-bottom:6px">${ai.readiness}</p><p style="font-size:12px;color:var(--t2);line-height:1.65">${ai.summary||''}</p></div></div>`;}
    return`<div class="card" style="padding:32px;text-align:center"><h3 style="font-size:15px;font-weight:700;margin-bottom:7px">Generate AI Insights</h3><p style="font-size:12px;color:var(--t2);margin-bottom:14px">Full AI analysis of your GitHub portfolio — strengths, weaknesses, career readiness, and action items.</p><button class="btn" style="width:auto;padding:9px 22px" onclick="doAI('my')">Generate AI Insights</button></div>`;
  }
  if(APP.mt==='progress')return`<div class="card" style="padding:18px">${progressView(APP.progress||[],d.user.login)}</div>`;
  if(APP.mt==='roadmap'){const rm=APP.roadmap||localRoadmap(APP.myData);return`<div class="card" style="padding:18px">${roadmapView(rm,APP.roadmapIsAI,'doRoadmap()')}</div>`;}
  if(APP.mt==='all')return`<div><div class="sh"><div class="sh-dot" style="background:var(--acc2)"></div>All Repositories (${(allRepos||[]).length}) <span style="color:var(--t3);font-weight:400;text-transform:none;letter-spacing:0;font-size:11px;margin-left:4px">Click any card for deep analysis</span></div><div class="g3">${(allRepos||[]).map(r=>repoCard(r,undefined,true,'my')).join('')}</div></div>`;
  if(APP.mt==='top6')return`<div><div class="sh"><div class="sh-dot" style="background:var(--ylw)"></div>Top 6 by Score</div><div class="g3">${(topRepos||[]).map((r,i)=>repoCard(r,i+1,true,'my')).join('')}</div></div>`;
  return'';
}
