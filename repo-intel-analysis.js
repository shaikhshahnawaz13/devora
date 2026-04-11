// ── REPO INTEL — Analysis Engine ──────────────────────────────────────────

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it'];
const CODE_EXTS = ['.js','.jsx','.ts','.tsx','.py','.go','.rs','.java','.c','.cpp','.cs','.php','.rb','.swift','.kt','.vue','.svelte','.html','.css','.scss','.json','.md','.yml','.yaml','.sh','.toml'];

let _ghToken = localStorage.getItem('ri_gh') || '';
let _groqKey = localStorage.getItem('ri_groq') || '';

// ── KEYS ──────────────────────────────────────────────────────────────────
function saveKeys() {
  _ghToken = document.getElementById('km-gh').value.trim();
  _groqKey = document.getElementById('km-groq').value.trim();
  if (_ghToken) localStorage.setItem('ri_gh', _ghToken);
  else localStorage.removeItem('ri_gh');
  if (_groqKey) localStorage.setItem('ri_groq', _groqKey);
  else localStorage.removeItem('ri_groq');
  updateKeyBadge();
  hideKeyModal();
}

function updateKeyBadge() {
  const hasGh = !!_ghToken, hasGroq = !!_groqKey;

  // IDE titlebar pill
  const el = document.getElementById('key-pill-text');
  if (el) el.textContent = hasGh && hasGroq ? '[ GH + AI ]' : hasGh ? '[ GH Token ]' : hasGroq ? '[ AI Key ]' : '[ KEYS ]';
  const pill = document.getElementById('key-pill');
  if (pill) pill.classList.toggle('active', hasGh || hasGroq);

  // Boot screen key button
  const bootBtn = document.getElementById('boot-keys-btn');
  if (bootBtn) bootBtn.textContent = hasGh ? '[ ✓ GH TOKEN ]' : '[ KEYS ]';
  if (bootBtn) bootBtn.style.color = hasGh ? 'var(--acc)' : '';
  if (bootBtn) bootBtn.style.borderColor = hasGh ? 'var(--acc2)' : '';

  // Boot screen token warning — hide if token is set
  const warn = document.getElementById('boot-token-warn');
  if (warn) warn.style.display = hasGh ? 'none' : 'flex';
}

function showKeyModal() {
  document.getElementById('key-modal').classList.add('open');
  document.getElementById('km-gh').value = _ghToken;
  document.getElementById('km-groq').value = _groqKey;
}
function hideKeyModal() { document.getElementById('key-modal').classList.remove('open'); }

// ── GITHUB API ────────────────────────────────────────────────────────────
async function ghFetch(path) {
  const headers = { 'Accept': 'application/vnd.github.v3+json' };
  if (_ghToken) headers['Authorization'] = 'Bearer ' + _ghToken;
  const r = await fetch('https://api.github.com' + path, { headers });
  if (r.status === 401) { _ghToken = ''; localStorage.removeItem('ri_gh'); updateKeyBadge(); throw new Error('GitHub token invalid. Click Keys to update it.'); }
  if (r.status === 403) {
    const body = await r.clone().json().catch(() => ({}));
    if (body.message?.includes('rate limit')) throw new Error('GitHub rate limit hit. Add a GitHub token in Keys for 5000 req/hr.');
    throw new Error('GitHub API 403: ' + path);
  }
  if (r.status === 404) throw new Error('Repository not found. Check the URL and try again.');
  if (!r.ok) throw new Error('GitHub API ' + r.status + ': ' + path);
  return r.json();
}
async function ghSafe(path) { try { return await ghFetch(path); } catch { return null; } }

// ── GROQ AI ───────────────────────────────────────────────────────────────
async function callGroq(prompt, maxTok = 600) {
  if (!_groqKey) return null;
  for (const model of GROQ_MODELS) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + _groqKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], max_tokens: maxTok, temperature: 0.4 }),
        signal: AbortSignal.timeout(22000)
      });
      if (!r.ok) continue;
      const d = await r.json();
      const txt = d.choices?.[0]?.message?.content?.trim();
      if (txt) return txt;
    } catch { continue; }
  }
  return null;
}

