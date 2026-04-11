// ══ REPO INTEL VIEWS — Terminal Noir ═════════════════════════════════════

// ── INSPECTOR ─────────────────────────────────────────────────────────────
function openInspector(d) {
  document.getElementById('insp-empty').classList.add('hidden');
  document.getElementById('insp-content').classList.remove('hidden');
  document.getElementById('insp-filename').textContent = d.label;
  document.getElementById('insp-path').textContent = d.path;

  const badges = [
    d.isEntry ? '<span class="badge b-grn">ENTRY</span>' : '',
    d.isCore  ? '<span class="badge b-blu">CORE</span>' : '',
    d.isCircular ? '<span class="badge b-red">CIRCULAR</span>' : '',
    d.isDead  ? '<span class="badge b-gray">UNUSED?</span>' : '',
    d.importedBy.length > 5 ? '<span class="badge b-red">CRITICAL</span>' : d.importedBy.length > 2 ? '<span class="badge b-ylw">IMPORTANT</span>' : '',
    d.complexity > 60 ? '<span class="badge b-red">HIGH_CX</span>' : d.complexity > 30 ? '<span class="badge b-ylw">MED_CX</span>' : '<span class="badge b-grn">LOW_CX</span>',
  ].filter(Boolean).join('');
  document.getElementById('insp-badges').innerHTML = badges;

  document.getElementById('insp-body').innerHTML = `
    <div class="insp-stats">
      <div class="insp-stat">
        <div class="insp-stat-val">${d.lines}</div>
        <div class="insp-stat-key">LINES</div>
      </div>
      <div class="insp-stat">
        <div class="insp-stat-val" style="color:${d.complexity>60?'var(--red)':d.complexity>30?'var(--ylw)':'var(--acc)'}">${d.complexity}</div>
        <div class="insp-stat-key">COMPLEXITY</div>
      </div>
      <div class="insp-stat">
        <div class="insp-stat-val" style="color:var(--acc2)">${d.imports.length}</div>
        <div class="insp-stat-key">IMPORTS</div>
      </div>
      <div class="insp-stat">
        <div class="insp-stat-val" style="color:var(--blu)">${d.importedBy.length}</div>
        <div class="insp-stat-key">IMPORTED_BY</div>
      </div>
    </div>

    ${d.isCircular ? `<div class="insp-alert danger">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.5"><path d="m10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="1" fill="var(--red)"/></svg>
      CIRCULAR_DEP — Part of a circular import chain. Causes init order bugs and memory leaks. Extract shared logic into a utility module.
    </div>` : ''}
    ${d.isDead ? `<div class="insp-alert warn">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ylw)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="var(--ylw)"/></svg>
      POSSIBLY_UNUSED — Nothing imports this file. May be dead code, a standalone script, or an unlisted entry point.
    </div>` : ''}

    ${d.functions.length ? `
    <div class="insp-sec">
      <div class="insp-sec-title">SYMBOLS (${d.functions.length})</div>
      <div>${d.functions.map(f => `<span class="insp-fn-chip">${f}</span>`).join('')}</div>
    </div>` : ''}

    ${d.importedBy.length ? `
    <div class="insp-sec">
      <div class="insp-sec-title" style="color:var(--acc2)">IMPORTED_BY (${d.importedBy.length})</div>
      ${d.importedBy.slice(0, 7).map(p => `<div class="insp-file-row" onclick="selectNodeByPath('${p.replace(/'/g,"\\'")}')">
        <span class="insp-file-name" style="color:var(--acc2)">${p.split('/').pop()}</span>
        <span class="insp-file-dir">${p.split('/').slice(0,-1).join('/')}</span>
      </div>`).join('')}
      ${d.importedBy.length > 7 ? `<div style="font-size:9px;color:var(--t3);padding:2px 0">+${d.importedBy.length-7} more</div>` : ''}
    </div>` : ''}

    ${d.imports.length ? `
    <div class="insp-sec">
      <div class="insp-sec-title" style="color:var(--blu)">IMPORTS (${d.imports.length})</div>
      ${d.imports.slice(0, 6).map(i => `<div class="insp-import">${i}</div>`).join('')}
      ${d.imports.length > 6 ? `<div style="font-size:9px;color:var(--t3)">+${d.imports.length-6} more</div>` : ''}
    </div>` : ''}

    <div class="insp-sec">
      <div class="insp-sec-title">AI_ANALYSIS</div>
      <button class="insp-ai-btn" id="insp-ai-btn" onclick="inspAI('${d.path.replace(/'/g,"\\'")}')">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>
        [ ANALYZE_WITH_AI ]
      </button>
      <div id="insp-ai-result" class="insp-ai-result"></div>
    </div>

    <button class="insp-impact-btn" onclick="toggleImpact()">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      [ TRACE_IMPACT_RIPPLE ]
    </button>
  `;
}

