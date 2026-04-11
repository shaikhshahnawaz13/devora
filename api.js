// DEVORA — API Layer
const SB_URL_D = 'https://egzrgvyagfceyzxqwtsa.supabase.co';
const SB_KEY_D = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnenJndnlhZ2ZjZXl6eHF3dHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTY3MTksImV4cCI6MjA4OTU3MjcxOX0.RNy7Mh-GjfYxCDbcoyu7CW39ubZufLUfQJxzXimrvjY';
const GH_TK_D = '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';
// Built-in keys — may hit rate limits. Add your own in Settings for reliable AI.
// NOTE: Built-in keys may hit daily rate limits (free tier = 14400 req/day shared).
// If AI features aren't working, add your own free key in Settings.
// Get one in 60 seconds: console.groq.com → API Keys → Create
const GROQ_KEYS = [
  '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',
  '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',
  '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',
  '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',
];
// Models — fastest/cheapest first, fallback to others
const GROQ_MODELS = ['llama-3.3-70b-versatile','llama-3.1-8b-instant','llama3-8b-8192','gemma2-9b-it','llama-3.2-11b-vision-preview','llama-3.2-3b-preview'];
let _groqKeyStatus = {}; // track expired/bad keys
// Track which keys have been rate-limited this session
const _rlKeys = new Set();
let _gki = 0, _gh = localStorage.getItem('dv_gh') || GH_TK_D;
let _groq = localStorage.getItem('dv_groq') || '';
let _sbUrl = localStorage.getItem('dv_sb_url') || SB_URL_D;
let _sbKey = localStorage.getItem('dv_sb_key') || SB_KEY_D;
let _sb = null, _cu = null;
window._rl = null;

function setGhToken(t){ _gh = t||GH_TK_D; t ? localStorage.setItem('dv_gh',t) : localStorage.removeItem('dv_gh'); }
function setGroqKey(k){ _groq = k; k ? localStorage.setItem('dv_groq',k) : localStorage.removeItem('dv_groq'); }
function getSB(){ return _sb; } function getCU(){ return _cu; }
function getGroqKey(){ return _groq; }
function getCUGithubUsername(){ return _cu?.user_metadata?.github_username||''; }

// ── GITHUB ────────────────────────────────────────────────────────────────
async function ghFetch(path){
  const h={'Accept':'application/vnd.github.v3+json'};
  if(_gh) h['Authorization']='Bearer '+_gh;
  const r=await fetch('https://api.github.com'+path,{headers:h});
  const rem=r.headers.get('X-RateLimit-Remaining');
  if(rem!==null) window._rl=parseInt(rem);
  if(r.status===401) throw{msg:'GitHub token invalid.'};
  if(r.status===403) throw{msg:'GitHub API rate limit reached.'};
  if(r.status===404) throw{status:404};
  if(!r.ok) throw{msg:'GitHub API error: '+r.status};
  return r.json();
}
const ghSafe=async p=>{try{return await ghFetch(p);}catch{return null;}};

