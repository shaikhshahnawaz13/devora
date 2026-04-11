// DEVORA — Scoring Engine v2
// Philosophy: Skill > Popularity. Complexity > Stars. Usefulness > Fame.

// ── README PARSER ────────────────────────────────────────────────────────────
function parseRM(enc){
  if(!enc)return{wc:0,h:0,cb:0,lk:0,bd:0,text:''};
  let t='';try{t=atob(enc.replace(/\n/g,''));}catch{return{wc:0,h:0,cb:0,lk:0,bd:0,text:''};}
  return{wc:t.trim().split(/\s+/).filter(Boolean).length,h:(t.match(/^#{1,3}\s/gm)||[]).length,cb:Math.floor((t.match(/```/g)||[]).length/2),lk:(t.match(/\[.+?\]\(.+?\)/g)||[]).length,bd:(t.match(/shields\.io|badge\./gi)||[]).length,text:t.slice(0,4000)};
}
function rmScore(m){
  const wc=m.wc===0?0:m.wc<50?18:m.wc<150?42:m.wc<300?65:m.wc<500?82:100;
  return Math.round(wc*.34+(m.h===0?0:m.h<2?38:m.h<=3?68:100)*.22+(m.cb===0?0:m.cb===1?60:100)*.22+(m.lk===0?0:50)*.12+(m.bd?100:0)*.10);
}

// ── FILE DETECTOR ─────────────────────────────────────────────────────────────
function detectFiles(cs,repo){
  if(!Array.isArray(cs))return{r:0,l:0,g:0,c:0,ci:0,dep:0,t:0,deploy:0,src:0,cfg:0,docker:0,topics:0};
  const n=cs.map(f=>f.name.toLowerCase()),d=cs.filter(f=>f.type==='dir').map(f=>f.name.toLowerCase());
  return{
    r:+n.some(x=>x.startsWith('readme')),l:+n.some(x=>x.startsWith('license')||x==='copying'),
    g:+n.includes('.gitignore'),c:+n.some(x=>x.startsWith('contributing')),
    ci:+(n.includes('.travis.yml')||n.includes('jenkinsfile')||d.includes('.github')),
    dep:+n.some(x=>['package.json','requirements.txt','pom.xml','cargo.toml','go.mod','gemfile','setup.py','pyproject.toml'].includes(x)),
    t:+d.some(x=>['tests','test','spec','__tests__'].includes(x)),
    deploy:+(!!(repo?.homepage||repo?.has_pages)||n.some(x=>['vercel.json','netlify.toml','render.yaml','_config.yml'].includes(x))),
    src:+d.some(x=>['src','app','lib','core','pkg','cmd','internal'].includes(x)),
    cfg:+n.some(x=>['tsconfig.json','vite.config.js','webpack.config.js','tailwind.config.js','next.config.js','jest.config.js','cargo.toml','go.mod','cmake.txt','makefile'].includes(x)),
    docker:+n.some(x=>['dockerfile','docker-compose.yml','docker-compose.yaml'].includes(x)),
    topics:+(repo?.topics?.length>0)
  };
}

// ── PROJECT TYPE ──────────────────────────────────────────────────────────────
function detectType(cs,repo){
  if(!Array.isArray(cs))return'project';
  const n=cs.map(f=>f.name.toLowerCase()),d=cs.filter(f=>f.type==='dir').map(f=>f.name.toLowerCase());
  const desc=(repo.description||'').toLowerCase(),lang=(repo.language||'').toLowerCase();
  if(n.some(x=>['cli.js','cli.ts','bin.js','main.rs','main.go'].includes(x))||d.includes('bin')||desc.includes('command line')||desc.includes('cli tool'))return'cli';
  if(d.some(x=>['frontend','backend','client','server','api'].includes(x)))return'fullstack';
  if(n.some(x=>['server.js','app.py','main.go','app.rb','manage.py','main.rs','index.ts'].includes(x))||d.some(x=>['routes','controllers','middleware','models','migrations','handlers'].includes(x)))return'backend';
  if(n.some(x=>x.endsWith('.ipynb'))||lang==='jupyter notebook'||desc.match(/machine learning|neural network|deep learning|dataset/))return'ml-ai';
  if(n.some(x=>['vite.config.js','vite.config.ts','next.config.js','nuxt.config.js','angular.json'].includes(x))||d.some(x=>['components','pages','views','hooks','context'].includes(x)))return'frontend-app';
  if(lang==='html'||(n.includes('index.html')&&!n.some(x=>['server.js','app.py','main.go'].includes(x))))return'static';
  // System/kernel level code
  if(['c','c++','rust','assembly','zig','cuda'].includes(lang)&&(repo.size>5000||repo.stargazers_count>100))return'system';
  return'project';
}

// ── TECHNICAL DEPTH ───────────────────────────────────────────────────────────
// CODE-FIRST: actual code/file detection = full pts, README-only = half pts
// This prevents gaming by just writing keywords in README
function detectDepth(cs,rmText,repo,codeContent){
  if(!Array.isArray(cs))return{signals:[],score:0,complexity:0,usefulness:0};
  const n=cs.map(f=>f.name.toLowerCase()),d=cs.filter(f=>f.type==='dir').map(f=>f.name.toLowerCase());
  const code=(codeContent||'').toLowerCase();
  const readme=(rmText||'').toLowerCase();
  const desc=(repo.description||'').toLowerCase();
  const lang=(repo.language||'').toLowerCase();
  const hasCode=code.length>50; // do we actually have code content?
  const sigs=[];

  // Signal confidence tiers:
  // code = file/dep/actual-code detection = full pts (most reliable)
  // readme = README mentions (unreliable — people write about tools they use, not implement)
  //          Only add readme signal if no code signal AND very specific keywords
  const addSig=(label,icon,fullPts,codeDetected,readmeDetected)=>{
    if(codeDetected) sigs.push({label,icon,pts:fullPts,source:'code'});
    else if(readmeDetected&&!codeDetected) sigs.push({label,icon,pts:Math.ceil(fullPts*.30),source:'readme'});
  };

  // ── AUTH ──────────────────────────────────────────────────────────────────
  const authFiles=n.some(x=>['passport.js','auth.js','auth.ts','jwt.js','session.js','middleware.js','auth.html'].includes(x))||d.some(x=>['auth','authentication','middleware'].includes(x));
  const authCode=hasCode&&/(supabase\.auth\.|supabase\.auth\[|auth\.signIn|auth\.signUp|auth\.signOut|createClient.*supabase|\.signInWithPassword|\.signInWithOAuth|bcrypt\.|jsonwebtoken|passport\.use|express-session|req\.user\b|jwt\.sign|jwt\.verify|firebase\.auth|useAuth|AuthContext|isLoggedIn|currentUser)/i.test(code);
  const authReadme=/\b(supabase auth|firebase auth|nextauth|auth0|passport\.js|bcrypt|jsonwebtoken|jwt authentication|oauth flow|user auth system)\b/i.test(readme+' '+desc);
  addSig('Auth','lock',15,authFiles||authCode,authReadme);

  // ── DATABASE ──────────────────────────────────────────────────────────────
  const dbFiles=d.some(x=>['models','migrations','schema','db','database'].includes(x))||n.some(x=>['schema.prisma','knexfile.js','db.js','database.js','models.js','schema.sql'].includes(x));
  const dbCode=hasCode&&/(supabase\.from\(|supabase\.from\[|\.from\('|\bfrom\(\s*'|mongoose\.|prisma\.|sequelize\.|typeorm\.|db\.collection|db\.query|collection\(|findOne\(|redis\.|sqlite3|pg\.|mysql\.|firebase\.firestore|getFirestore|ref\(database|snapshot\.val|onValue)/i.test(code);
  const dbReadme=/(mongodb|postgresql|mysql|supabase|firebase|prisma|sequelize|mongoose|typeorm|redis|dynamodb|sqlite|neon|planetscale|cockroachdb)/i.test(readme+' '+desc);
  addSig('Database','database',15,dbFiles||dbCode,dbReadme);

  // ── API DESIGN ─────────────────────────────────────────────────────────────
  const apiFiles=d.some(x=>['api','routes','controllers','endpoints','handlers'].includes(x));
  const apiCode=hasCode&&/(fetch\(|axios\.|XMLHttpRequest|app\.get|app\.post|app\.put|app\.delete|router\.|express\(\)|fastapi|flask\.route|django\.urls|\.then\(res|\.then\(response|\.json\(\)|async.*fetch|await fetch)/i.test(code);
  const apiReadme=/(rest api|graphql|webhook|openapi|swagger|fastapi|express api|api endpoints|fetch api)/i.test(readme+' '+desc);
  addSig('API Design','api',12,apiFiles||apiCode,apiReadme);

  // ── AI / ML ──────────────────────────────────────────────────────────────
  const aiCode=hasCode&&/(openai\.|anthropic\.|groq\.chat|fetch\(['"](https:\/\/api\.openai|https:\/\/api\.groq|https:\/\/api\.anthropic)|new OpenAI|new Anthropic|ChatOpenAI|langchain|tensorflow|torch|sklearn|model\.predict|pipeline\(|from_pretrained)/i.test(code);
  const aiReadme=/ai.powered|built with (openai|groq|anthropic|claude)|integrates.*ai|ai chatbot|ai assistant|ai feature|trained model|fine.tuned|llm.powered/i.test(readme+' '+desc);
  addSig('AI/ML','ai',20,aiCode,aiReadme);

  // ── TESTING ───────────────────────────────────────────────────────────────
  const testFiles=d.some(x=>['tests','test','spec','__tests__','e2e','cypress'].includes(x))||n.some(x=>['jest.config.js','jest.config.ts','pytest.ini','cypress.config.js','vitest.config.js','playwright.config.ts','.mocharc.js'].includes(x));
  // Tests must be file-based — README mentions don't count
  if(testFiles) sigs.push({label:'Testing',icon:'test',pts:12,source:'code'});

  // ── DOCKER ───────────────────────────────────────────────────────────────
  if(n.some(x=>['dockerfile','docker-compose.yml','docker-compose.yaml'].includes(x)))
    sigs.push({label:'Docker',icon:'docker',pts:10,source:'code'});

  // ── CI/CD ─────────────────────────────────────────────────────────────────
  if(n.includes('.travis.yml')||n.includes('jenkinsfile')||d.includes('.github'))
    sigs.push({label:'CI/CD',icon:'ci',pts:8,source:'code'});

  // ── TYPESCRIPT ────────────────────────────────────────────────────────────
  if(lang==='typescript'||n.includes('tsconfig.json'))
    sigs.push({label:'TypeScript',icon:'ts',pts:8,source:'code'});

  // ── REAL-TIME ─────────────────────────────────────────────────────────────
  const rtCode=hasCode&&/(new WebSocket|io\.connect|socket\.on|socket\.emit|EventSource|supabase\.channel|supabase\.realtime|pusher\.|Pusher\()/i.test(code);
  const rtReadme=/(websocket|socket\.io|real-?time|sse|server-sent|live updates|realtime database|realtime updates)/i.test(readme+' '+desc);
  addSig('Real-time','rt',12,rtCode,rtReadme);

  // ── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const stateCode=hasCode&&/(createStore|configureStore|useReducer|createContext|createSlice|redux|zustand|recoil|mobx|vuex|pinia|xstate)/i.test(code);
  const stateReadme=/(redux|zustand|recoil|mobx|vuex|pinia|xstate|state management)/i.test(readme+' '+desc);
  addSig('State Mgmt','state',8,stateCode,stateReadme);

  // ── SYSTEMS PROGRAMMING ───────────────────────────────────────────────────
  const sysLangs=['c','c++','rust','zig','assembly','cuda','go','haskell','ocaml'];
  if(sysLangs.includes(lang)){
    const pts=(['rust','zig','assembly','cuda'].includes(lang))?20:(['c','c++'].includes(lang))?18:12;
    sigs.push({label:'Systems Programming',icon:'code',pts,source:'code'});
  }

  // ── STORAGE / FILE SYSTEM ────────────────────────────────────────────────
  const storageCode=hasCode&&/(localStorage\.|sessionStorage\.|indexedDB\.|FileReader|FormData|storage\.|supabase\.storage|firebase\.storage|s3\.|cloudinary\.|multer\.|sharp\.|jimp\.)/i.test(code);
  if(storageCode) sigs.push({label:'Storage',icon:'database',pts:8,source:'code'});

  // Score: code signals worth full pts, readme signals worth half
  const totalPts=sigs.reduce((s,x)=>s+x.pts,0);

  // Complexity
  const hasSrcStructure=d.some(x=>['src','lib','core','pkg','cmd','internal'].includes(x));
  const hasMultipleLayers=d.length>4;
  const codeSigs=sigs.filter(s=>s.source==='code').length;
  const complexity=Math.min(100,
    (repo.size>50000?40:repo.size>10000?30:repo.size>2000?20:repo.size>500?12:5)+
    (codeSigs>=5?30:codeSigs>=3?20:codeSigs>=1?10:0)+
    (hasSrcStructure?20:0)+(hasMultipleLayers?10:0)
  );

  // Usefulness
  const ageMonths=(Date.now()-new Date(repo.created_at))/(864e5*30);
  const starsPerMonth=ageMonths>0?repo.stargazers_count/ageMonths:0;
  const hasLiveDemo=!!(repo.homepage)||n.some(x=>['vercel.json','netlify.toml'].includes(x));
  const hasGoodDesc=(repo.description||'').length>30;
  const isUsed=repo.forks_count>5||starsPerMonth>0.5||repo.watchers_count>3;
  const usefulness=Math.min(100,
    (hasLiveDemo?35:0)+(isUsed?30:0)+(hasGoodDesc?15:0)+(repo.topics?.length>2?10:5)+
    (repo.open_issues_count>0?5:0)
  );

  return{signals:sigs,score:Math.min(100,totalPts),complexity,usefulness};
}

// ── PER-REPO SCORING ──────────────────────────────────────────────────────────
// New formula: Skill-focused, not popularity-focused
function repoQuality(f,rs){
  return Math.min(100,Math.round(
    (f.r?rs:0)*.28+(f.l?100:0)*.14+(f.g?100:0)*.11+(f.dep?100:0)*.11+
    (f.ci?100:0)*.10+(f.t?100:0)*.10+(f.deploy?100:0)*.07+(f.topics?100:0)*.07+
    (f.src?100:0)*.01+(f.cfg?100:0)*.01
  ));
}
function repoActivity(repo){
  const dy=(Date.now()-new Date(repo.pushed_at))/864e5;
  const rc=dy<7?100:dy<30?88:dy<90?72:dy<180?48:dy<365?24:8;
  const age=(Date.now()-new Date(repo.created_at))/(864e5*30);
  const lon=age<1?20:age<3?40:age<6?60:age<12?75:age<24?88:100;
  const sz=repo.size<100?20:repo.size<1000?50:repo.size<5000?72:repo.size<20000?88:100;
  return Math.round(rc*.50+lon*.30+sz*.20);
}

// Popularity is now just community reach — does NOT dominate the score
function repoReach(repo){
  const st=repo.stargazers_count,fk=repo.forks_count;
  const ss=st===0?5:st<5?15:st<20?28:st<100?42:st<500?58:st<2000?72:st<10000?86:100;
  const fs=fk===0?5:fk<3?18:fk<20?32:fk<100?50:fk<500?68:fk<2000?84:100;
  return Math.round(ss*.55+fs*.45);
}

// NEW: Complexity score — how hard was this to build?
function repoComplexity(depth){return depth.complexity||0;}

// NEW: Usefulness score — can someone actually use this?
function repoUsefulness(depth){return depth.usefulness||0;}

// Final repo score — Skill & Complexity weighted heavily, popularity minimal
// Quality:20% Activity:20% Depth:25% Complexity:15% Usefulness:15% Reach:5%
function repoFinal(q,a,depth,reach){
  const d=depth.score||0,c=depth.complexity||0,u=depth.usefulness||0;
  return Math.min(100,Math.round(q*.20+a*.20+d*.25+c*.15+u*.15+reach*.05));
}

// ── PORTFOLIO DIMENSIONS ──────────────────────────────────────────────────────
// Reputation = community acknowledgment (30% weight — important but not everything)
function dimReputation(owned,followers){
  const ts=owned.reduce((s,r)=>s+r.stargazers_count,0),tf=owned.reduce((s,r)=>s+r.forks_count,0);
  const ss=ts===0?0:ts<5?8:ts<20?18:ts<100?32:ts<500?50:ts<2000?66:ts<10000?80:ts<50000?92:ts<200000?97:100;
  const fs=tf===0?0:tf<3?10:tf<20?25:tf<100?45:tf<500?65:tf<2000?82:tf<10000?94:100;
  const fls=followers===0?0:followers<5?5:followers<20?15:followers<100?28:followers<500?46:followers<2000?66:followers<10000?84:followers<100000?95:100;
  return Math.round(ss*.50+fs*.25+fls*.25);
}

// Activity (20%) — how consistently someone builds
function dimActivity(repos,user){
  const now=Date.now();
  const mr=repos.reduce((b,r)=>new Date(r.pushed_at)>new Date(b.pushed_at)?r:b,repos[0]||{pushed_at:new Date(0)});
  const days=(now-new Date(mr.pushed_at))/864e5;
  const rec=days<7?100:days<30?85:days<90?65:days<180?40:days<365?20:8;
  const actRat=repos.length>0?repos.filter(r=>(now-new Date(r.pushed_at))/864e5<365).length/repos.length:0;
  const ageM=(now-new Date(user.created_at))/(864e5*30);
  const lon=ageM<3?20:ageM<12?45:ageM<24?65:ageM<48?82:100;
  const legBonus=ageM>=120&&repos.length>=20?15:ageM>=60&&repos.length>=10?8:0;
  return Math.min(100,Math.round(rec*.40+actRat*100*.30+lon*.20+legBonus));
}

// Technical Depth (25%) — hardest to fake, most meaningful
function dimDepth(sc){
  if(!sc.length)return 0;
  // WEIGHTED TOP scoring — best repos count more than average
  // Sort by depth score descending
  const sorted=[...sc].sort((a,b)=>(b._depthScore||0)-(a._depthScore||0));
  // Top repo = 50%, 2nd = 30%, rest = 20% of average
  const w1=sorted[0]?._depthScore||0;
  const w2=sorted[1]?._depthScore||0;
  const rest=sorted.slice(2);
  const restAvg=rest.length>0?rest.reduce((s,r)=>s+(r._depthScore||0),0)/rest.length:0;
  const weightedDepth=Math.round(w1*.50+w2*.30+restAvg*.20);

  // Same for complexity
  const sortedC=[...sc].sort((a,b)=>(b._complexity||0)-(a._complexity||0));
  const wc1=sortedC[0]?._complexity||0;
  const wc2=sortedC[1]?._complexity||0;
  const restC=sortedC.slice(2);
  const restCAvg=restC.length>0?restC.reduce((s,r)=>s+(r._complexity||0),0)/restC.length:0;
  const weightedComplexity=Math.round(wc1*.50+wc2*.30+restCAvg*.20);

  let tb=0;
  if(sc.some(r=>r._type==='ml-ai'))tb+=20;
  if(sc.some(r=>r._type==='fullstack'))tb+=15;
  if(sc.some(r=>r._type==='system'))tb+=20;
  if(sc.some(r=>['backend','fullstack'].includes(r._type)))tb+=10;
  const raw=Math.min(100,Math.round(weightedDepth*.60+weightedComplexity*.25+Math.min(25,tb)*.15*5));
  // Floor based on unique code-confirmed signals (not readme-only)
  const allSigs=new Set(sc.flatMap(r=>(r._depthSigs||[]).filter(s=>s.source==='code').map(s=>s.label)));
  const sigFloor=Math.min(30,allSigs.size*7);
  // System language floor — if you write kernel code, depth is at least 40
  const sysLangFloor=sc.some(r=>['c','c++','rust','zig','assembly'].includes((r.language||'').toLowerCase())&&r.stargazers_count>100)?40:0;
  return Math.max(sigFloor,sysLangFloor,raw);
}

// Skill Diversity (15%) — can they build different kinds of things?
function dimDiversity(repos){
  const langs=new Set(repos.map(r=>r.language).filter(Boolean));
  const ls=langs.size===0?0:langs.size===1?20:langs.size===2?40:langs.size===3?58:langs.size<=5?75:langs.size<=8?88:100;
  const types=new Set(repos.map(r=>r._type).filter(t=>t&&t!=='unknown'&&t!=='project'));
  const ts=types.size<=1?20:types.size===2?50:types.size===3?75:100;
  const hasFullstack=repos.some(r=>r._type==='fullstack');
  const hasSystems=repos.some(r=>r._type==='system');
  const hasML=repos.some(r=>r._type==='ml-ai');
  const crossSkillBonus=(hasFullstack?10:0)+(hasSystems?8:0)+(hasML?5:0);
  return Math.min(100,Math.round(ls*.55+ts*.35)+Math.min(15,crossSkillBonus));
}

// Quality (10%) — documentation and structure health, weighted top
function dimQuality(sc){
  if(!sc.length)return 0;
  const sorted=[...sc].sort((a,b)=>(b._qualScore||0)-(a._qualScore||0));
  const q1=sorted[0]?._qualScore||0,q2=sorted[1]?._qualScore||0;
  const rest=sorted.slice(2);
  const rAvg=rest.length>0?rest.reduce((s,r)=>s+(r._qualScore||0),0)/rest.length:0;
  return Math.round(q1*.45+q2*.30+rAvg*.25);
}

// ── MAIN ANALYZE ──────────────────────────────────────────────────────────────
async function analyzeProfile(username,onStep){
  onStep('Fetching profile');
  const user=await ghFetch('/users/'+username);
  onStep('Loading repositories');
  const repos=await loadAllRepos(username);
  if(!repos.length)return{user,topRepos:[],allRepos:[],scored:[],portfolioScore:0,scores:{reputation:0,activity:0,depth:0,diversity:0,quality:0},total:0,totalStars:0,totalForks:0,original:0};

  // Exclude profile README repo
  const meaningful=repos.filter(r=>r.name.toLowerCase()!==username.toLowerCase());
  const byStars=[...meaningful].sort((a,b)=>(b.stargazers_count+b.forks_count)-(a.stargazers_count+a.forks_count)).slice(0,12);
  const byRecent=[...meaningful].sort((a,b)=>new Date(b.pushed_at)-new Date(a.pushed_at)).slice(0,12);
  const pick=[...new Map([...byStars,...byRecent].map(r=>[r.id,r])).values()];

  onStep('Analyzing '+pick.length+' repositories');
  const scored=await Promise.all(pick.map(async repo=>{
    const{cs,rd,codeContent}=await loadRepoDetail(username,repo.name);
    const f=detectFiles(cs,repo),rm=parseRM(rd?.content||null),rs=rmScore(rm);
    const depth=detectDepth(cs,rm.text,repo,codeContent||''),type=detectType(cs,repo);
    const q=repoQuality(f,rs),a=repoActivity(repo),reach=repoReach(repo);
    const fin=repoFinal(q,a,depth,reach);
    const sugg=buildSugg(repo,f,rs,depth,type,fin);
    return{...repo,sc:{doc:q,act:a,depth:depth.score,pop:reach,fin,complexity:depth.complexity,usefulness:depth.usefulness},f,rm,rs,_type:type,_depthScore:depth.score,_depthSigs:depth.signals,_qualScore:q,_complexity:depth.complexity,_usefulness:depth.usefulness,sugg};
  }));

  onStep('Computing portfolio score');
  const sorted=[...scored].sort((a,b)=>b.sc.fin-a.sc.fin);
  const top6=sorted.slice(0,Math.min(6,scored.length));
  meaningful.forEach(r=>{r._type=scored.find(s=>s.id===r.id)?._type||'project';});

  const owned=repos.filter(r=>!r.fork);
  const totalStars=owned.reduce((s,r)=>s+r.stargazers_count,0);
  const totalForks=owned.reduce((s,r)=>s+r.forks_count,0);

  const reputation=dimReputation(owned,user.followers||0);
  const activity=dimActivity(repos,user);
  const depth=dimDepth(scored);
  const diversity=dimDiversity(repos);
  const quality=dimQuality(scored);
  const scores={reputation,activity,depth,diversity,quality};

  // New portfolio formula: Reputation:25% Activity:20% Depth:30% Diversity:15% Quality:10%
  // Depth gets more weight — it's the hardest to fake
  const rawPS=Math.round(reputation*.25+activity*.20+depth*.30+diversity*.15+quality*.10);

  // Impact floor — legendary devs (torvalds, etc.) shouldn't score below 70
  const impactFloor=totalStars>=100000?70:totalStars>=10000?55:totalStars>=1000?45:0;
  const followerFloor=user.followers>=100000?72:user.followers>=10000?58:user.followers>=1000?48:0;
  let ps=Math.max(rawPS,impactFloor,followerFloor);

  // Prestige ceiling — scores above 80 need real impact
  if(ps>=80){
    const best=scored.length>0?scored.reduce((b,r)=>r.stargazers_count>b.stargazers_count?r:b,scored[0]):{stargazers_count:0,language:''};
    const bl=(best.language||'').toLowerCase();let pr=0;
    const bs=best.stargazers_count||0;
    if(bs>=100000)pr+=8;else if(bs>=20000)pr+=7;else if(bs>=5000)pr+=6;else if(bs>=1000)pr+=5;else if(bs>=200)pr+=3;else if(bs>=50)pr+=2;else if(bs>=10)pr+=1;
    const fl=user.followers||0;
    if(fl>=100000)pr+=6;else if(fl>=10000)pr+=5;else if(fl>=1000)pr+=4;else if(fl>=200)pr+=2;else if(fl>=50)pr+=1;
    const el=['rust','c','c++','zig','assembly','cuda','fortran'],ha=['go','swift','kotlin','java','haskell','scala'],me=['typescript','python','c#','dart'];
    if(el.includes(bl))pr+=4;else if(ha.includes(bl))pr+=3;else if(me.includes(bl))pr+=2;
    if(totalForks>=10000)pr+=2;else if(totalForks>=500)pr+=1;
    ps=Math.min(rawPS,Math.min(100,80+pr));
    // But don't let prestige ceiling override impact floor
    ps=Math.max(ps,impactFloor,followerFloor);
  }

  return{user,topRepos:top6,allRepos:sorted,scored,portfolioScore:Math.min(100,Math.max(0,ps)),scores,total:repos.length,totalStars,totalForks,original:owned.length};
}

// ── SINGLE REPO ANALYZE ───────────────────────────────────────────────────────
async function analyzeRepo(username,repoData){
  const{cs,rd,codeContent}=await loadRepoDetail(username,repoData.name);
  const f=detectFiles(cs,repoData),rm=parseRM(rd?.content||null),rs=rmScore(rm);
  const depth=detectDepth(cs,rm.text,repoData,codeContent||''),type=detectType(cs,repoData);
  const q=repoQuality(f,rs),a=repoActivity(repoData),reach=repoReach(repoData);
  const fin=repoFinal(q,a,depth,reach);
  return{...repoData,sc:{doc:q,act:a,depth:depth.score,pop:reach,fin,complexity:depth.complexity,usefulness:depth.usefulness},f,rm,rs,_type:type,_depthScore:depth.score,_depthSigs:depth.signals,_qualScore:q,_complexity:depth.complexity,_usefulness:depth.usefulness,sugg:buildSugg(repoData,f,rs,depth,type,fin)};
}

// ── SUGGESTIONS ───────────────────────────────────────────────────────────────
function buildSugg(repo,f,rs,depth,type,score){
  const o=[];
  if(!f.r)o.push({p:'crit',t:'Add README.md — the most important file for any public repository.'});
  else if(rs<40)o.push({p:'crit',t:'README is too short. Add setup instructions, usage examples, and screenshots.'});
  else if(rs<65)o.push({p:'rec',t:'Improve README — add a live demo link, screenshots, or a badges strip.'});
  if(!f.l)o.push({p:'crit',t:'No LICENSE file. Add MIT license so others can legally use your code.'});
  if(!f.g)o.push({p:'rec',t:'Add .gitignore to stop tracking node_modules, build output, and secrets.'});
  if(!f.dep)o.push({p:'rec',t:'Add a dependency manifest (package.json or requirements.txt) to document your stack.'});
  if(!f.deploy)o.push({p:'rec',t:'Deploy this project and add the live URL to the repository homepage field.'});
  if(!f.t&&!['static'].includes(type))o.push({p:'rec',t:'Add a tests folder — even basic unit tests signal engineering maturity.'});
  if(!f.ci)o.push({p:'opt',t:'Set up GitHub Actions for automated testing on every push.'});
  if(!f.c)o.push({p:'opt',t:'Add CONTRIBUTING.md to invite open-source contributors.'});
  if(!repo.topics?.length)o.push({p:'opt',t:'Add repository topics to improve discoverability on GitHub search.'});
  if(repo.fork)o.push({p:'rec',t:'Forked repos score lower. Prioritize building original projects.'});
  if((Date.now()-new Date(repo.pushed_at))/864e5>180)o.push({p:'rec',t:'No activity in 6+ months. Regular commits signal active development to recruiters.'});
  if(depth.score<20&&type==='static')o.push({p:'rec',t:'Static project. Adding a backend API, database, or auth layer would dramatically increase this score.'});
  if(depth.complexity<20&&!['static','library','cli'].includes(type))o.push({p:'rec',t:'Low complexity. Add error handling, multiple modules, or a scalable directory structure.'});
  if(depth.usefulness<30)o.push({p:'rec',t:'Low usefulness signal. Add a live demo, write a good description, and add topics so people can find and use this.'});
  // Always give a score-specific improvement path
  if(score!==undefined){
    if(score<40) o.unshift({p:'crit',t:`Score: ${score}/100 — add README, LICENSE, and deploy this project. These three alone could push it past 55.`});
    else if(score<60) o.push({p:'rec',t:`Score: ${score}/100 — add tests, set up CI/CD, and deploy with a live URL to break 60.`});
    else if(score<70) o.push({p:'rec',t:`Score: ${score}/100 — to reach 70+: add setup instructions to the README, link a live demo, and add CI/CD.`});
    else if(score<80) o.push({p:'opt',t:`Score: ${score}/100 — to push past 80: add more technical depth (auth layer, database, or API), and share the project for community stars.`});
    else if(score<90) o.push({p:'opt',t:`Score: ${score}/100 — to reach 90+: earn real-world adoption. Share on Reddit, LinkedIn, and dev.to to start getting stars.`});
    else o.push({p:'opt',t:`Excellent: ${score}/100 — you are in the top tier. Keep shipping and sharing.`});
  }
  // Advanced tips for well-structured repos
  if(score>=60&&!f.t) o.push({p:'rec',t:'Add automated tests — even basic unit tests. This is the most common gap in otherwise strong portfolios.'});
  if(score>=65&&depth.usefulness<40) o.push({p:'rec',t:'Add a live demo URL in the repository homepage field. A working demo makes this far more impressive in applications.'});
  if(score>=70&&(repo.stargazers_count||0)<5) o.push({p:'opt',t:'Share this on Reddit (r/webdev), LinkedIn, and dev.to to start earning stars and building community reach.'});
  if(o.length===0){
    o.push({p:'opt',t:'Pin this repo on your profile for maximum visibility.'});
    o.push({p:'opt',t:'Write a LinkedIn post or blog article showcasing what you built and learned.'});
  }
  return o.slice(0,7);
}

// ── FALLBACK ROADMAP ──────────────────────────────────────────────────────────
function localRoadmap(data){
  const{scores,scored}=data;const steps=[];
  if(scores.depth<40)steps.push({title:'Build one complete full-stack application',description:'Create an app with frontend, backend API, database, and authentication. This single project raises your technical depth score more than anything else and is what recruiters actually look for.',priority:'high',timeframe:'4–8 weeks'});
  if(!scored.some(r=>r._type==='ml-ai')&&scores.depth>35)steps.push({title:'Integrate AI into an existing project',description:'Add an AI feature using Groq, OpenAI, or HuggingFace. Even a simple chatbot or summarizer demonstrates modern technical awareness that employers value.',priority:'high',timeframe:'1–2 weeks'});
  if(scores.activity<50)steps.push({title:'Build a consistent commit habit',description:'Aim for 3–5 commits per week. Commit frequency is one of the most visible signals on your profile and directly improves your activity score.',priority:'high',timeframe:'Ongoing'});
  if(scores.diversity<50)steps.push({title:'Build a project in a second programming language',description:'If you primarily use JavaScript, learn Python with FastAPI or Go. Cross-language skills dramatically improve both diversity score and job prospects.',priority:'medium',timeframe:'6–10 weeks'});
  if(scores.reputation<40)steps.push({title:'Share your best projects publicly',description:'Post your top repos on LinkedIn, Reddit (r/webdev), and dev.to. Getting your first stars requires visibility — great code alone is not enough.',priority:'medium',timeframe:'Ongoing'});
  if(!scored.some(r=>r.f?.deploy))steps.push({title:'Deploy at least one live project',description:'Use GitHub Pages, Vercel, or Railway. A live URL is far more impressive in applications than just a code link.',priority:'high',timeframe:'1–3 days'});
  if(!scored.some(r=>r.f?.t))steps.push({title:'Add automated tests to your best project',description:'Write unit or integration tests. Test coverage is evaluated in junior-to-mid developer interviews and raises both depth and quality scores.',priority:'medium',timeframe:'1–2 weeks'});
  return{steps:steps.slice(0,5),focus:steps.length>0?'Top priority: '+steps[0].title:'Keep shipping, testing, and sharing. Your portfolio is solid.'};
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const LC={'JavaScript':'#f7df1e','TypeScript':'#3178c6','Python':'#3776ab','HTML':'#e34c26','CSS':'#8a4fff','Java':'#b07219','C++':'#f34b7d','C':'#6e7681','C#':'#178600','Go':'#00add8','Rust':'#dea584','PHP':'#4f5d95','Ruby':'#701516','Swift':'#f05138','Kotlin':'#a97bff','Vue':'#41b883','Shell':'#89e051','Svelte':'#ff3e00','Dart':'#00b4ab','Jupyter Notebook':'#da5b0b','R':'#276dc2','Scala':'#dc322f'};
const langColor=l=>LC[l]||'#6e7681';
const ago=d=>{const n=Math.floor((Date.now()-new Date(d))/864e5);return n<1?'Today':n<30?n+'d ago':n<365?Math.floor(n/30)+'mo ago':Math.floor(n/365)+'y ago';};
const sCol=s=>s>=75?'var(--grn)':s>=50?'var(--acc2)':s>=30?'var(--ylw)':'var(--red)';
const sTier=s=>s>=85?'Elite Portfolio':s>=70?'Strong Portfolio':s>=55?'Developing Portfolio':s>=40?'Needs Work':'Early Stage';
const sBadge=s=>s>=80?'Excellent':s>=60?'Good':s>=40?'Fair':'Weak';
const sDesc=s=>s>=85?'Interview-ready. This portfolio demonstrates real-world impact and technical depth.':s>=70?'Strong foundation. Targeted improvements will make this stand out.':s>=55?'Good progress. Focus on technical depth and deploying your projects.':s>=40?'Several areas need attention before actively applying for roles.':'Start by documenting your projects, adding licenses, and deploying your work.';
const typeLabel=t=>({'fullstack':'Full-Stack','backend':'Backend','frontend-app':'Frontend App','static':'Static','library':'Library','cli':'CLI Tool','ml-ai':'ML / AI','system':'Systems','project':'Project'}[t]||'Project');
const typeColor=t=>({'fullstack':'var(--acc2)','backend':'var(--grn)','frontend-app':'var(--pur)','static':'var(--t3)','library':'var(--ylw)','cli':'var(--ylw)','ml-ai':'var(--red)','system':'var(--orn, #e3b341)','project':'var(--t2)'}[t]||'var(--t2)');
const priColor=p=>({high:'var(--red)',medium:'var(--ylw)',low:'var(--grn)'}[p]||'var(--acc2)');
const RC=['#d29922','#8b949e','#a78bfa','#6e7681','#6e7681','#6e7681'];