async function inspAI(path) {
  const btn = document.getElementById('insp-ai-btn');
  const res = document.getElementById('insp-ai-result');
  if (!btn || !res) return;
  btn.disabled = true; btn.innerHTML = '<span class="spin">⊙</span> ANALYZING...';
  const d = S.nodes.find(n => n.id === path);
  if (!d) { btn.disabled = false; return; }
  const prompt = `Analyze file: ${d.path} from ${S.repo.fullName}. Lines:${d.lines}, Complexity:${d.complexity}, Imports:${d.imports.slice(0,6).join(',')||'none'}, Imported_by:${d.importedBy.slice(0,6).join(',')||'none'}, Functions:${d.functions.join(',')||'unknown'}, core=${d.isCore}, entry=${d.isEntry}, dead=${d.isDead}, circular=${d.isCircular}. In 3-4 sentences: (1) what it does, (2) why it matters, (3) one specific improvement.`;
  const txt = await callGroq(prompt, 280);
  btn.textContent = '[ RE-ANALYZE ]'; btn.disabled = false;
  res.textContent = txt || '// Add GROQ_API_KEY to enable AI analysis';
}

function closeInspector() {
  document.getElementById('insp-empty').classList.remove('hidden');
  document.getElementById('insp-content').classList.add('hidden');
  resetHighlight();
  S.selectedFile = null;
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────
function renderOverview() {
  const totalLines = Object.values(S.deps).reduce((s, d) => s + (d.lines || 0), 0);
  const langMap = {};
  S.files.forEach(f => { const e = f.path.split('.').pop().toLowerCase(); langMap[e] = (langMap[e] || 0) + 1; });
  const topLangs = Object.entries(langMap).sort((a,b) => b[1]-a[1]).slice(0,7);

  return `
  <div class="page-header">
    <div class="page-title">${S.repo.fullName}</div>
    <div class="page-sub">${S.repoInfo?.description||'NO_DESCRIPTION'} ${S.repoInfo?.html_url?`· <a href="${S.repoInfo.html_url}" target="_blank">VIEW_ON_GITHUB →</a>`:''}</div>
  </div>

  <div class="stat-grid">
    <div class="stat-card" style="--c:var(--acc)"><div class="stat-val" style="color:var(--acc)">${S.files.length}</div><div class="stat-key">FILES_ANALYZED</div></div>
    <div class="stat-card" style="--c:var(--cyan)"><div class="stat-val" style="color:var(--cyan)">${totalLines.toLocaleString()}</div><div class="stat-key">TOTAL_LINES</div></div>
    <div class="stat-card" style="--c:var(--pur)"><div class="stat-val" style="color:var(--pur)">${S.links.length}</div><div class="stat-key">DEPENDENCIES</div></div>
    <div class="stat-card" style="--c:var(--red)"><div class="stat-val" style="color:${S.circularDeps.length?'var(--red)':'var(--acc)'}">${S.circularDeps.length}</div><div class="stat-key">CIRCULAR_DEPS</div></div>
    <div class="stat-card" style="--c:var(--ylw)"><div class="stat-val" style="color:var(--ylw)">${S.health.avgComplexity}</div><div class="stat-key">AVG_COMPLEXITY</div></div>
    <div class="stat-card" style="--c:${sCol(S.health.overall)}"><div class="stat-val" style="color:${sCol(S.health.overall)}">${S.health.overall}</div><div class="stat-key">HEALTH_SCORE</div></div>
  </div>

  <div class="g2" style="margin-bottom:12px">
    <div class="card">
      <div class="sec-head"><span class="sec-head-dot" style="background:var(--acc)"></span>CORE_FILES</div>
      ${S.arch.coreFiles.slice(0,7).map(p=>`<div class="file-row" onclick="selectNodeByPath('${p.replace(/'/g,"\\'")}');switchTab('graph')">
        <span>${fileIcon(p)}</span><span class="file-name">${p.split('/').pop()}</span>
        <span class="file-meta">${S.deps[p]?.importedBy?.length||0}↑</span>
      </div>`).join('')||'<div class="empty">NONE_DETECTED</div>'}
    </div>
    <div class="card">
      <div class="sec-head"><span class="sec-head-dot" style="background:var(--ylw)"></span>LARGEST_FILES</div>
      ${S.arch.largestFiles.slice(0,7).map(p=>`<div class="file-row" onclick="selectNodeByPath('${p.replace(/'/g,"\\'")}');switchTab('graph')">
        <span>${fileIcon(p)}</span><span class="file-name">${p.split('/').pop()}</span>
        <span class="file-meta">${Math.round((S.files.find(f=>f.path===p)?.size||0)/1024)}kb</span>
      </div>`).join('')||'<div class="empty">NO_DATA</div>'}
    </div>
  </div>

  <div class="g2" style="margin-bottom:12px">
    <div class="card">
      <div class="sec-head"><span class="sec-head-dot" style="background:var(--t3)"></span>POSSIBLY_UNUSED</div>
      ${S.arch.deadFiles.slice(0,7).map(p=>`<div class="file-row" style="opacity:.5"><span>${fileIcon(p)}</span><span class="file-name">${p.split('/').pop()}</span><span class="file-meta">${p.split('/').slice(0,-1).join('/')}</span></div>`).join('')||'<div class="empty" style="color:var(--acc)">✓ CLEAN</div>'}
    </div>
    <div class="card">
      <div class="sec-head"><span class="sec-head-dot" style="background:var(--acc2)"></span>LANGUAGES</div>
      ${topLangs.map(([ext,count])=>`<div style="display:flex;align-items:center;gap:7px;margin-bottom:6px">
        <span class="chip">.${ext}</span>
        <div style="flex:1;height:2px;background:var(--s4)"><div style="height:100%;width:${Math.round(count/S.files.length*100)}%;background:var(--acc);box-shadow:0 0 4px var(--acc)40"></div></div>
        <span style="font-size:9px;color:var(--t2);width:18px;text-align:right">${count}</span>
      </div>`).join('')}
    </div>
  </div>

  ${S.circularDeps.length ? `
  <div class="card" style="border-color:#440000">
    <div class="sec-head"><span class="sec-head-dot" style="background:var(--red)"></span>CIRCULAR_DEPENDENCIES</div>
    ${S.circularDeps.slice(0,6).map(c=>`<div style="font-size:10px;color:var(--red);background:#0d0000;border:1px solid #440000;padding:4px 7px;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.map(p=>p.split('/').pop()).join(' → ')}</div>`).join('')}
  </div>` : ''}
  `;
}