async function loadAllRepos(username){
  let repos=[],pg=1;
  while(pg<=5){
    const b=await ghFetch('/users/'+username+'/repos?per_page=100&page='+pg+'&type=owner&sort=updated');
    repos=[...repos,...b]; if(b.length<100)break; pg++;
  }
  return repos;
}
async function loadRepoDetail(username,name){
  const[cs,rd]=await Promise.all([
    ghSafe('/repos/'+username+'/'+name+'/contents'),
    ghSafe('/repos/'+username+'/'+name+'/readme')
  ]);
  let codeContent='';
  if(!Array.isArray(cs))return{cs,rd,codeContent};

  const n=cs.map(f=>f.name.toLowerCase());
  const dirs=cs.filter(f=>f.type==='dir').map(f=>f.name.toLowerCase());
  const grab=async(path,limit=10000)=>{
    try{const f=await ghSafe('/repos/'+username+'/'+name+'/contents/'+path);if(f?.content){const t=atob(f.content.replace(/\n/g,''));return t.slice(0,limit);}return'';}catch{return'';}
  };
  const grabDir=async(dir,limit=6000)=>{
    try{const files=await ghSafe('/repos/'+username+'/'+name+'/contents/'+dir);if(!Array.isArray(files))return'';const main=files.find(f=>['index.js','index.ts','app.js','app.ts','main.js','main.ts','server.js','index.html'].includes(f.name.toLowerCase()));if(main)return await grab(dir+'/'+main.name,limit);return'';}catch{return'';}
  };

  // PRIORITY 1: package.json — most reliable, reveals ALL deps
  if(n.includes('package.json')) codeContent+=await grab('package.json',15000);
  if(n.includes('requirements.txt')) codeContent+=await grab('requirements.txt',6000);
  if(n.includes('go.mod')) codeContent+=await grab('go.mod',5000);
  if(n.includes('cargo.toml')) codeContent+=await grab('Cargo.toml',5000);
  if(n.includes('pyproject.toml')) codeContent+=await grab('pyproject.toml',5000);

  // PRIORITY 2: Single-file apps (like OtakuVault) — fetch FULL file
  // These apps embed everything (supabase calls, auth, etc.) inside index.html or a single JS file
  if(n.includes('index.html')){
    const html=await grab('index.html',120000); // very large limit — single-file apps can be 50k+
    codeContent+=html;
  }
  // Also grab any top-level JS files that aren't entry points
  const jsFiles=cs.filter(f=>f.name.endsWith('.js')&&!['app.js','index.js','main.js','server.js'].includes(f.name.toLowerCase())).slice(0,3);
  for(const jf of jsFiles) codeContent+=await grab(jf.name,8000);

  // PRIORITY 3: Main JS/TS entry points
  const mainFiles=['index.js','index.ts','app.js','app.ts','main.js','main.ts','server.js','server.ts'];
  for(const mf of mainFiles){
    const idx=n.indexOf(mf);
    if(idx>=0){codeContent+=await grab(cs[idx].name,12000);break;}
  }

  // PRIORITY 4: Supabase/Firebase config files (presence = strong signal)
  if(n.some(x=>x.includes('supabase')||x.includes('firebase'))){
    codeContent+=' supabase.auth supabase.from firebase.auth firebase.firestore ';
  }
  // Supabase config in environment
  if(n.includes('.env.example')) codeContent+=await grab('.env.example',3000);
  if(n.includes('.env.sample')) codeContent+=await grab('.env.sample',3000);
  // Supabase project URL in any config
  const cfgFiles=['config.js','config.ts','supabase.js','supabase.ts','firebase.js','firebase.ts','db.js','db.ts','auth.js','auth.ts'];
  for(const cf of cfgFiles){
    if(n.includes(cf)){codeContent+=await grab(cf,5000);}
  }

  // PRIORITY 5: Key source directories — fetch multiple files for better coverage
  for(const dir of ['src','app','lib','api','backend','server','routes','controllers','utils','helpers','services']){
    if(dirs.includes(dir)){
      try{
        const dirFiles=await ghSafe('/repos/'+username+'/'+name+'/contents/'+dir);
        if(Array.isArray(dirFiles)){
          const codeFiles=dirFiles.filter(f=>f.name.endsWith('.js')||f.name.endsWith('.ts')||f.name.endsWith('.py')||f.name.endsWith('.go')||f.name.endsWith('.rs')).slice(0,5);
          for(const cf of codeFiles) codeContent+=await grab(dir+'/'+cf.name,8000);
        }
      }catch{}
      break;
    }
  }
  // Also check pages/ and components/ for Next.js / React apps
  for(const dir of ['pages','components','views']){
    if(dirs.includes(dir)){
      try{
        const dirFiles=await ghSafe('/repos/'+username+'/'+name+'/contents/'+dir);
        if(Array.isArray(dirFiles)){
          const apiDir=dirFiles.find(f=>f.type==='dir'&&f.name==='api');
          if(apiDir) codeContent+=await grabDir(dir+'/api',8000);
          const firstFile=dirFiles.find(f=>f.name.endsWith('.js')||f.name.endsWith('.ts')||f.name.endsWith('.jsx')||f.name.endsWith('.tsx'));
          if(firstFile) codeContent+=await grab(dir+'/'+firstFile.name,5000);
        }
      }catch{}
      break;
    }
  }

  return{cs,rd,codeContent};
}

