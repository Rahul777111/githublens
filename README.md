# GitHubLens — Profile & Repo Analyzer

**Live demo: [githublens-kappa.vercel.app](https://githublens-kappa.vercel.app)**

Analyze any GitHub profile in one view: total stars and forks, language breakdown, top repositories, account age, and a computed developer score. Powered by the live GitHub REST API through a serverless route.

![Tech](https://img.shields.io/badge/Next.js-16-6366f1) ![Tech](https://img.shields.io/badge/GitHub%20API-live-black) ![Tech](https://img.shields.io/badge/Recharts-charts-22d3ee)

## Features

- **Live analysis** — enter any username and fetch their profile and repositories in real time.
- **Developer score** — a 0-100 gauge derived from stars, followers, repo count, language diversity, and account age.
- **Language breakdown** — a donut chart of the languages across their non-forked repos.
- **Top repositories** — the most-starred repos with language, stars, forks, and quick links.
- **Stat tiles** — total stars, forks, repos, followers, following, and languages.
- Graceful handling of rate limits, missing users, and network errors.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · GitHub REST API · Recharts · Motion · Phosphor Icons

## Getting started

```bash
npm install
npm run dev
npm run build && npm start
```

Optional: set `GITHUB_TOKEN` in your environment to raise the GitHub API rate limit.

## Author

**D L Narayana** — [GitHub](https://github.com/Rahul777111)
