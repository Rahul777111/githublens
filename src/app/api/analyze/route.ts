import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type GHUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  html_url: string;
};

type GHRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  size: number;
  fork: boolean;
  archived: boolean;
  updated_at: string;
  pushed_at: string;
  topics?: string[];
};

function ghHeaders(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "GitHubLens",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = (searchParams.get("u") || "").trim();
  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  // user
  const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers: ghHeaders(),
  });
  if (userRes.status === 404) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (userRes.status === 403) {
    return NextResponse.json(
      { error: "GitHub rate limit reached. Try again in a minute." },
      { status: 429 }
    );
  }
  if (!userRes.ok) {
    return NextResponse.json({ error: "GitHub request failed" }, { status: 502 });
  }
  const user = (await userRes.json()) as GHUser;

  // repos (up to 100, most recently pushed)
  const reposRes = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`,
    { headers: ghHeaders() }
  );
  const repos = (reposRes.ok ? ((await reposRes.json()) as GHRepo[]) : []).filter(
    (r) => !r.fork
  );

  // aggregate
  let totalStars = 0;
  let totalForks = 0;
  const langCount: Record<string, number> = {};
  for (const r of repos) {
    totalStars += r.stargazers_count;
    totalForks += r.forks_count;
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  }

  const languages = Object.entries(langCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 12)
    .map((r) => ({
      name: r.name,
      url: r.html_url,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      issues: r.open_issues_count,
      updated: r.pushed_at,
      topics: r.topics || [],
      archived: r.archived,
    }));

  // simple developer score (0-100)
  const accountYears =
    (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365);
  const score = Math.min(
    100,
    Math.round(
      Math.log10(totalStars + 1) * 16 +
        Math.log10(user.followers + 1) * 14 +
        Math.min(repos.length, 40) * 0.8 +
        Math.min(languages.length, 12) * 1.5 +
        Math.min(accountYears, 10) * 2
    )
  );

  const mostStarred = topRepos[0];

  return NextResponse.json(
    {
      user: {
        login: user.login,
        name: user.name,
        avatar: user.avatar_url,
        bio: user.bio,
        company: user.company,
        location: user.location,
        blog: user.blog,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        createdAt: user.created_at,
        url: user.html_url,
      },
      stats: {
        totalStars,
        totalForks,
        ownRepos: repos.length,
        languageCount: languages.length,
        accountYears: Math.round(accountYears * 10) / 10,
        score,
        mostStarred: mostStarred
          ? { name: mostStarred.name, stars: mostStarred.stars, url: mostStarred.url }
          : null,
      },
      languages,
      topRepos,
    },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
