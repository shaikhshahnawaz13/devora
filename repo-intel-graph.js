// ══ REPO INTEL GRAPH — Terminal Noir Renderer ════════════════════════════

let simulation, svgSel, gSel, zoomBeh;
let _impactMode = false;
let _folderColors = {};
const FOLDER_PALETTE = [
  '#00cc44','#00aaff','#ff7700','#cc44ff','#ffcc00',
  '#00ffcc','#ff4499','#88ff00','#ff8800','#44bbff',
  '#aa44ff','#ff4444','#00ee88','#ffaa00','#4488ff',
];

// ── BUILD GRAPH DATA ──────────────────────────────────────────────────────
function buildGraphData() {
  const arch = S.arch;
  const nodeMap = {};
  const folders = [...new Set(S.files.map(f => f.path.includes('/') ? f.path.split('/')[0] : 'root'))];
  folders.forEach((f, i) => { _folderColors[f] = FOLDER_PALETTE[i % FOLDER_PALETTE.length]; });

  S.files.forEach(f => {
    const base = f.path.split('/').pop();
    const d = S.deps[f.path] || { imports: [], importedBy: [], complexity: 0, lines: 0 };
    const isEntry = arch.entryPoints.includes(f.path);
    const isCore = arch.coreFiles.includes(f.path);
    const isConfig = ['package.json','cargo.toml','go.mod','config.js','tsconfig.json','.env'].includes(base);
    const isCircular = S.circularDeps.some(c => c.includes(f.path));
    const isDead = (d.importedBy.length === 0) && !isEntry && !isConfig && !f.path.endsWith('.md') && !f.path.endsWith('.yml');
    const folder = f.path.includes('/') ? f.path.split('/')[0] : 'root';

    nodeMap[f.path] = {
      id: f.path, label: base, path: f.path,
      folder, isEntry, isCore, isConfig, isCircular, isDead,
      r: Math.max(4, Math.min(20, (d.importedBy.length + 1) * 2 + (d.complexity || 0) / 30 + 4)),
      imports: d.imports, importedBy: d.importedBy, functions: d.functions || [],
      complexity: d.complexity || 0, lines: d.lines || 0, fileSize: f.size || 0,
    };
  });

  S.nodes = Object.values(nodeMap);
  S.links = [];
  S.files.forEach(f => {
    (S.deps[f.path]?.imports || []).forEach(imp => {
      const t = resolveImport(imp, f.path, S.files);
      if (t && nodeMap[t] && t !== f.path) {
        const isCirc = S.circularDeps.some(c => c.includes(f.path) && c.includes(t));
        S.links.push({ source: f.path, target: t, type: isCirc ? 'circular' : 'import' });
      }
    });
  });
}

// ── NODE COLOR ────────────────────────────────────────────────────────────

function nColor(d) {
  if (d.isCircular) return '#ff3333';
  if (d.isEntry)    return '#00ff41';
  if (d.isCore)     return '#4499ff';
  if (d.isConfig)   return '#ffd700';
  if (d.isDead)     return '#2a3a2a';
  return _folderColors[d.folder] || '#00aa44';
}

function nGlow(d) {
  if (d.isCircular) return '#ff333360';
  if (d.isEntry)    return '#00ff4150';
  if (d.isCore)     return '#4499ff40';
  if (d.isConfig)   return '#ffd70040';
  return 'transparent';
}

