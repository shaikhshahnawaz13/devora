// DEVORA — Scoring Unit Tests (Node.js, no dependencies)
const assert = (cond, msg) => { if (!cond) throw new Error('FAIL: ' + msg); console.log('PASS:', msg); };

// ── Inline scoring functions for testing ─────────────────────────────────
function rmScore(m) {
  const wc = m.wc===0?0:m.wc<50?18:m.wc<150?42:m.wc<300?65:m.wc<500?82:100;
  return Math.round(wc*.34+(m.h===0?0:m.h<2?38:m.h<=3?68:100)*.22+(m.cb===0?0:m.cb===1?60:100)*.22+(m.lk===0?0:50)*.12+(m.bd?100:0)*.10);
}
function repoQuality(f, rs) {
  return Math.round((f.r?rs:0)*.30+(f.l?100:0)*.15+(f.g?100:0)*.12+(f.dep?100:0)*.12+(f.ci?100:0)*.10+(f.t?100:0)*.10+(f.deploy?100:0)*.08+(f.topics?100:0)*.08+(f.src?100:0)*.03+(f.cfg?100:0)*.02);
}
function repoFinal(q, a, d, p) { return Math.min(100, Math.round(q*.28+a*.22+d*.30+p*.20)); }
function sCol(s) { return s>=75?'green':s>=50?'blue':s>=30?'yellow':'red'; }
function dimReputation(owned, followers) {
  const ts=owned.reduce((s,r)=>s+r.stars,0);
  const ss=ts===0?0:ts<5?8:ts<20?18:ts<100?32:ts<500?50:ts<2000?66:ts<10000?80:ts<50000?92:ts<200000?97:100;
  const fls=followers===0?0:followers<5?5:followers<20?15:followers<100?28:followers<500?46:followers<2000?66:followers<10000?84:100;
  return Math.round(ss*.65+fls*.35);
}

// ── README SCORING ────────────────────────────────────────────────────────
console.log('\n── README Score Tests ──');
assert(rmScore({wc:0,h:0,cb:0,lk:0,bd:0}) === 0, 'empty readme = 0');
assert(rmScore({wc:600,h:4,cb:2,lk:3,bd:1}) > 90, 'rich readme > 90');
assert(rmScore({wc:100,h:1,cb:0,lk:0,bd:0}) < rmScore({wc:400,h:3,cb:2,lk:2,bd:0}), 'better readme scores higher');

// ── QUALITY SCORING ───────────────────────────────────────────────────────
console.log('\n── Quality Score Tests ──');
const fullFile = {r:1,l:1,g:1,c:1,ci:1,dep:1,t:1,deploy:1,src:1,cfg:1,docker:0,topics:1};
const emptyFile = {r:0,l:0,g:0,c:0,ci:0,dep:0,t:0,deploy:0,src:0,cfg:0,docker:0,topics:0};
assert(repoQuality(fullFile, 100) > 90, 'perfect repo quality > 90');
assert(repoQuality(emptyFile, 0) === 0, 'empty repo quality = 0');
assert(repoQuality(fullFile, 0) < repoQuality(fullFile, 80), 'better readme = better quality');

// ── FINAL SCORE ───────────────────────────────────────────────────────────
console.log('\n── Final Score Tests ──');
assert(repoFinal(100, 100, 100, 100) === 100, 'perfect = 100');
assert(repoFinal(0, 0, 0, 0) === 0, 'zero = 0');
assert(repoFinal(50, 50, 50, 50) === 50, 'all 50 = 50');
const depthHeavy = repoFinal(40, 40, 90, 40);
const qualHeavy = repoFinal(90, 40, 40, 40);
assert(depthHeavy > qualHeavy, 'depth (30% weight) > quality (28% weight) when maxed');

// ── COLOR TIERS ───────────────────────────────────────────────────────────
console.log('\n── Score Color Tests ──');
assert(sCol(80) === 'green', 'score 80 = green');
assert(sCol(60) === 'blue', 'score 60 = blue');
assert(sCol(40) === 'yellow', 'score 40 = yellow');
assert(sCol(20) === 'red', 'score 20 = red');

// ── REPUTATION ────────────────────────────────────────────────────────────
console.log('\n── Reputation Tests ──');
const noStars = dimReputation([{stars:0}], 0);
const manyStars = dimReputation([{stars:5000},{stars:2000}], 500);
assert(noStars < 10, 'no stars = low reputation');
assert(manyStars > 70, '7k stars + 500 followers = good reputation');
assert(dimReputation([{stars:250000}], 300000) > 95, 'linux-level stars = near max');

console.log('\n✓ All scoring tests passed\n');