// ── GROQ ──────────────────────────────────────────────────────────────────
async function callGroq(prompt){
  const tryKeyModel=async(k,model)=>{
    try{
      const ctrl=new AbortController();
      const tid=setTimeout(()=>ctrl.abort(),30000);
      const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{
        method:'POST',
        headers:{'Authorization':'Bearer '+k,'Content-Type':'application/json'},
        body:JSON.stringify({model,messages:[{role:'user',content:prompt}],max_tokens:800,temperature:0.3}),
        signal:ctrl.signal
      });
      clearTimeout(tid);
      if(r.status===429) return{err:429}; // rate limited
      if(r.status===401) return{err:401}; // bad key
      if(r.status===503||r.status===500) return{err:r.status}; // server error, try next model
      if(!r.ok){const body=await r.json().catch(()=>({}));console.warn('Groq err',r.status,body);return{err:r.status};}
      const d=await r.json();
      const raw=d.choices?.[0]?.message?.content||null;
      if(!raw) return{err:'empty'};
      const txt=raw.replace(/^```[a-z]*/,'').replace(/```$/,'').trim();
      return{txt};
    }catch(e){
      if(e.name==='AbortError') return{err:'timeout'};
      return{err:'network'};
    }
  };
  
  // Try custom key first with all models
  if(_groq){
    for(const model of GROQ_MODELS){
      const r=await tryKeyModel(_groq,model);
      if(r.txt) return r.txt;
      if(r.err===401) break; // bad key, stop trying
      if(r.err==='timeout'||r.err==='network') return null;
    }
  }
  
  // Try all built-in keys x models, skip rate-limited keys
  for(let i=0;i<GROQ_KEYS.length;i++){
    if(_rlKeys.has(i)) continue; // skip keys known to be rate limited
    let keyWorked=false;
    for(const model of GROQ_MODELS){
      const r=await tryKeyModel(GROQ_KEYS[i],model);
      if(r.txt){_gki=i;return r.txt;}
      if(r.err==='timeout'||r.err==='network') return null;
      if(r.err===429){_rlKeys.add(i);break;} // mark key as rate-limited
      if(r.err===401) break; // bad key
    }
  }
  window._groqAllRateLimited=true; // flag for UI to show "add your own key"
  return null;
}

async function getAIInsights(data){
  const{user,topRepos,portfolioScore,scores}=data;
  // Build rich repo context including skills used
  const repDetail=topRepos.slice(0,6).map(r=>{
    const sigs=(r._depthSigs||[]).map(s=>s.label).join(',');
    const type=r._type||'project';
    const deployed=r.f?.deploy?'deployed':'not-deployed';
    const tested=r.f?.t?'has-tests':'no-tests';
    return `${r.name}[lang:${r.language||'?'} type:${type} stars:${r.stargazers_count} depth:${r._depthScore||0} complexity:${r._complexity||0} signals:${sigs||'none'} ${deployed} ${tested}]`;
  }).join('; ');
  const langs=[...new Set(topRepos.map(r=>r.language).filter(Boolean))].join(', ');
  const signals=[...new Set(topRepos.flatMap(r=>(r._depthSigs||[]).map(s=>s.label)))].join(', ');
  const p=`You are a senior software engineering career coach. Analyze this specific developer's GitHub portfolio and give SPECIFIC, PERSONALIZED feedback — not generic advice. Reference their actual repos and skills by name.

Developer: ${user.login} | Overall Score: ${portfolioScore}/100
Dimension scores — Reputation:${scores.reputation} Activity:${scores.activity} TechnicalDepth:${scores.depth} Diversity:${scores.diversity} Quality:${scores.quality}
Languages they use: ${langs||'unknown'}
Technical signals detected: ${signals||'none'}
Stars:${data.totalStars} Followers:${user.followers||0} Total repos:${data.total}
Repository details: ${repDetail}

Rules:
1. MENTION SPECIFIC REPO NAMES in your feedback
2. MENTION SPECIFIC SKILLS (e.g. "your AutoReadme uses AI/ML which shows...") 
3. Weaknesses should reference what is MISSING from their specific repos
4. Suggestions must be actionable steps specific to THIS developer
5. Readiness must reflect actual evidence from their repos

Respond ONLY with valid JSON (no markdown):
{"strengths":["specific strength mentioning actual repo or skill","s2","s3"],"weaknesses":["specific gap based on their actual repos","w2","w3"],"suggestions":["specific action for this developer","a2","a3","a4","a5"],"readiness":"Not Ready","summary":"one honest sentence mentioning their actual strongest repo or skill"}
readiness: Not Ready | Partially Ready | Job Ready | Senior Ready`;
  const raw=await callGroq(p);
  if(!raw)return null;
  try{return JSON.parse(raw);}
  catch{const m=raw.match(/\{[\s\S]*\}/);if(m)try{return JSON.parse(m[0]);}catch{}return null;}
}