// ── RENDER GRAPH ──────────────────────────────────────────────────────────
function renderGraph() {
  const container = document.getElementById('graph-container');
  const W = container.clientWidth;
  const H = container.clientHeight;

  // Draw background grid on canvas
  drawGridCanvas(W, H);

  svgSel = d3.select('#graph-svg');
  svgSel.selectAll('*').remove();

  const defs = svgSel.append('defs');

  // Glow filters
  ['green','blue','red','yellow','none'].forEach(id => {
    const f = defs.append('filter').attr('id', 'glow-' + id).attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    f.append('feGaussianBlur').attr('stdDeviation', id === 'none' ? 0 : 3).attr('result', 'blur');
    const merge = f.append('feMerge');
    merge.append('feMergeNode').attr('in', 'blur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');
  });

  // Arrow markers
  ['import','circular'].forEach(type => {
    defs.append('marker').attr('id', 'arr-' + type)
      .attr('viewBox', '0 -3 6 6').attr('refX', 14).attr('refY', 0)
      .attr('markerWidth', 4).attr('markerHeight', 4).attr('orient', 'auto')
      .append('path').attr('d', 'M0,-3L6,0L0,3')
      .attr('fill', type === 'circular' ? '#ff333360' : '#00ff4120');
  });

  zoomBeh = d3.zoom().scaleExtent([.03, 6]).on('zoom', e => gSel.attr('transform', e.transform));
  svgSel.call(zoomBeh);
  gSel = svgSel.append('g');

  // Links
  const link = gSel.append('g').selectAll('line')
    .data(S.links).join('line')
    .attr('class', 'gl')
    .attr('stroke', d => d.type === 'circular' ? '#ff333330' : '#00ff4112')
    .attr('stroke-width', .7)
    .attr('stroke-dasharray', d => d.type === 'circular' ? '3 2' : null)
    .attr('marker-end', d => 'url(#arr-' + d.type + ')');

  // Node groups
  const node = gSel.append('g').selectAll('g')
    .data(S.nodes).join('g')
    .attr('class', 'gn')
    .call(d3.drag().on('start', ds).on('drag', dd).on('end', de))
    .on('click', (e, d) => onNodeClick(e, d))
    .on('mouseenter', (e, d) => showTT(e, d))
    .on('mouseleave', hideTT);

  // Pulse ring for entry/core
  node.filter(d => d.isEntry || d.isCore)
    .append('circle')
    .attr('r', d => d.r + 8)
    .attr('fill', 'none')
    .attr('stroke', d => nColor(d))
    .attr('stroke-width', .5)
    .attr('stroke-opacity', .2)
    .attr('stroke-dasharray', '4 4');

  // Second ring for entry
  node.filter(d => d.isEntry)
    .append('circle')
    .attr('r', d => d.r + 14)
    .attr('fill', 'none')
    .attr('stroke', '#00ff41')
    .attr('stroke-width', .3)
    .attr('stroke-opacity', .1);

  // Main circle — make dead nodes visible with dashed stroke
  node.append('circle')
    .attr('r', d => d.r)
    .attr('fill', d => d.isDead ? 'transparent' : nColor(d) + 'cc')
    .attr('stroke', d => d.isDead ? '#3a5a3a' : nColor(d))
    .attr('stroke-width', d => d.isDead ? .8 : (d.isEntry || d.isCore) ? 1.5 : .8)
    .attr('stroke-dasharray', d => d.isDead ? '3 2' : null)
    .style('filter', d => d.isEntry ? 'url(#glow-green)' : d.isCore ? 'url(#glow-blue)' : d.isCircular ? 'url(#glow-red)' : 'none');

  // Label — show all nodes, not just important ones
  node.append('text')
    .attr('dy', '0.35em')
    .attr('dx', d => d.r + 4)
    .attr('font-family', "'JetBrains Mono', monospace")
    .attr('font-size', d => d.isEntry || d.isCore ? 9.5 : 8.5)
    .attr('fill', d => d.isEntry ? '#00ff41' : d.isCore ? '#4499ff' : d.isDead ? '#3a5a3a' : nColor(d) + 'cc')
    .attr('font-weight', d => d.isEntry || d.isCore ? '600' : '400')
    .text(d => d.label.length > 22 ? d.label.slice(0, 20) + '…' : d.label);

  // Force sim
  simulation = d3.forceSimulation(S.nodes)
    .force('link', d3.forceLink(S.links).id(d => d.id).distance(85).strength(.2))
    .force('charge', d3.forceManyBody().strength(-220).distanceMax(350))
    .force('center', d3.forceCenter(W / 2, H / 2).strength(.06))
    .force('collision', d3.forceCollide().radius(d => d.r + 12).strength(.85))
    .on('tick', () => {
      link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    })
    .on('end', () => {
      graphFit();
    });

  // Also fit after a timeout as a fallback for large repos
  setTimeout(graphFit, 3000);

  // Update HUD stats
  const deadCount = S.nodes.filter(n => n.isDead).length;
  document.getElementById('hud-nodes').textContent = S.nodes.length;
  document.getElementById('hud-edges').textContent = S.links.length;
  document.getElementById('hud-circ').textContent  = S.circularDeps.length;
  document.getElementById('hud-dead').textContent  = deadCount;
}

function drawGridCanvas(W, H) {
  const canvas = document.getElementById('graph-bg');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#0f1a0f';
  ctx.lineWidth = .5;
  const size = 36;
  for (let x = 0; x <= W; x += size) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += size) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}