// ── PARSE URL ─────────────────────────────────────────────────────────────
function parseRepoUrl(input) {
  const clean = input.trim().replace(/\/$/, '');
  const m = clean.match(/(?:github\.com\/)?([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/);
  if (!m) return null;
  return { owner: m[1], name: m[2], fullName: m[1] + '/' + m[2] };
}

// ── KEY FILE SELECTION ────────────────────────────────────────────────────
function selectKeyFiles(files) {
  const priority = [], rest = [];
  const keyNames = ['index.js','index.ts','app.js','app.ts','main.js','main.ts','server.js','server.ts','index.html','package.json','app.py','main.py','config.js','config.ts'];
  files.forEach(f => {
    const base = f.path.split('/').pop().toLowerCase();
    if (keyNames.includes(base) || f.path.split('/').length <= 2) priority.push(f);
    else rest.push(f);
  });
  return [...priority, ...rest];
}

// ── IMPORT EXTRACTION ──────────────────────────────────────────────────────
function extractImports(code, filePath) {
  const imports = new Set();
  const patterns = [
    /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /import\s+['"]([^'"]+)['"]/g,
    /#include\s+["<]([^">]+)[">]/g,
  ];
  patterns.forEach(p => {
    let m; p.lastIndex = 0;
    while ((m = p.exec(code)) !== null) {
      const imp = m[1];
      if (imp.startsWith('.') || imp.startsWith('/')) imports.add(imp);
    }
  });
  return [...imports];
}

function extractFunctions(code) {
  const fns = [];
  const p = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(|class\s+(\w+)|def\s+(\w+)|func\s+(\w+)|fn\s+(\w+))/g;
  let m; p.lastIndex = 0;
  while ((m = p.exec(code)) !== null && fns.length < 12) {
    const name = m[1] || m[2] || m[3] || m[4] || m[5] || m[6];
    if (name && name.length > 2 && !['if','for','while','else','return','async','await'].includes(name)) fns.push(name);
  }
  return [...new Set(fns)].slice(0, 10);
}

function resolveImport(imp, fromFile, files) {
  const dir = fromFile.split('/').slice(0, -1).join('/');
  const exts = ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.rs', '.vue', '.svelte'];
  let cand = dir ? dir + '/' + imp : imp;
  cand = cand.replace(/^\.\//, dir ? dir + '/' : '').replace(/\/\//g, '/');
  for (const f of files) {
    if (f.path === cand || exts.some(e => f.path === cand + e || f.path === cand + '/index' + e)) return f.path;
  }
  return null;
}

function estimateComplexity(code) {
  const lines = code.split('\n').length;
  const fns = (code.match(/function\s*\w*\s*\(/g) || []).length;
  const branches = (code.match(/\bif\b|\bwhile\b|\bfor\b|\bswitch\b|\bcase\b/g) || []).length;
  const nested = (code.match(/\{\s*\{/g) || []).length;
  return Math.min(100, Math.round((lines / 25) + (fns * 3) + (branches * 1.5) + (nested * 4)));
}

// ── CIRCULAR DETECTION ────────────────────────────────────────────────────
function detectCircular(files, deps) {
  const cycles = [], visited = new Set(), inStack = new Set();
  function dfs(path, stack) {
    visited.add(path); inStack.add(path);
    for (const imp of (deps[path]?.imports || [])) {
      const r = resolveImport(imp, path, files);
      if (!r) continue;
      if (!visited.has(r)) dfs(r, [...stack, r]);
      else if (inStack.has(r)) {
        const ci = stack.indexOf(r);
        if (ci !== -1) cycles.push(stack.slice(ci));
      }
    }
    inStack.delete(path);
  }
  files.forEach(f => { if (!visited.has(f.path)) dfs(f.path, [f.path]); });
  return cycles.slice(0, 25);
}

// ── HEALTH SCORE ──────────────────────────────────────────────────────────
function computeHealth(files, deps, circular, repoInfo) {
  const jsFiles = files.filter(f => /\.[jt]sx?$/.test(f.path));
  const testFiles = files.filter(f => /test|spec|__tests__/.test(f.path));
  const testCoverage = jsFiles.length > 0 ? Math.min(100, Math.round((testFiles.length / jsFiles.length) * 200)) : 0;
  const hasReadme = files.some(f => /readme\.md$/i.test(f.path));
  const hasLicense = files.some(f => /^license/i.test(f.path.split('/').pop()));
  const hasCi = files.some(f => f.path.includes('.github/workflows') || f.path.includes('.travis'));
  const hasContrib = files.some(f => /contributing/i.test(f.path));
  const docScore = Math.round((hasReadme ? 40 : 0) + (hasLicense ? 20 : 0) + (hasCi ? 20 : 0) + (hasContrib ? 20 : 0));
  const avgComplexity = files.length > 0 ? Math.round(Object.values(deps).reduce((s, d) => s + (d.complexity || 0), 0) / files.length) : 0;
  const complexityScore = Math.max(0, 100 - avgComplexity);
  const circularScore = Math.max(0, 100 - circular.length * 12);
  const avgImports = files.length > 0 ? Object.values(deps).reduce((s, d) => s + (d.imports?.length || 0), 0) / files.length : 0;
  const couplingScore = Math.max(0, 100 - Math.round(avgImports * 5));
  const avgDepth = files.length > 0 ? files.reduce((s, f) => s + f.path.split('/').length, 0) / files.length : 3;
  const orgScore = Math.max(0, 100 - Math.round((avgDepth - 3) * 10));
  const overall = Math.round(testCoverage * .20 + docScore * .20 + complexityScore * .20 + circularScore * .20 + couplingScore * .10 + orgScore * .10);
  return { overall, testCoverage, docScore, complexityScore, circularScore, couplingScore, orgScore, circular: circular.length, avgComplexity, avgImports: Math.round(avgImports) };
}

// ── ARCHITECTURE DETECTION (improved) ────────────────────────────────────
function detectArchitecture(files, deps) {
  const paths = files.map(f => f.path);
  const pathsLower = paths.map(p => p.toLowerCase());
  const hasDir = d => pathsLower.some(p => p.startsWith(d + '/') || p.includes('/' + d + '/'));
  const hasFile = n => pathsLower.some(p => p.endsWith('/' + n) || p === n);
  const hasFilePattern = r => pathsLower.some(p => r.test(p));

  // ── DETECT STACK ──────────────────────────────────────────
  const hasNext   = hasFile('next.config.js') || hasFile('next.config.ts') || hasDir('pages') || hasDir('app');
  const hasVite   = hasFile('vite.config.js') || hasFile('vite.config.ts');
  const hasReact  = paths.some(p => /\.(jsx|tsx)$/.test(p)) || hasDir('components') || hasDir('src');
  const hasVue    = paths.some(p => /\.vue$/.test(p)) || hasFile('nuxt.config.js');
  const hasSvelte = paths.some(p => /\.svelte$/.test(p));
  const hasNode   = hasFile('server.js') || hasFile('server.ts') || hasDir('routes') || hasDir('controllers') || hasFile('app.js') || hasFile('app.ts');
  const hasPy     = paths.some(p => p.endsWith('.py'));
  const hasGo     = paths.some(p => p.endsWith('.go')) || hasFile('go.mod');
  const hasRust   = paths.some(p => p.endsWith('.rs')) || hasFile('cargo.toml');
  const hasPrisma = hasFile('schema.prisma') || hasFilePattern(/prisma/);
  const hasMongoose = hasFilePattern(/mongoose/);
  const hasExpress = hasNode && (hasDir('routes') || hasDir('middleware'));

  // ── FRONTEND FLOW ─────────────────────────────────────────
  const frontend = [];
  if (hasNext)   { frontend.push('Next.js'); }
  else if (hasVite && hasReact) { frontend.push('Vite+React'); }
  else if (hasVue) { frontend.push('Vue/Nuxt'); }
  else if (hasSvelte) { frontend.push('SvelteKit'); }
  else if (hasReact) { frontend.push('React'); }
  else if (hasFile('index.html')) { frontend.push('Static HTML'); }

  if (hasDir('pages') || hasDir('app')) frontend.push('→', 'Pages/Router');
  if (hasDir('components')) frontend.push('→', 'Components');
  if (pathsLower.some(p => /redux|store|context|zustand|recoil|jotai/.test(p))) frontend.push('→', 'State');

  // ── BACKEND FLOW ──────────────────────────────────────────
  const backend = [];
  if (hasExpress) { backend.push('Express'); }
  else if (hasPy && hasFilePattern(/flask|fastapi|django/)) { backend.push(hasFilePattern(/fastapi/) ? 'FastAPI' : hasFilePattern(/django/) ? 'Django' : 'Flask'); }
  else if (hasGo) { backend.push('Go Server'); }
  else if (hasRust) { backend.push('Rust Server'); }
  else if (hasNode) { backend.push('Node.js'); }

  if (hasDir('routes')) backend.push('→', 'Routes');
  if (hasDir('controllers')) backend.push('→', 'Controllers');
  if (hasDir('middleware')) backend.push('→', 'Middleware');
  if (hasDir('services')) backend.push('→', 'Services');

  // ── FILE GROUPS ───────────────────────────────────────────
  const dbFiles    = paths.filter(p => /prisma|schema\.sql|migration|\.model\.[jt]s|models\//i.test(p) || /mongoose|sequelize|typeorm|drizzle/i.test(p)).slice(0, 8);
  const authFiles  = paths.filter(p => /auth|passport|jwt|session|oauth|middleware\/.*auth/i.test(p)).slice(0, 8);
  const apiFiles   = paths.filter(p => /\/api\/|\/routes\/|\/controllers\/|\.route\.[jt]s|\.controller\.[jt]s/i.test(p)).slice(0, 8);
  const stateFiles = paths.filter(p => /store|redux|context|zustand|recoil|jotai|pinia|vuex/i.test(p)).slice(0, 6);
  const configFiles= paths.filter(p => /\.(config|env|rc)\.[a-z]+$|package\.json|tsconfig|webpack|vite|next\.config|tailwind/i.test(p)).slice(0, 8);
  const testFiles  = paths.filter(p => /\.(test|spec)\.[jt]sx?$|__tests__|\/test\/|\/tests\//i.test(p)).slice(0, 8);

  const entryPoints = files.filter(f => {
    const b = f.path.split('/').pop();
    return ['index.js','index.ts','app.js','app.ts','main.js','main.ts','server.js','server.ts','app.py','main.py'].includes(b);
  }).map(f => f.path);

  const coreFiles = Object.entries(deps)
    .filter(([, d]) => d.importedBy.length > 2)
    .sort((a, b) => b[1].importedBy.length - a[1].importedBy.length)
    .slice(0, 12).map(([p]) => p);

  const largestFiles = [...files].sort((a, b) => (b.size || 0) - (a.size || 0)).slice(0, 10).map(f => f.path);

  const deadFiles = files.filter(f =>
    !f.path.endsWith('.md') && !f.path.endsWith('.json') && !f.path.endsWith('.yml') &&
    !f.path.endsWith('.yaml') && !f.path.endsWith('.env') &&
    (deps[f.path]?.importedBy?.length || 0) === 0 &&
    !entryPoints.includes(f.path)
  ).slice(0, 12).map(f => f.path);

  // ── DETECTED STACK SUMMARY ────────────────────────────────
  const stack = [];
  if (hasNext)    stack.push('Next.js');
  if (hasVite)    stack.push('Vite');
  if (hasReact && !hasNext)   stack.push('React');
  if (hasVue)     stack.push('Vue');
  if (hasSvelte)  stack.push('Svelte');
  if (hasExpress) stack.push('Express');
  if (hasPrisma)  stack.push('Prisma');
  if (hasMongoose)stack.push('Mongoose');
  if (hasPy)      stack.push('Python');
  if (hasGo)      stack.push('Go');
  if (hasRust)    stack.push('Rust');
  if (paths.some(p => /tailwind/.test(p))) stack.push('Tailwind');
  if (paths.some(p => /supabase/.test(p))) stack.push('Supabase');
  if (paths.some(p => /firebase/.test(p))) stack.push('Firebase');

  return { frontend, backend, dbFiles, authFiles, apiFiles, stateFiles, configFiles, testFiles, entryPoints, coreFiles, largestFiles, deadFiles, stack };
}

// ── ONBOARDING ────────────────────────────────────────────────────────────
function computeOnboarding(files, deps, arch) {
  const steps = [];
  arch.entryPoints.slice(0, 2).forEach(p => steps.push({ path: p, why: 'Application entry point — this is how everything boots up. Read it first to see the big picture.' }));
  files.filter(f => ['package.json', 'cargo.toml', 'go.mod', 'requirements.txt'].includes(f.path.split('/').pop())).slice(0, 1).forEach(f => steps.push({ path: f.path, why: 'Lists all dependencies and scripts — tells you what tools are used and how to run the project.' }));
  arch.coreFiles.slice(0, 2).forEach(p => steps.push({ path: p, why: `Imported by ${deps[p]?.importedBy?.length || 0}+ other files — understanding it unlocks the whole codebase.` }));
  const readme = files.find(f => /readme\.md$/i.test(f.path));
  if (readme) steps.push({ path: readme.path, why: 'Setup instructions, project overview, and context. Always read the README before diving into code.' });
  return steps.slice(0, 5);
}

// ── HEATMAP DATA ──────────────────────────────────────────────────────────
function buildHeatmapData(files, deps) {
  return files.map(f => {
    const d = deps[f.path] || {};
    const score = Math.min(100, (d.complexity || 0) + (d.imports?.length || 0) * 3 + (d.importedBy?.length || 0) * 2);
    return { path: f.path, name: f.path.split('/').pop(), score, complexity: d.complexity || 0, lines: d.lines || 0 };
  }).sort((a, b) => b.score - a.score).slice(0, 80);
}

// ── CHUNK ARRAY ───────────────────────────────────────────────────────────
function chunkArr(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

// ── FILE ICON (SVG — no emojis) ───────────────────────────────────────────
function fileIcon(path) {
  const ext = path.split('.').pop().toLowerCase();
  const base = path.split('/').pop().toLowerCase();

  // Named file overrides
  if (base === 'package.json' || base === 'package-lock.json')
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`;
  if (base === 'readme.md')
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00aaff" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>`;
  if (base === 'dockerfile' || base.includes('docker'))
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00aaff" stroke-width="1.8"><rect x="2" y="8" width="20" height="10" rx="2"/><path d="M7 8V5h3v3M12 8V5h3v3M17 8V5h3v3M2 8h20"/></svg>`;

  const map = {
    js:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="1.8"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M9 14v3a2 2 0 0 1-4 0M15 11v6" stroke-linecap="round"/></svg>`,
    ts:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.8"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 11h8M12 11v6" stroke-linecap="round"/></svg>`,
    jsx:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#61dafb" stroke-width="1.8"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"/></svg>`,
    tsx:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#61dafb" stroke-width="1.8"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"/></svg>`,
    py:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.8"><path d="M12 2C7 2 7 7 7 7v2h10V7s0-5-5-5zM12 22c5 0 5-5 5-5v-2H7v2s0 5 5 5z"/><circle cx="9.5" cy="5.5" r="1" fill="#3b82f6"/><circle cx="14.5" cy="18.5" r="1" fill="#3b82f6"/></svg>`,
    go:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00add8" stroke-width="1.8"><path d="M4 12h16M12 4c-3 0-6 3-6 8s3 8 6 8 6-3 6-8"/></svg>`,
    rs:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M8 9h8M8 15h5"/></svg>`,
    html:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e34c26" stroke-width="1.8"><path d="M4 3l1.5 17L12 22l6.5-2L20 3H4z"/><path d="M8 8h8M8.5 12h7l-.5 4-3 1-3-1-.2-2"/></svg>`,
    css:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a4fff" stroke-width="1.8"><path d="M4 3l1.5 17L12 22l6.5-2L20 3H4z"/><path d="M8 8h8M7.5 12h9l-1 6-3.5 1L8.5 18l-.2-2"/></svg>`,
    scss:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cc6699" stroke-width="1.8"><path d="M4 3l1.5 17L12 22l6.5-2L20 3H4z"/></svg>`,
    sass:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cc6699" stroke-width="1.8"><path d="M4 3l1.5 17L12 22l6.5-2L20 3H4z"/></svg>`,
    json:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="1.8"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>`,
    md:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7aaa7a" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    yml:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7aaa7a" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    yaml:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7aaa7a" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    sh:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="1.8"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    sql:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M21 5v14c0 1.66-4 3-9 3s-9-1.34-9-3V5"/></svg>`,
    vue:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#42b883" stroke-width="1.8"><path d="M12 2L2 4l10 18 10-18L12 2zM8 4l4 8 4-8"/></svg>`,
    svelte: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff3e00" stroke-width="1.8"><path d="M21 4c0 0-2-2-9 2S3 15 3 15s0 4 6 3 9-7 9-7l3-7z"/></svg>`,
    java:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="1.8"><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9c0 0 1-4 3-4s3 4 3 4M7 20s1 2 5 2 5-2 5-2M6 16l12-8"/></svg>`,
    kt:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a97bff" stroke-width="1.8"><path d="M3 3h18L3 12l18 9H3V3z"/></svg>`,
    swift:  `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f05138" stroke-width="1.8"><path d="M20 7c0 0-3-4-8-4S3 9 3 14c0 4 4 6 8 6 2.5 0 5-1 6-3-1 0-4 1-6-2 0 0 8-3 9-8z"/></svg>`,
    rb:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cc342d" stroke-width="1.8"><path d="M12 3l7.5 13H4.5L12 3z"/><circle cx="12" cy="17" r="4"/></svg>`,
    php:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8892bf" stroke-width="1.8"><ellipse cx="12" cy="12" rx="10" ry="7"/><path d="M7 12h2a2 2 0 0 0 0-4H7v8M15 8v8M15 12h4"/></svg>`,
    c:      `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00aaff" stroke-width="1.8"><path d="M18 11A6 6 0 1 0 18 13"/></svg>`,
    cpp:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6295cb" stroke-width="1.8"><path d="M15 11A6 6 0 1 0 15 13M19 9v6M16 12h6"/></svg>`,
    cs:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9b4f96" stroke-width="1.8"><path d="M18 11A6 6 0 1 0 18 13M17 11h6M17 13h6"/></svg>`,
    toml:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7aaa7a" stroke-width="1.8"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
    env:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    lock:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3a5a3a" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  };
  return map[ext] || `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3a5a3a" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
}

// ── SCORE COLOR ───────────────────────────────────────────────────────────
function sCol(v) { return v >= 70 ? '#00e07a' : v >= 50 ? '#f0c040' : '#f87171'; }
