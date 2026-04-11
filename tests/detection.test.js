// DEVORA — Detection Unit Tests
const assert = (cond, msg) => { if (!cond) throw new Error('FAIL: ' + msg); console.log('PASS:', msg); };

// ── Auth Detection (strict) ───────────────────────────────────────────────
console.log('\n── Auth Detection Tests ──');
function hasAuth(txt) {
  return /\b(supabase auth|firebase auth|nextauth|auth0|passport\.js|bcrypt|jsonwebtoken|session middleware|jwt secret|login route|register route|oauth)\b/i.test(txt);
}
assert(!hasAuth('my login page for users'), 'generic login word should NOT detect auth');
assert(!hasAuth('the app has a login button'), 'login button should NOT detect auth');
assert(hasAuth('uses bcrypt for password hashing'), 'bcrypt = auth');
assert(hasAuth('supabase auth for user management'), 'supabase auth = auth');
assert(hasAuth('JWT tokens via jsonwebtoken'), 'jsonwebtoken = auth');
assert(hasAuth('nextauth for google oauth'), 'nextauth = auth');

// ── Database Detection ────────────────────────────────────────────────────
console.log('\n── Database Detection Tests ──');
function hasDB(txt) {
  return /\b(mongodb|postgresql|mysql|supabase|firebase|prisma|sequelize|mongoose|typeorm|redis|dynamodb|sqlite)\b/i.test(txt);
}
assert(hasDB('uses MongoDB for storage'), 'mongodb detected');
assert(hasDB('Prisma ORM with PostgreSQL'), 'prisma + postgresql detected');
assert(!hasDB('stores data in localStorage'), 'localStorage not db');
assert(hasDB('Redis for caching'), 'redis detected');

// ── AI/ML Detection ───────────────────────────────────────────────────────
console.log('\n── AI/ML Detection Tests ──');
function hasAI(txt) {
  return /\b(openai|anthropic|groq|huggingface|langchain|tensorflow|pytorch|scikit.learn|llm|gpt|claude api|gemini api)\b/i.test(txt);
}
assert(hasAI('uses OpenAI GPT-4 API'), 'openai detected');
assert(hasAI('groq for fast llm inference'), 'groq detected');
assert(hasAI('langchain agents'), 'langchain detected');
assert(!hasAI('this project was fun to build'), 'random text not AI');

// ── Project Type Detection ────────────────────────────────────────────────
console.log('\n── Project Type Tests ──');
function detectType(n, d, lang, desc) {
  if(n.includes('cli.js')||d.includes('bin')) return 'cli';
  if(d.some(x=>['frontend','backend','client','server'].includes(x))) return 'fullstack';
  if(n.some(x=>['server.js','app.py','main.go'].includes(x))||d.some(x=>['routes','controllers','models'].includes(x))) return 'backend';
  if(n.some(x=>x.endsWith('.ipynb'))) return 'ml-ai';
  if(n.some(x=>['vite.config.js','next.config.js'].includes(x))||d.some(x=>['components','pages'].includes(x))) return 'frontend-app';
  if(lang==='HTML'||n.includes('index.html')) return 'static';
  return 'project';
}
assert(detectType(['server.js','package.json'], [], 'JavaScript', '') === 'backend', 'server.js = backend');
assert(detectType(['cli.js'], [], 'JavaScript', '') === 'cli', 'cli.js = cli');
assert(detectType(['index.html'], [], 'HTML', '') === 'static', 'index.html + HTML = static');
assert(detectType([], ['frontend','backend'], 'JavaScript', '') === 'fullstack', 'frontend+backend dirs = fullstack');
assert(detectType(['notebook.ipynb'], [], 'Python', '') === 'ml-ai', '.ipynb = ml-ai');
assert(detectType(['vite.config.js'], [], 'JavaScript', '') === 'frontend-app', 'vite.config = frontend-app');

// ── Score Color Thresholds ────────────────────────────────────────────────
console.log('\n── Edge Case Tests ──');
assert(Math.min(100, Math.max(0, 105)) === 100, 'score caps at 100');
assert(Math.min(100, Math.max(0, -5)) === 0, 'score floors at 0');
assert(Math.min(100, Math.round(50*.28+50*.22+50*.30+50*.20)) === 50, 'balanced weights sum to input');

console.log('\n✓ All detection tests passed\n');