// ── DRAG ──────────────────────────────────────────────────────────────────
function ds(e, d) { if (!e.active) simulation.alphaTarget(.3).restart(); d.fx = d.x; d.fy = d.y; }
function dd(e, d) { d.fx = e.x; d.fy = e.y; }
function de(e, d) { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }

// ── ZOOM ──────────────────────────────────────────────────────────────────
function graphZoomIn()  { if (svgSel) svgSel.transition().duration(250).call(zoomBeh.scaleBy, 1.5); }
function graphZoomOut() { if (svgSel) svgSel.transition().duration(250).call(zoomBeh.scaleBy, .67); }
function graphFit() {
  if (!svgSel || !S.nodes.length) return;
  const container = document.getElementById('graph-container');
  const W = container.clientWidth  || 800;
  const H = container.clientHeight || 600;

  // Filter nodes that have been positioned by simulation
  const positionedNodes = S.nodes.filter(n => n.x != null && n.y != null);
  if (!positionedNodes.length) return;

  const xs = positionedNodes.map(n => n.x);
  const ys = positionedNodes.map(n => n.y);
  const x0 = Math.min(...xs) - 40;
  const x1 = Math.max(...xs) + 40;
  const y0 = Math.min(...ys) - 40;
  const y1 = Math.max(...ys) + 40;
  const dx = (x1 - x0) || 1;
  const dy = (y1 - y0) || 1;

  // Fit with padding, capped between 0.05 and 2
  const scale = Math.max(0.05, Math.min(2, Math.min(W / dx, H / dy) * 0.88));
  const tx = W / 2 - scale * (x0 + x1) / 2;
  const ty = H / 2 - scale * (y0 + y1) / 2;
  svgSel.transition().duration(700).call(
    zoomBeh.transform,
    d3.zoomIdentity.translate(tx, ty).scale(scale)
  );
}

// ── TOOLTIP ───────────────────────────────────────────────────────────────
function showTT(e, d) {
  const tt = document.getElementById('g-tooltip');
  tt.innerHTML = `
    <div class="tt-file">${d.label}</div>
    <div class="tt-path">${d.path}</div>
    <div class="tt-row">
      <span class="tt-chip">${d.lines}L</span>
      <span class="tt-chip">cx:${d.complexity}</span>
      <span class="tt-chip">${d.importedBy.length}↑</span>
      <span class="tt-chip">${d.imports.length}↓</span>
    </div>
    ${d.isEntry ? '<div class="tt-flag" style="color:#00ff41">⚡ ENTRY_POINT</div>' : ''}
    ${d.isCore ? '<div class="tt-flag" style="color:#4499ff">★ CORE_FILE</div>' : ''}
    ${d.isCircular ? '<div class="tt-flag" style="color:#ff3333">⚠ CIRCULAR_DEP</div>' : ''}
    ${d.isDead ? '<div class="tt-flag" style="color:#3a5a3a">◻ POSSIBLY_UNUSED</div>' : ''}
  `;
  tt.style.display = 'block';
  tt.style.left = Math.min(e.clientX + 14, window.innerWidth - 260) + 'px';
  tt.style.top = Math.max(e.clientY - 80, 60) + 'px';
}
function hideTT() { document.getElementById('g-tooltip').style.display = 'none'; }

// ── NODE CLICK ────────────────────────────────────────────────────────────
function onNodeClick(e, d) {
  if (_impactMode) { doImpact(d); return; }
  S.selectedFile = d;
  openInspector(d);
  highlightConnected(d);
}

