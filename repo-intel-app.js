// ══ REPO INTEL APP — Terminal Noir Orchestrator ═══════════════════════════

// ── STATE ─────────────────────────────────────────────────────────────────
const S = {
  repo: null, repoInfo: null,
  files: [], deps: {}, nodes: [], links: [],
  commits: [], contributors: [],
  health: {}, arch: {}, circularDeps: [], onboarding: [],
  selectedFile: null, currentTab: 'graph', aiCache: {},
};

// ── BOOT SEQUENCE TEXT ────────────────────────────────────────────────────
const BOOT_LINES = [
  { text: 'DEVORA REPO_INTEL v2.0.0', cls: 'acc' },
  { text: '─────────────────────────────────', cls: 'dim' },
  { text: '> initializing analysis engine...', cls: '' },
  { text: '> github_api_module: loaded', cls: '' },
  { text: '> d3_graph_engine: loaded', cls: '' },
  { text: '> ast_parser: loaded', cls: '' },
  { text: '> groq_ai_module: ' + (_groqKey ? 'active' : 'standby (no key)'), cls: _groqKey ? '' : 'warn' },
  { text: '─────────────────────────────────', cls: 'dim' },
  { text: '> ready.', cls: 'acc' },
];

async function runBootSequence() {
  const container = document.getElementById('boot-lines');
  container.innerHTML = '';
  for (let i = 0; i < BOOT_LINES.length; i++) {
    await new Promise(r => setTimeout(r, i === 0 ? 100 : 80));
    const div = document.createElement('div');
    div.className = 'boot-line ' + BOOT_LINES[i].cls;
    div.textContent = BOOT_LINES[i].text;
    container.appendChild(div);
  }
}

// ── INIT ──────────────────────────────────────────────────────────────────
updateKeyBadge();
runBootSequence();
document.getElementById('boot-input').addEventListener('keydown', e => { if (e.key === 'Enter') bootAnalyze(); });
document.getElementById('tb-url').addEventListener('keydown', e => { if (e.key === 'Enter') reScan(); });

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('key-modal').classList.contains('open')) hideKeyModal();
    else if (_impactMode) toggleImpact();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const visible = !document.getElementById('boot-screen').classList.contains('hidden');
    (visible ? document.getElementById('boot-input') : document.getElementById('tb-url')).focus();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    togglePanel('explorer', document.querySelector('.ab-btn[data-panel="explorer"]'));
  }
});

// ── BOOT ANALYSIS ─────────────────────────────────────────────────────────
function bootLoad(repo) {
  document.getElementById('boot-input').value = repo;
  bootAnalyze();
}

function bootAnalyze() {
  const val = document.getElementById('boot-input').value;
  const repo = parseRepoUrl(val);
  if (!repo) {
    const err = document.getElementById('boot-err');
    err.textContent = '// ERROR: invalid url — try github.com/owner/repo';
    err.classList.remove('hidden');
    setTimeout(() => err.classList.add('hidden'), 3000);
    return;
  }
  document.getElementById('tb-url').value = val;
  startAnalysis(repo);
}

function reScan() {
  const val = document.getElementById('tb-url').value;
  const repo = parseRepoUrl(val);
  if (!repo) return;
  startAnalysis(repo);
}

function showBoot() {
  document.getElementById('boot-screen').classList.remove('hidden');
  document.getElementById('ide').classList.add('hidden');
  setTimeout(() => document.getElementById('boot-input').focus(), 100);
}

// ── MAIN ANALYSIS ─────────────────────────────────────────────────────────
async function startAnalysis(repo) {
  S.repo = repo;
  document.getElementById('boot-screen').classList.add('hidden');
  document.getElementById('ide').classList.add('hidden');
  showLoadScreen(repo.fullName);

  try {
    await runAnalysis();
    document.getElementById('load-screen').classList.add('hidden');
    document.getElementById('ide').classList.remove('hidden');
    updateStatusBar();
  } catch (err) {
    console.error(err);
    document.getElementById('load-screen').classList.add('hidden');
    document.getElementById('boot-screen').classList.remove('hidden');
    const errEl = document.getElementById('boot-err');
    errEl.textContent = '// ERROR: ' + err.message;
    errEl.classList.remove('hidden');
    setTimeout(() => errEl.classList.add('hidden'), 8000);
  }
}