async function getAIRoadmap(data){
  const{user,scores,topRepos}=data;
  const langs=[...new Set(topRepos.map(r=>r.language).filter(Boolean))].slice(0,5).join(', ');
  const skills=[...new Set(topRepos.flatMap(r=>(r._depthSigs||[]).map(s=>s.label)))].join(', ');
  const repoNames=topRepos.map(r=>r.name).join(', ');
  const types=[...new Set(topRepos.map(r=>r._type))].join(', ');
  const hasTests=topRepos.some(r=>r.f&&r.f.t);
  const hasDeployment=topRepos.some(r=>r.f&&r.f.deploy);
  const hasFullstack=topRepos.some(r=>r._type==='fullstack');
  const gaps=[!hasTests?'no tests':'',!hasDeployment?'nothing deployed':'',!hasFullstack?'no full-stack project':'',scores.depth<40?'low technical depth':''].filter(Boolean).join(', ');
  const p=`Senior engineering mentor. Create a PERSONALIZED 5-step roadmap for this developer. Reference their real repos and skills by name. Build on their existing skills.

Developer: ${user.login} | Score: ${data.portfolioScore}/100
Their repos: ${repoNames}
Languages they use: ${langs||'unknown'} | Project types: ${types}
Skills they already have: ${skills||'none detected'}
Gaps to fix: ${gaps||'general improvement'}
Scores — Depth:${scores.depth} Diversity:${scores.diversity} Activity:${scores.activity} Quality:${scores.quality}

Respond ONLY with valid JSON (no markdown, no extra text):
{"steps":[{"title":"specific title","description":"2-3 sentences specific to their tech stack and repos","priority":"high","timeframe":"2-3 weeks"},{"title":"t","description":"d","priority":"medium","timeframe":"t"},{"title":"t","description":"d","priority":"high","timeframe":"t"},{"title":"t","description":"d","priority":"medium","timeframe":"t"},{"title":"t","description":"d","priority":"low","timeframe":"ongoing"}],"focus":"one sentence mentioning their specific next step"}`;
  const raw=await callGroq(p);
  if(!raw)return null;
  try{return JSON.parse(raw);}
  catch{const m=raw.match(/\{[\s\S]*\}/);if(m)try{return JSON.parse(m[0]);}catch{}return null;}
}

// ── SUPABASE ──────────────────────────────────────────────────────────────
function initSB(cb){
  if(!window.supabase||!_sbUrl||!_sbKey)return;
  try{
    _sb=window.supabase.createClient(_sbUrl,_sbKey);
    _sb.auth.onAuthStateChange((ev,sess)=>{_cu=sess?.user||null;if(cb)cb(ev,sess);});
    _sb.auth.getSession().then(({data})=>{_cu=data.session?.user||null;if(cb)cb('INITIAL',data.session);});
  }catch(e){console.warn('SB init:',e.message);}
}
function setSBConfig(url,key){
  if(url){_sbUrl=url;localStorage.setItem('dv_sb_url',url);}
  if(key){_sbKey=key;localStorage.setItem('dv_sb_key',key);}
  _sb=null;
}
async function sbSignUp(email,pass,meta){
  if(!_sb)return{error:'Supabase not configured.'};
  try{
    const{data,error}=await _sb.auth.signUp({email,password:pass,options:{data:meta||{}}});
    if(error)return{error:error.message};
    if(data.user&&!data.session)return{msg:'Check your email to confirm, then sign in.'};
    return{success:true};
  }catch(e){return{error:e.message};}
}
async function sbSignIn(email,pass){
  if(!_sb)return{error:'Supabase not configured.'};
  try{const{error}=await _sb.auth.signInWithPassword({email,password:pass});if(error)return{error:error.message};return{success:true};}
  catch(e){return{error:e.message};}
}
async function sbSignOut(){if(_sb)try{await _sb.auth.signOut();}catch{} _cu=null;}
async function sbResetPw(email){
  if(!_sb)return{error:'Supabase not configured.'};
  try{const{error}=await _sb.auth.resetPasswordForEmail(email,{redirectTo:window.location.href});if(error)return{error:error.message};return{msg:'Reset email sent. Check your inbox.'};}
  catch(e){return{error:e.message};}
}
async function sbSave(ghUser,d){
  if(!_sb||!_cu)return;
  try{await _sb.from('devora_analyses').insert({user_id:_cu.id,github_username:ghUser,portfolio_score:d.portfolioScore,scores:d.scores,ai_insights:d.aiData||null,created_at:new Date().toISOString()});}catch{}
}
async function sbLoadProgress(ghUser){
  if(!_sb||!_cu)return[];
  try{const{data}=await _sb.from('devora_analyses').select('portfolio_score,created_at').eq('github_username',ghUser).order('created_at',{ascending:true}).limit(15);return data||[];}
  catch{return[];}
}
async function sbUpdateGhUser(username){
  if(!_sb||!_cu)return;
  try{
    await _sb.auth.updateUser({data:{..._cu.user_metadata,github_username:username}});
    if(_cu.user_metadata)_cu.user_metadata.github_username=username;
  }catch{}
}