function highlightConnected(d) {
  if (!gSel) return;
  const connected = new Set([d.id, ...(d.imports.map(i => resolveImport(i, d.path, S.files)).filter(Boolean)), ...d.importedBy]);
  gSel.selectAll('.gn circle').transition().duration(200)
    .attr('opacity', n => connected.has(n.id) ? 1 : .12);
  gSel.selectAll('.gl').transition().duration(200)
    .attr('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 1 : .04);
  gSel.selectAll('.gn text').transition().duration(200)
    .attr('opacity', n => connected.has(n.id) ? 1 : .1);
}

function resetHighlight() {
  if (!gSel) return;
  gSel.selectAll('.gn circle').transition().duration(200).attr('opacity', 1);
  gSel.selectAll('.gl').transition().duration(200).attr('stroke-opacity', null);
  gSel.selectAll('.gn text').transition().duration(200).attr('opacity', 1);
}

// ── IMPACT MODE ───────────────────────────────────────────────────────────
function toggleImpact() {
  _impactMode = !_impactMode;
  document.getElementById('impact-overlay').classList.toggle('hidden', !_impactMode);
  document.getElementById('impact-btn').classList.toggle('on', _impactMode);
  if (!_impactMode) resetHighlight();
}

function doImpact(d) {
  const affected = new Set();
  function trace(path, depth) {
    if (depth > 5) return;
    (S.deps[path]?.importedBy || []).forEach(p => { if (!affected.has(p)) { affected.add(p); trace(p, depth + 1); } });
  }
  trace(d.path, 0);
  const conf = Math.min(95, Math.round(55 + affected.size * 5));

  // Color the graph by impact
  gSel.selectAll('.gn circle').transition().duration(300)
    .attr('opacity', n => n.id === d.id ? 1 : affected.has(n.id) ? .85 : .07)
    .attr('stroke', n => n.id === d.id ? '#bf00ff' : affected.has(n.id) ? '#bf00ff60' : null);
  gSel.selectAll('.gl').transition().duration(300)
    .attr('stroke-opacity', l => l.source.id === d.id || affected.has(l.source.id) ? .8 : .03);

  openImpactInspector(d, affected, conf);
}

function openImpactInspector(d, affected, conf) {
  document.getElementById('insp-empty').classList.add('hidden');
  document.getElementById('insp-content').classList.remove('hidden');
  document.getElementById('insp-filename').textContent = '⚡ ' + d.label;
  document.getElementById('insp-path').textContent = d.path;
  document.getElementById('insp-badges').innerHTML = `<span class="badge b-pur">IMPACT_ANALYSIS</span>`;
  document.getElementById('insp-body').innerHTML = `
    <div style="border:1px solid #440066;padding:10px;background:#0d0019">
      <div style="font-size:10px;font-weight:600;color:var(--pur);margin-bottom:5px">IMPACT_RADIUS</div>
      <div style="font-size:10px;color:var(--t2);line-height:1.7">Editing <span style="color:var(--text)">${d.label}</span> may affect <span style="color:var(--pur);font-weight:600">${affected.size} file${affected.size !== 1 ? 's' : ''}</span> across the codebase.</div>
      <div style="margin-top:8px;display:flex;align-items:center;gap:7px">
        <div style="flex:1;height:2px;background:var(--s4)"><div style="height:100%;width:${conf}%;background:var(--pur);box-shadow:0 0 6px var(--pur)"></div></div>
        <span style="font-size:9px;color:var(--pur)">${conf}% CONF</span>
      </div>
    </div>
    ${affected.size ? `
    <div class="insp-sec">
      <div class="insp-sec-title" style="color:var(--pur)">AFFECTED_FILES (${affected.size})</div>
      ${[...affected].slice(0, 12).map(p => `<div class="insp-file-row" style="border-color:#440066">
        <span class="insp-file-name">${p.split('/').pop()}</span>
        <span class="insp-file-dir">${p.split('/').slice(0,-1).join('/')}</span>
      </div>`).join('')}
      ${affected.size > 12 ? `<div style="font-size:9px;color:var(--t3);padding:3px 0">+${affected.size - 12} more</div>` : ''}
    </div>` : '<div style="font-size:10px;color:var(--t3)">NO_DEPENDENTS_FOUND</div>'}
    <button class="insp-impact-btn" onclick="toggleImpact()">[ EXIT_IMPACT_MODE ]</button>
  `;
}

// ── FILE SIDEBAR RENDERER ─────────────────────────────────────────────────
function renderFileSidebar() {
  document.querySelector('.fsb-count') && (document.querySelector('.fsb-count').textContent = S.files.length);
  renderFileTree(S.files, '');
  renderOutline();
}

function filterFiles(v) {
  renderFileTree(S.files, v.trim());
}

function renderFileTree(files, filter) {
  const tree = document.getElementById('file-tree');
  if (!tree) return;

  const q = (filter || '').toLowerCase();
  const filtered = q ? files.filter(f => f.path.toLowerCase().includes(q)) : files;

  // When filtering: flat list so nothing is hidden by folder collapse
  if (q) {
    tree.innerHTML = filtered.length === 0
      ? `<div style="font-size:9px;color:var(--t3);padding:16px 12px;text-align:center">// NO_MATCHES</div>`
      : filtered.map(f => {
          const isEntry = S.arch.entryPoints.includes(f.path);
          const isCore  = S.arch.coreFiles.includes(f.path);
          const isCirc  = S.circularDeps.some(c => c.includes(f.path));
          const cls = [isEntry?'is-entry':'', isCore?'is-core':'', isCirc?'is-circular':''].filter(Boolean).join(' ');
          return `<div class="tf-file ${cls}" onclick="selectNodeByPath('${f.path.replace(/'/g,"\\'")}')">
            <span class="fi-icon">${fileIcon(f.path)}</span>
            <span class="tf-name" title="${f.path}">${f.path}</span>
            ${isEntry?'<span class="tf-tag entry">ENTRY</span>':''}
            ${isCore ?'<span class="tf-tag core">CORE</span>'  :''}
            ${isCirc ?'<span class="tf-tag circ">⟳</span>'     :''}
          </div>`;
        }).join('');
    return;
  }

  // No filter: grouped by top-level folder
  const groups = {};
  filtered.forEach(f => {
    const key = f.path.includes('/') ? f.path.split('/')[0] : 'root';
    if (!groups[key]) groups[key] = [];
    groups[key].push(f);
  });

  tree.innerHTML = Object.entries(groups).sort((a, b) => b[1].length - a[1].length).map(([folder, fls]) => `
    ${fls.length > 1
      ? `<div class="tf-folder" onclick="toggleFolderNode('folder-${folder}')">
           <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ylw)" stroke-width="1.5" style="flex-shrink:0"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
           ${folder}
           <span style="font-size:8px;color:var(--t3);margin-left:auto">${fls.length}</span>
         </div>`
      : ''}
    <div id="folder-${folder}">
      ${fls.map(f => {
        const isEntry = S.arch.entryPoints.includes(f.path);
        const isCore  = S.arch.coreFiles.includes(f.path);
        const isCirc  = S.circularDeps.some(c => c.includes(f.path));
        const cls = [isEntry?'is-entry':'', isCore?'is-core':'', isCirc?'is-circular':''].filter(Boolean).join(' ');
        return `<div class="tf-file ${cls}" onclick="selectNodeByPath('${f.path.replace(/'/g,"\\'")}')">
          <span class="fi-icon">${fileIcon(f.path)}</span>
          <span class="tf-name">${f.path.split('/').pop()}</span>
          ${isEntry?'<span class="tf-tag entry">ENTRY</span>':''}
          ${isCore ?'<span class="tf-tag core">CORE</span>'  :''}
          ${isCirc ?'<span class="tf-tag circ">⟳</span>'     :''}
        </div>`;
      }).join('')}
    </div>
  `).join('');
}