function showLoadScreen(name) {
  document.getElementById('load-screen').classList.remove('hidden');
  document.getElementById('ls-repo').textContent = name;
  const steps = [
    { id: 'ls-fetch', text: 'FETCH_REPOSITORY_TREE' },
    { id: 'ls-parse', text: 'PARSE_FILE_STRUCTURE' },
    { id: 'ls-deps',  text: 'MAP_DEPENDENCIES' },
    { id: 'ls-health',text: 'COMPUTE_HEALTH_SCORES' },
    { id: 'ls-arch',  text: 'DETECT_ARCHITECTURE' },
    { id: 'ls-render',text: 'RENDER_GRAPH' },
  ];
  document.getElementById('ls-steps').innerHTML = steps.map(s =>
    `<div class="ls-step" id="${s.id}"><span class="ls-step-dot"></span><span>${s.text}</span><span class="ls-step-ok" id="${s.id}-ok"></span></div>`
  ).join('');
  setLsProgress(0, '');
}

async function runAnalysis() {
  lsStep('ls-fetch', 'active'); setLsProgress(8, 'fetching...');

  const [repoInfo, treeData] = await Promise.all([
    ghFetch('/repos/' + S.repo.fullName),
    ghFetch('/repos/' + S.repo.fullName + '/git/trees/HEAD?recursive=1')
  ]);
  S.repoInfo = repoInfo;

  S.files = (treeData.tree || []).filter(f =>
    f.type === 'blob' &&
    CODE_EXTS.some(e => f.path.endsWith(e)) &&
    !f.path.includes('node_modules') && !f.path.includes('.git') &&
    !f.path.includes('dist/') && !f.path.includes('build/') &&
    (f.size || 0) < 600000
  );
  lsStep('ls-fetch', 'done'); setLsProgress(18, `${S.files.length} files found`);

  lsStep('ls-parse', 'active');
  const keyFiles = selectKeyFiles(S.files).slice(0, 65);
  const contents = {};
  const batches = chunkArr(keyFiles, 8);
  for (let i = 0; i < batches.length; i++) {
    setLsProgress(18 + Math.round((i / batches.length) * 18), `reading ${i * 8}/${keyFiles.length}`);
    await Promise.all(batches[i].map(async f => {
      const d = await ghSafe('/repos/' + S.repo.fullName + '/contents/' + encodeURIComponent(f.path));
      if (d?.content) { try { contents[f.path] = atob(d.content.replace(/\n/g, '')); } catch {} }
    }));
  }
  lsStep('ls-parse', 'done'); setLsProgress(38, 'parsing complete');

  lsStep('ls-deps', 'active');
  S.deps = {};
  S.files.forEach(f => {
    const txt = contents[f.path] || '';
    S.deps[f.path] = {
      imports: extractImports(txt, f.path),
      importedBy: [],
      functions: extractFunctions(txt),
      lines: txt.split('\n').length,
      size: f.size || 0,
      complexity: estimateComplexity(txt)
    };
  });
  S.files.forEach(f => {
    (S.deps[f.path]?.imports || []).forEach(imp => {
      const r = resolveImport(imp, f.path, S.files);
      if (r && S.deps[r] && !S.deps[r].importedBy.includes(f.path)) S.deps[r].importedBy.push(f.path);
    });
  });
  S.circularDeps = detectCircular(S.files, S.deps);
  lsStep('ls-deps', 'done'); setLsProgress(56, 'dependencies mapped');

  lsStep('ls-health', 'active');
  const [commits, contribs] = await Promise.all([
    ghSafe('/repos/' + S.repo.fullName + '/commits?per_page=100'),
    ghSafe('/repos/' + S.repo.fullName + '/contributors?per_page=20')
  ]);
  S.commits = Array.isArray(commits) ? commits : [];
  S.contributors = Array.isArray(contribs) ? contribs : [];
  S.health = computeHealth(S.files, S.deps, S.circularDeps, repoInfo);
  lsStep('ls-health', 'done'); setLsProgress(72, 'health scored');

  lsStep('ls-arch', 'active');
  S.arch = detectArchitecture(S.files, S.deps);
  S.onboarding = computeOnboarding(S.files, S.deps, S.arch);
  lsStep('ls-arch', 'done'); setLsProgress(88, 'architecture detected');

  lsStep('ls-render', 'active');
  buildGraphData();
  lsStep('ls-render', 'done'); setLsProgress(100, 'done');
}

