<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=5e6ad2&height=200&section=header&text=Devora&fontSize=80&fontColor=ffffff&fontAlignY=38&desc=Developer%20Intelligence%20Platform&descAlignY=60&descSize=20&descColor=a5b4fc&animation=fadeIn"/>

<br/>

[![Live Demo](https://img.shields.io/badge/%F0%9F%9A%80%20Live%20Demo-devora-5e6ad2?style=for-the-badge&logo=github&logoColor=white)](https://shaikhshahnawaz13.github.io/devora)
&nbsp;
[![License MIT](https://img.shields.io/badge/License-MIT-34d399?style=for-the-badge)](LICENSE)
&nbsp;
[![JavaScript](https://img.shields.io/badge/Built%20With-Vanilla%20JS-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/shaikhshahnawaz13/devora)
&nbsp;
[![Groq AI](https://img.shields.io/badge/AI-Groq%20Powered-f97316?style=for-the-badge)](https://console.groq.com)

<br/>

> **Devora** analyzes any GitHub profile in seconds — scoring repositories across 5 dimensions, detecting technical depth signals, and generating AI-powered insights with a personalized roadmap. No setup. No backend. Runs entirely in your browser.

<br/>

</div>

---

<div align="center">

### ⚡ Quick Numbers

| | |
|:---:|:---:|
| ![Dimensions](https://img.shields.io/badge/5-Portfolio%20Dimensions-5e6ad2?style=flat-square) | ![Signals](https://img.shields.io/badge/10%2B-Depth%20Signals-34d399?style=flat-square) |
| ![Types](https://img.shields.io/badge/7-Project%20Types-a78bfa?style=flat-square) | ![Dependencies](https://img.shields.io/badge/0-Dependencies-f87171?style=flat-square) |

</div>

---

## 🔍 What Is Devora?

Devora is not a star counter. It is an intelligent portfolio analyzer that goes deep into every repository to detect **what you actually built**, **how technically complex it is**, and **what it would take to score higher**.

It identifies project types, detects 10 technical depth signals, and surfaces your strongest and weakest repos — then generates AI-powered insights using Groq's `llama3-8b-8192` model to give you real, actionable feedback.

Everything runs in the browser. No backend. No build step. No npm install.

---

## 🚀 How It Works

```
Enter Username → Fetch All Repos → Analyze Each Repo → Score 5 Dimensions → AI Insights
```

**Step 1 — Repository Discovery**

All public repositories are fetched. Profile README repos (same name as username) are automatically excluded from scoring so they do not skew your results.

**Step 2 — Per-Repo Analysis**

Each repository is scored across 4 sub-dimensions:

| Sub-Dimension | What It Measures | Weight |
|---|---|---|
| Quality | README depth, LICENSE, .gitignore, tests, CI/CD, deployment, topics | 28% |
| Activity | Recency, commit patterns, project age, codebase size | 22% |
| Depth | Technical signal detection (see below) | 30% |
| Popularity | Stars, forks, original vs fork status | 20% |

**Step 3 — Portfolio Score**

Individual repo scores are aggregated into a 5-dimension portfolio score:

| Dimension | Weight | What It Measures |
|---|---|---|
| Reputation | 30% | Stars, forks, and follower count across all repos |
| Activity | 20% | Recent commits, active repo ratio, account longevity |
| Technical Depth | 25% | Advanced signal detection across all repos |
| Diversity | 15% | Language variety and project type range |
| Quality | 10% | Documentation and structure health |

---

## 🔬 Intelligent Scoring System

### Capability Detection — 10 Signals

Devora scans file names, directory names, and README text for each repository:

| Signal | How It Is Detected | Score Boost |
|---|---|---|
| **Auth** | `auth.js`, `passport.js`, `bcrypt`, `jsonwebtoken`, `nextauth` in files or README | +15 pts |
| **Database** | `prisma`, `mongoose`, `models/` dir, `mongodb`, `postgresql` in README | +15 pts |
| **API Design** | `routes/` dir, `graphql`, `openapi`, REST patterns | +12 pts |
| **AI / ML** | `openai`, `langchain`, `tensorflow`, `pytorch`, `groq` in README | +20 pts |
| **Testing** | `tests/` dir, `jest.config.js`, `pytest.ini`, `cypress.config.js` | +12 pts |
| **Docker** | `Dockerfile`, `docker-compose.yml` in root | +10 pts |
| **CI/CD** | `.github/workflows/`, `.travis.yml`, `jenkinsfile` | +8 pts |
| **TypeScript** | `tsconfig.json` present, or language === TypeScript | +8 pts |
| **Real-time** | `socket.io`, `websocket`, SSE patterns in README | +12 pts |
| **State Management** | `redux`, `zustand`, `vuex`, `recoil` in README | +8 pts |

### Activity Score Breakdown

```
Last commit today     →  100 points
Last commit 1 week    →   88 points
Last commit 1 month   →   72 points
Last commit 3 months  →   48 points
Last commit 6 months  →   24 points
Last commit 1+ year   →    8 points

Active repo ratio     →  35% of activity score
Account longevity     →  20% of activity score (2+ years = 100)
```

### Prestige Ceiling

Scores above **85** require real-world community impact. The ceiling is:

```
Prestige Ceiling = 85 + prestige points (max ~18)

Best repo stars:    100k+ = +7,  20k+ = +6,  5k+ = +5,  1k+ = +4
Follower count:     100k+ = +5,  10k+ = +4,  1k+ = +3
Language tier:      C/Rust/Zig = +3,  Go/Java = +2,  TypeScript/Python = +1
Fork count:         10k+ owned forks = +2,  500+ = +1
Quality repos:      4+ repos scoring 70+ = +1
```

### Project Type Awareness

Devora detects 7 project types from file structure and directory names:

| Type | Detection Method |
|---|---|
| `fullstack` | Both frontend and backend directories present |
| `backend` | `server.js`, `routes/`, `controllers/`, `models/` present |
| `frontend-app` | `vite.config`, `next.config`, `components/` present |
| `static` | HTML-only project, no server files |
| `cli` | `bin/` directory, CLI-specific entry points |
| `ml-ai` | `.ipynb` files, ML library references in README |
| `library` | Published package patterns |

---

## 🤖 AI Insight Engine

Powered by **Groq `llama3-8b-8192`** with 4 built-in API keys and automatic rotation:

<details>
<summary><strong>What the AI generates</strong></summary>

<br/>

- **Strengths** — 3 specific strengths identified from your portfolio data
- **Areas to Improve** — 3 specific weaknesses with context
- **Recommendations** — 5 actionable items with specific guidance
- **Career Readiness** — `Not Ready` | `Partially Ready` | `Job Ready` | `Senior Ready`
- **AI Roadmap** — 5-step personalized plan with priority levels and timeframe estimates

</details>

<details>
<summary><strong>Key rotation and fallback</strong></summary>

<br/>

If a Groq key hits its rate limit, Devora automatically tries the next built-in key. If all keys are exhausted, an error screen guides you through getting your own free key from `console.groq.com` in under 60 seconds.

</details>

---

## 📊 Pentagon Score Breakdown

Each portfolio gets a pentagon radar chart across 5 dimensions. Dots are **interactive** — hover or tap to see exactly what each score means and how to improve it. No numbers are shown by default to keep the chart clean.

---

## 🔔 Feedback System

Suggestions are **always generated** — the system never shows an empty card. Priority levels:

| Priority | Color | Examples |
|---|---|---|
| Critical | 🔴 | Missing README, no LICENSE file |
| Recommended | 🟡 | No deployment, inactive for 6+ months |
| Optional | 🔵 | Missing topics, no CONTRIBUTING.md |

---

## 📈 Progress Tracking

Every analysis run while signed in is saved automatically. Re-analyze the same profile after making improvements and your score history builds into a timeline. The progress tab shows:

- Score on each date analyzed
- First score vs latest score
- Total change (positive or negative)

---

## 🗺️ Developer Roadmap

The AI roadmap provides:

- A specific title and description for each step
- Priority level — `high`, `medium`, or `low`
- Timeframe estimate — `1–2 weeks`, `4–8 weeks`, `Ongoing`
- A focus sentence — the single most important next action

Guests receive a rule-based roadmap. Signed-in users get the full AI-generated version.

---

## 🏗️ Backend System

| Service | Purpose |
|---|---|
| **Supabase** | Email + password authentication, analysis history storage |
| **GitHub REST API** | Public repo data, README content, file tree |
| **Groq API** | AI insights and roadmap generation |
| **GitHub Pages** | Static hosting — zero server cost |

---

## 🎨 UI Design

<div align="center">

![Dark Mode](https://img.shields.io/badge/Dark%20Mode-%230f0f11-1e1e23?style=flat-square&labelColor=0f0f11&color=5e6ad2)
&nbsp;
![Light Mode](https://img.shields.io/badge/Light%20Mode-%23f5f5f7-f5f5f7?style=flat-square&labelColor=f5f5f7&color=5e6ad2)
&nbsp;
![Accent](https://img.shields.io/badge/Accent-%235e6ad2-5e6ad2?style=flat-square)

</div>

Inspired by [Linear](https://linear.app) — minimal, fast, sharp, and keyboard-friendly.

- Hard `1px` borders everywhere — no blur, no soft shadows
- Wave theme transition — old theme shrinks away from click point, revealing new theme underneath
- Fully responsive — sidebar collapses to a slide-in drawer on mobile
- Horizontal-scrollable tabs on small screens

---

## 🧱 Tech Stack

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)
&nbsp;
![CSS](https://img.shields.io/badge/CSS-Custom%20Design%20System-5e6ad2?style=for-the-badge&logo=css3&logoColor=white)
&nbsp;
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)
&nbsp;
![Groq](https://img.shields.io/badge/Groq-llama3--8b-f97316?style=for-the-badge)

</div>

| Layer | Technology |
|---|---|
| Frontend | Vanilla JavaScript ES2022 — no frameworks, no build step |
| Fonts | Inter + JetBrains Mono (Google Fonts) |
| AI | Groq API — `llama3-8b-8192` |
| Auth + Database | Supabase (PostgreSQL + Row Level Security) |
| Hosting | GitHub Pages — free, zero configuration |
| CI | GitHub Actions — syntax checks + unit tests on every push |

---

## 🧪 Tests

```bash
node tests/scoring.test.js    # 15 scoring algorithm tests
node tests/detection.test.js  # 18 signal detection tests
```

All tests run automatically on every push via GitHub Actions.

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/shaikhshahnawaz13/devora.git

# Open in browser — no install needed
open devora/index.html
```

No `npm install`. No webpack. No framework. Open `index.html` directly and it works.

---

## 📋 Dashboard Sections

| Section | Description |
|---|---|
| **Overview** | Score ring, dimension scores, pentagon radar, language distribution |
| **AI Insights** | Strengths, weaknesses, recommendations, career readiness score |
| **Progress** | Score history timeline with delta tracking |
| **Roadmap** | 5-step AI or rule-based improvement plan |
| **All Repos** | Every repository with full scores — click any card for deep analysis |
| **Top 6** | Highest-scoring 6 repositories highlighted |

---

## 🔮 Roadmap

- [ ] Side-by-side comparison of two GitHub profiles
- [ ] Exportable PDF score report
- [ ] GitHub organization analysis — score a whole team
- [ ] Weekly email digest of score changes
- [ ] Public opt-in leaderboard

---

## 🤝 Contributing

```bash
git clone https://github.com/shaikhshahnawaz13/devora.git
cd devora

# No build step — edit JS/CSS and refresh the browser
# Run tests before submitting a PR
node tests/scoring.test.js
node tests/detection.test.js
```

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=5e6ad2&height=120&section=footer&animation=fadeIn"/>

**Built by [Shaikh Shahnawaz](https://github.com/shaikhshahnawaz13)**

BSc Information Technology · Akbar Peerbhoy College · University of Mumbai

[![GitHub](https://img.shields.io/badge/GitHub-shaikhshahnawaz13-181717?style=flat-square&logo=github)](https://github.com/shaikhshahnawaz13)
&nbsp;
[![Star this repo](https://img.shields.io/badge/⭐%20Star%20this%20repo-if%20it%20helped%20you-f59e0b?style=flat-square)](https://github.com/shaikhshahnawaz13/devora/stargazers)

</div>
