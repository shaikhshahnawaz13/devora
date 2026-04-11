# Devora — Manual Test Checklist

## Landing Page
- [ ] Loads correctly in light and dark mode
- [ ] Theme toggle switches between modes smoothly
- [ ] Username input accepts valid GitHub usernames
- [ ] Invalid username shows error
- [ ] Settings modal opens and closes
- [ ] Settings save correctly to localStorage
- [ ] Token saved status shows green checkmark after first entry

## Analysis
- [ ] Analysis runs with a valid username
- [ ] Loading screen shows step updates
- [ ] API call count shows remaining requests
- [ ] Dashboard renders with all sections

## Dashboard Tabs
- [ ] Overview tab shows repo cards, charts, suggestions
- [ ] AI Insights tab shows setup prompt without Groq key
- [ ] AI Insights tab fetches insights with Groq key
- [ ] Progress tab shows Supabase setup prompt without config
- [ ] Roadmap tab shows rule-based roadmap
- [ ] Roadmap tab enhances with AI when Groq key present

## Scoring
- [ ] Reputation score reflects stars/followers
- [ ] Activity score reflects recent commits
- [ ] Depth score increases with technical signals
- [ ] Diversity score reflects language count
- [ ] Prestige ceiling prevents 100 for basic portfolios

## Edge Cases
- [ ] Works with 0 repositories
- [ ] Works with 1 repository
- [ ] Works with only forked repositories
- [ ] Handles GitHub API rate limit gracefully
- [ ] Handles invalid username gracefully
- [ ] Works without Groq key
- [ ] Works without Supabase config