// ── ARCHITECTURE ──────────────────────────────────────────────────────────
function renderArchitecture() {
  const a = S.arch;
  const flowHtml = (items, cls) => items.length
    ? `<div class="arch-flow ${cls}">${items.map(i => i === '→' ? '<span class="arch-arr">→</span>' : `<span class="arch-node">${i}</span>`).join('')}</div>`
    : '';

  const fileList = (arr, color) => arr.length
    ? arr.slice(0, 7).map(p => `<div class="file-row" onclick="selectNodeByPath('${p.replace(/'/g,"\\'")}');switchTab('graph')">
        <span class="fi-icon">${fileIcon(p)}</span>
        <span class="file-name" style="color:${color}">${p.split('/').pop()}</span>
        <span class="file-meta">${p.split('/').slice(0,-1).join('/') || '/'}</span>
      </div>`).join('')
    : '<div class="empty">NONE_DETECTED</div>';

  const stackBadges = (a.stack || []).map(s =>
    `<span class="stack-badge">${s}</span>`
  ).join('');

  return `
  <div class="page-header">
    <div class="page-title">ARCHITECTURE_MAP</div>
    <div class="page-sub">Detected system topology for ${S.repo.fullName}</div>
  </div>

  ${(a.stack || []).length ? `
  <div class="card" style="margin-bottom:10px">
    <div class="sec-head"><span class="sec-head-dot" style="background:var(--cyan)"></span>DETECTED_STACK</div>
    <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">${stackBadges}</div>
  </div>` : ''}

  <div class="g2" style="margin-bottom:10px">
    ${a.frontend.length ? `<div class="card"><div class="sec-head"><span class="sec-head-dot" style="background:var(--blu)"></span>FRONTEND_FLOW</div>${flowHtml(a.frontend,'fe')}</div>` : ''}
    ${a.backend.length  ? `<div class="card"><div class="sec-head"><span class="sec-head-dot" style="background:var(--acc)"></span>BACKEND_FLOW</div>${flowHtml(a.backend,'be')}</div>`  : ''}
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:10px">
    ${a.apiFiles.length   ? `<div class="card"><div class="sec-head"><span class="sec-head-dot" style="background:var(--cyan)"></span>API_ROUTES</div>${fileList(a.apiFiles,'var(--cyan)')}</div>` : ''}
    ${a.dbFiles.length    ? `<div class="card"><div class="sec-head"><span class="sec-head-dot" style="background:var(--ylw)"></span>DATABASE_LAYER</div>${fileList(a.dbFiles,'var(--ylw)')}</div>` : ''}
    ${a.authFiles.length  ? `<div class="card"><div class="sec-head"><span class="sec-head-dot" style="background:var(--red)"></span>AUTH_FLOW</div>${fileList(a.authFiles,'var(--red)')}</div>` : ''}
    ${a.stateFiles.length ? `<div class="card"><div class="sec-head"><span class="sec-head-dot" style="background:var(--pur)"></span>STATE_MGMT</div>${fileList(a.stateFiles,'var(--pur)')}</div>` : ''}
    ${a.testFiles && a.testFiles.length ? `<div class="card"><div class="sec-head"><span class="sec-head-dot" style="background:var(--grn)"></span>TEST_FILES</div>${fileList(a.testFiles,'var(--grn)')}</div>` : ''}
    ${a.configFiles && a.configFiles.length ? `<div class="card"><div class="sec-head"><span class="sec-head-dot" style="background:var(--ylw)"></span>CONFIG_FILES</div>${fileList(a.configFiles,'var(--ylw)')}</div>` : ''}
  </div>

  <div class="card">
    <div class="sec-head"><span class="sec-head-dot" style="background:var(--acc)"></span>ENTRY_POINTS</div>
    ${a.entryPoints.length
      ? a.entryPoints.map(p => `<div class="file-row" onclick="selectNodeByPath('${p.replace(/'/g,"\\'")}');switchTab('graph')" style="border-color:var(--acc3)">
          <span class="fi-icon">${fileIcon(p)}</span>
          <span class="file-name" style="color:var(--acc)">${p}</span>
          <span class="badge b-grn">ENTRY</span>
        </div>`).join('')
      : '<div class="empty">NONE_DETECTED</div>'}
  </div>

  <div class="card" style="margin-top:10px">
    <div class="sec-head"><span class="sec-head-dot" style="background:var(--blu)"></span>FOLDER_STRUCTURE</div>
    <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">
      ${[...new Set(S.files.map(f => f.path.includes('/') ? f.path.split('/')[0] : 'root'))].map(folder => {
        const count = S.files.filter(f => (f.path.includes('/') ? f.path.split('/')[0] : 'root') === folder).length;
        return `<div class="folder-chip"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> ${folder} <span style="color:var(--t3)">${count}</span></div>`;
      }).join('')}
    </div>
  </div>
  `;
}