function lsStep(id, state) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'ls-step ' + state;
  const ok = document.getElementById(id + '-ok');
  if (ok) ok.textContent = state === 'done' ? '✓' : state === 'active' ? '...' : '';
}
function setLsProgress(pct, label) {
  const bar = document.getElementById('ls-bar');
  if (bar) bar.style.width = pct + '%';
  const lbl = document.getElementById('ls-label');
  if (lbl) lbl.textContent = '// ' + label;
}

// ── POST-LOAD SETUP ───────────────────────────────────────────────────────
function updateStatusBar() {
  document.getElementById('sb-repo').textContent    = S.repo.fullName;
  document.getElementById('sb-files').textContent   = S.files.length + ' files';
  document.getElementById('sb-health').textContent  = 'health: ' + S.health.overall;
  // Start rendering
  renderFileSidebar();
  switchTab('graph');
  renderGraph();
}

// ── MOBILE PANEL TOGGLE ────────────────────────────────────────────────────
function toggleMobilePanel() {
  const sp = document.getElementById('side-panel');
  const overlay = document.getElementById('mobile-overlay');
  const open = sp.classList.toggle('mobile-open');
  if (overlay) overlay.classList.toggle('show', open);
}

function closeMobilePanel() {
  document.getElementById('side-panel')?.classList.remove('mobile-open');
  document.getElementById('mobile-overlay')?.classList.remove('show');
}

// ── TAB SWITCHING ─────────────────────────────────────────────────────────
function switchTab(tab) {
  S.currentTab = tab;
  document.querySelectorAll('.ts-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  const graphEl = document.getElementById('graph-container');
  const scrollEl = document.getElementById('scroll-content');
  if (tab === 'graph') {
    graphEl.classList.add('show');
    scrollEl.classList.remove('show');
  } else {
    graphEl.classList.remove('show');
    scrollEl.classList.add('show');
    renderTabContent(tab);
  }
}

function renderTabContent(tab) {
  const sc = document.getElementById('scroll-content');
  const fns = { overview: renderOverview, architecture: renderArchitecture, health: renderHealth, ai: renderAI, timeline: renderTimeline, contribute: renderContribute };
  if (fns[tab]) { sc.innerHTML = fns[tab](); sc.className = 'show fade-in'; }
  if (tab === 'health' || tab === 'timeline') setTimeout(animateHealthBars, 80);
}

// ── PANEL TOGGLE ──────────────────────────────────────────────────────────
let _activePanel = 'explorer';

function togglePanel(name, btn) {
  const panel = document.getElementById('side-panel');
  const allViews = document.querySelectorAll('.panel-view');
  const allBtns = document.querySelectorAll('.ab-btn');

  if (_activePanel === name && !panel.classList.contains('collapsed')) {
    panel.classList.add('collapsed');
    btn?.classList.remove('active');
    _activePanel = null;
    return;
  }
  panel.classList.remove('collapsed');
  allViews.forEach(v => v.classList.remove('active'));
  allBtns.forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name)?.classList.add('active');
  btn?.classList.add('active');
  _activePanel = name;
}

// ── KEY MODAL ─────────────────────────────────────────────────────────────
function showKeyModal() {
  document.getElementById('key-modal').classList.add('open');
  document.getElementById('km-gh').value = _ghToken;
  document.getElementById('km-groq').value = _groqKey;
}
function hideKeyModal() { document.getElementById('key-modal').classList.remove('open'); }