function renderOutline() {
  const el = document.getElementById('outline-content');
  if (!el) return;
  const entryItems = S.arch.entryPoints.map(p =>
    `<div class="tf-file is-entry" onclick="selectNodeByPath('${p.replace(/'/g,"\\'")}')"><span class="fi-icon">${fileIcon(p)}</span><span class="tf-name">${p.split('/').pop()}</span><span class="tf-tag entry">ENTRY</span></div>`
  ).join('');
  const coreItems = S.arch.coreFiles.slice(0, 8).map(p =>
    `<div class="tf-file is-core" onclick="selectNodeByPath('${p.replace(/'/g,"\\'")}')"><span class="fi-icon">${fileIcon(p)}</span><span class="tf-name">${p.split('/').pop()}</span><span class="tf-tag core">CORE</span></div>`
  ).join('');
  const circItems = S.circularDeps.slice(0, 5).map(c =>
    `<div style="font-size:9px;color:var(--red);padding:3px 10px;border-left:2px solid var(--red)">${c.map(p => p.split('/').pop()).join(' → ')}</div>`
  ).join('');
  el.innerHTML = `
    <div class="tf-folder" style="color:var(--acc)">▸ ENTRY_POINTS</div>${entryItems}
    <div class="tf-folder" style="color:var(--blu)">▸ CORE_FILES</div>${coreItems}
    ${circItems ? `<div class="tf-folder" style="color:var(--red)">▸ CIRCULAR_DEPS</div>${circItems}` : ''}
  `;
}

function toggleFolderNode(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}



function selectNodeByPath(path) {
  const node = S.nodes.find(n => n.id === path);
  if (!node) return;
  openInspector(node);
  highlightConnected(node);
  if (svgSel && node.x != null) {
    const W = document.getElementById('graph-container').clientWidth;
    const H = document.getElementById('graph-container').clientHeight;
    svgSel.transition().duration(550).call(zoomBeh.transform, d3.zoomIdentity.translate(W / 2 - node.x, H / 2 - node.y).scale(1));
  }
}