// ── HEALTH ────────────────────────────────────────────────────────────────
function renderHealth() {
  const h = S.health;
  const c = sCol(h.overall);
  const r = 46, circ = 2 * Math.PI * r, prog = (h.overall / 100) * circ;
  return `
  <div class="page-header">
    <div class="page-title">CODEBASE_HEALTH</div>
    <div class="page-sub">Scored across 6 dimensions: complexity · coupling · tests · docs · circular_deps · org</div>
  </div>

  <div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;margin-bottom:16px">
    <div style="flex-shrink:0;filter:drop-shadow(0 0 12px ${c}40)">
      <svg width="110" height="110">
        <circle cx="55" cy="55" r="${r}" fill="none" stroke="var(--s4)" stroke-width="6"/>
        <circle cx="55" cy="55" r="${r}" fill="none" stroke="${c}" stroke-width="6"
          stroke-dasharray="${prog.toFixed(1)} ${circ.toFixed(1)}" stroke-linecap="round"
          transform="rotate(-90 55 55)"/>
        <text x="55" y="52" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="20" font-weight="700" fill="${c}">${h.overall}</text>
        <text x="55" y="66" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="8" fill="var(--t3)">/ 100</text>
      </svg>
    </div>
    <div style="flex:1;min-width:200px">
      ${[['TEST_COVERAGE',h.testCoverage,'var(--grn)'],['DOCUMENTATION',h.docScore,'var(--acc2)'],['LOW_COMPLEXITY',h.complexityScore,'var(--ylw)'],['NO_CIRCULAR_DEPS',h.circularScore,'var(--red)'],['LOW_COUPLING',h.couplingScore,'var(--pur)'],['FOLDER_ORG',h.orgScore,'var(--cyan)']].map(([l,v,c])=>`
      <div class="h-row">
        <span class="h-label">${l}</span>
        <div class="h-track"><div class="h-fill bar-anim" data-val="${v}" style="background:${c};box-shadow:0 0 4px ${c}60"></div></div>
        <span class="h-val" style="color:${c}">${v}</span>
      </div>`).join('')}
    </div>
  </div>

  <div class="g3" style="margin-bottom:12px">
    <div class="stat-card" style="--c:var(--red)"><div class="stat-val" style="color:${h.circular?'var(--red)':'var(--acc)'}">${h.circular}</div><div class="stat-key">CIRCULAR</div></div>
    <div class="stat-card" style="--c:var(--ylw)"><div class="stat-val" style="color:var(--ylw)">${h.avgComplexity}</div><div class="stat-key">AVG_COMPLEXITY</div></div>
    <div class="stat-card" style="--c:var(--pur)"><div class="stat-val" style="color:var(--pur)">${h.avgImports}</div><div class="stat-key">AVG_IMPORTS</div></div>
  </div>

  <div class="g2">
    <div class="card">
      <div class="sec-head"><span class="sec-head-dot" style="background:var(--red)"></span>MOST_COMPLEX</div>
      ${Object.entries(S.deps).sort((a,b)=>(b[1].complexity||0)-(a[1].complexity||0)).slice(0,7).map(([path,d])=>`
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
        <span style="font-size:9px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--t2)">${path.split('/').pop()}</span>
        <div style="width:60px;height:2px;background:var(--s4)"><div style="height:100%;width:${Math.min(100,d.complexity||0)}%;background:${(d.complexity||0)>60?'var(--red)':(d.complexity||0)>30?'var(--ylw)':'var(--acc)'}"></div></div>
        <span style="font-size:9px;width:20px;text-align:right;color:var(--t2)">${d.complexity||0}</span>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="sec-head"><span class="sec-head-dot" style="background:var(--acc)"></span>RECOMMENDATIONS</div>
      ${h.testCoverage < 50 ? `<div class="file-row" style="border-color:#440000"><span class="fi-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></span><div><div style="font-size:10px;font-weight:500">ADD_TESTS</div><div style="font-size:9px;color:var(--t3)">Coverage is ${h.testCoverage}% — target 70%+</div></div></div>` : ''}
      ${h.circular > 0 ? `<div class="file-row" style="border-color:#440000"><span class="fi-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg></span><div><div style="font-size:10px;font-weight:500">FIX_CIRCULAR_DEPS</div><div style="font-size:9px;color:var(--t3)">${h.circular} circular chain${h.circular > 1 ? 's' : ''} detected</div></div></div>` : ''}
      ${h.docScore < 60 ? `<div class="file-row" style="border-color:#443300"><span class="fi-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ylw)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></span><div><div style="font-size:10px;font-weight:500">IMPROVE_DOCS</div><div style="font-size:9px;color:var(--t3)">Add README, CONTRIBUTING, LICENSE</div></div></div>` : ''}
      ${h.avgComplexity > 40 ? `<div class="file-row" style="border-color:#443300"><span class="fi-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ylw)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span><div><div style="font-size:10px;font-weight:500">REDUCE_COMPLEXITY</div><div style="font-size:9px;color:var(--t3)">Split large files into smaller units</div></div></div>` : ''}
      ${h.overall >= 70 ? `<div class="file-row" style="border-color:var(--acc3)"><span class="fi-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg></span><div><div style="font-size:10px;font-weight:500">GOOD_HEALTH</div><div style="font-size:9px;color:var(--t3)">Score ${h.overall}/100 — keep it up</div></div></div>` : ''}
    </div>
  </div>
  `;
}

function animateHealthBars() {
  document.querySelectorAll('.bar-anim').forEach(el => {
    requestAnimationFrame(() => { el.style.width = (el.dataset.val || 0) + '%'; });
  });
}

// ── AI INTEL ──────────────────────────────────────────────────────────────
const AI_ICON_EXPLAIN = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
const AI_ICON_ELI12   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>`;
const AI_ICON_TARGET  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;
const AI_ICON_HANDS   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M17 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6M17 11H7M17 11l4 4-4 4M7 11l-4 4 4 4"/></svg>`;
const AI_ICON_ARCH    = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`;
const AI_ICON_WARN    = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>`;

function renderAI() {
  const prompts = [
    {id:'explain',     icon:AI_ICON_EXPLAIN, label:'EXPLAIN_REPOSITORY',    desc:'Plain English overview — what it does and who uses it', color:'var(--acc2)'},
    {id:'eli12',       icon:AI_ICON_ELI12,   label:'ELI_12',                desc:'Jargon-free explanation with an analogy',               color:'var(--pur)'},
    {id:'problem',     icon:AI_ICON_TARGET,  label:'PROBLEM_SOLVED',        desc:'The why behind this project',                          color:'#39ff14'},
    {id:'contribute',  icon:AI_ICON_HANDS,   label:'HOW_TO_CONTRIBUTE',     desc:'Practical guide for new contributors',                  color:'var(--cyan)'},
    {id:'architecture',icon:AI_ICON_ARCH,    label:'TECHNICAL_OVERVIEW',    desc:'Deep dive into system design and data flow',            color:'var(--ylw)'},
    {id:'risks',       icon:AI_ICON_WARN,    label:'RISKS_AND_WEAKNESSES',  desc:'Top 3 technical issues to watch out for',              color:'var(--red)'},
  ];
  return `
  <div class="page-header">
    <div class="page-title">AI_INTELLIGENCE</div>
    <div class="page-sub">Groq-powered analysis of ${S.repo.fullName}${!_groqKey ? ' · <span style="color:var(--ylw)">// Set GROQ_API_KEY for AI results</span>' : ''}</div>
  </div>
  ${prompts.map(p => `
  <div class="ai-card" id="ai-${p.id}">
    <div class="ai-card-head" onclick="toggleAI('${p.id}')">
      <span class="ai-card-icon" style="color:${p.color}">${p.icon}</span>
      <div class="ai-card-info">
        <div class="ai-card-title" style="color:${p.color}">${p.label}</div>
        <div class="ai-card-desc">// ${p.desc}</div>
      </div>
      <button class="ai-gen-btn" onclick="event.stopPropagation();genAI('${p.id}')" id="btn-${p.id}">[ RUN ]</button>
      <svg id="chv-${p.id}" width="10" height="10" viewBox="0 0 24 24" fill="none" style="color:var(--t3);flex-shrink:0;transition:transform .2s"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </div>
    <div class="ai-card-body" id="body-${p.id}"></div>
  </div>`).join('')}
  `;
}

function toggleAI(id) {
  const body = document.getElementById('body-' + id);
  const chv = document.getElementById('chv-' + id);
  if (body) { body.classList.toggle('open'); chv.style.transform = body.classList.contains('open') ? 'rotate(180deg)' : ''; }
}

async function genAI(id) {
  const btn = document.getElementById('btn-' + id);
  const body = document.getElementById('body-' + id);
  if (!btn || !body) return;
  if (S.aiCache[id]) { body.innerHTML = S.aiCache[id]; body.classList.add('open'); return; }
  btn.disabled = true; btn.textContent = '[ ... ]';
  const ctx = `Repo: ${S.repo.fullName} | Files: ${S.files.length} | Langs: ${[...new Set(S.files.map(f=>f.path.split('.').pop()))].slice(0,5).join(',')} | Core: ${S.arch.coreFiles.slice(0,6).join(',')} | Health: ${S.health.overall}/100 | Circular: ${S.circularDeps.length} | Desc: ${S.repoInfo?.description||'none'}`;
  const prompts = {
    explain:`${ctx}\n\nExplain this repo in plain English. What does it do, who uses it, what are the main parts? 4-6 sentences.`,
    eli12:`${ctx}\n\nExplain this codebase to a 12-year-old. Simple words, one analogy, no jargon. 4-5 sentences.`,
    problem:`${ctx}\n\nWhat specific problem does this solve? Who experiences this problem? Why is this solution valuable? 3-5 sentences.`,
    contribute:`${ctx}\n\nPractical contribution guide: (1) where to start reading, (2) how to set up, (3) good first tasks, (4) key conventions. Be specific.`,
    architecture:`${ctx}\n\nTechnical architecture overview: frontend/backend split, data flow, key abstractions, component interactions. 5-8 technical sentences.`,
    risks:`${ctx}\n\nTop 3 technical risks or weaknesses. Be specific, reference actual data. Include a mitigation per risk.`,
  };
  const txt = await callGroq(prompts[id], 500);
  btn.textContent = '[ RE-RUN ]'; btn.disabled = false;
  const result = txt || '// GROQ_API_KEY not set — add it in [ KEYS ] to enable AI analysis';
  S.aiCache[id] = result;
  body.textContent = result;
  body.classList.add('open');
  document.getElementById('chv-' + id).style.transform = 'rotate(180deg)';
}

// ── TIMELINE ──────────────────────────────────────────────────────────────
function renderTimeline() {
  if (!S.commits.length) return '<div class="empty">// NO_COMMIT_DATA_AVAILABLE</div>';
  const byMonth = {};
  S.commits.forEach(c => {
    const d = new Date(c.commit.author.date);
    const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    byMonth[k] = (byMonth[k] || 0) + 1;
  });
  const keys = Object.keys(byMonth).sort().slice(-12);
  const max = Math.max(...keys.map(k => byMonth[k]), 1);
  return `
  <div class="page-header">
    <div class="page-title">REPOSITORY_TIMELINE</div>
    <div class="page-sub">Commit activity and contributor data</div>
  </div>
  <div class="card" style="margin-bottom:12px">
    <div class="sec-head"><span class="sec-head-dot" style="background:var(--acc2)"></span>COMMIT_ACTIVITY_12MO</div>
    ${keys.map(k=>`<div class="tl-row">
      <div class="tl-label"><span>${k}</span><span>${byMonth[k]} commits</span></div>
      <div class="tl-track"><div class="tl-fill bar-anim" data-val="${Math.round(byMonth[k]/max*100)}"></div></div>
    </div>`).join('')}
  </div>
  <div class="g2">
    <div class="card">
      <div class="sec-head"><span class="sec-head-dot" style="background:var(--acc)"></span>TOP_CONTRIBUTORS</div>
      ${S.contributors.slice(0,8).map(c=>`<div style="display:flex;align-items:center;gap:7px;margin-bottom:7px">
        <img src="${c.avatar_url}" width="20" height="20" style="border:1px solid var(--border2)" onerror="this.style.display='none'">
        <a href="${c.html_url}" target="_blank" style="font-size:10px;flex:1;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.login}</a>
        <span class="badge b-acc">${c.contributions}</span>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="sec-head"><span class="sec-head-dot" style="background:var(--ylw)"></span>RECENT_COMMITS</div>
      ${S.commits.slice(0,7).map(c=>`<div style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--border)">
        <div style="font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.commit.message.split('\n')[0]}</div>
        <div style="font-size:9px;color:var(--t3);margin-top:2px">${c.commit.author.name} · ${new Date(c.commit.author.date).toLocaleDateString()}</div>
      </div>`).join('')}
    </div>
  </div>
  `;
}

// ── ONBOARD ───────────────────────────────────────────────────────────────
function renderContribute() {
  return `
  <div class="page-header">
    <div class="page-title">ONBOARDING_GUIDE</div>
    <div class="page-sub">First 5 files to read when joining ${S.repo.fullName}</div>
  </div>
  ${S.onboarding.map((step,i)=>`
  <div class="ob-step" onclick="selectNodeByPath('${step.path.replace(/'/g,"\\'")}');switchTab('graph')">
    <div class="ob-num">${i+1}</div>
    <div>
      <div class="ob-file">${fileIcon(step.path)} ${step.path}</div>
      <div class="ob-why">// ${step.why}</div>
    </div>
  </div>`).join('')}
  <div class="card" style="margin-top:14px">
    <div class="sec-head"><span class="sec-head-dot" style="background:var(--pur)"></span>AI_ONBOARDING_GUIDE</div>
    <button class="ai-gen-btn" id="btn-onboard" onclick="genOnboardAI()">[ GENERATE_GUIDE ]</button>
    <div id="onboard-result" style="font-size:10px;color:var(--t2);line-height:1.8;margin-top:10px;white-space:pre-wrap"></div>
  </div>
  <div class="card" style="margin-top:10px">
    <div class="sec-head"><span class="sec-head-dot" style="background:var(--acc)"></span>QUICK_LINKS</div>
    ${[
      [`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`, 'VIEW_ON_GITHUB',       `https://github.com/${S.repo.fullName}`],
      [`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>`, 'OPEN_ISSUES',    `https://github.com/${S.repo.fullName}/issues`],
      [`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7M6 9v12"/></svg>`, 'PULL_REQUESTS',   `https://github.com/${S.repo.fullName}/pulls`],
      [`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`, 'CONTRIBUTORS', `https://github.com/${S.repo.fullName}/graphs/contributors`],
    ].map(([icon, label, url]) => `<a href="${url}" target="_blank" class="file-row" style="text-decoration:none"><span class="fi-icon" style="color:var(--t2)">${icon}</span><span style="color:var(--acc2)">${label}</span></a>`).join('')}
  </div>
  `;
}

async function genOnboardAI() {
  const btn = document.getElementById('btn-onboard'), res = document.getElementById('onboard-result');
  btn.disabled = true; btn.textContent = '[ GENERATING... ]';
  const prompt = `Write a step-by-step onboarding guide for a new contributor to ${S.repo.fullName} (${S.files.length} files, ${[...new Set(S.files.map(f=>f.path.split('.').pop()))].slice(0,4).join('/')}). Key files: ${S.onboarding.map(s=>s.path).join(', ')}. Cover: setup, codebase overview, finding beginner tasks, key patterns, submitting a PR.`;
  const txt = await callGroq(prompt, 600);
  btn.textContent = '[ RE-GENERATE ]'; btn.disabled = false;
  res.textContent = txt || '// Add GROQ_API_KEY in [ KEYS ] to enable AI guides';
}
