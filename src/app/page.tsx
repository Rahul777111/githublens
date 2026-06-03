"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MagnifyingGlass,
  Star,
  GitFork,
  Users,
  BookmarkSimple,
  MapPin,
  Buildings,
  LinkSimple,
  Warning,
  CircleNotch,
  ArrowUpRight,
  Translate,
  CalendarBlank,
  GithubLogo,
} from "@phosphor-icons/react";
import LanguageChart from "./components/LanguageChart";
import type { Analysis } from "./components/types";

const EXAMPLES = ["torvalds", "gaearon", "sindresorhus", "Rahul777111"];

export default function Home() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = useCallback(async (username: string) => {
    const u = username.trim().replace(/^@/, "");
    if (!u) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/analyze?u=${encodeURIComponent(u)}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong.");
        setData(null);
      } else {
        setData(json);
      }
    } catch {
      setError("Network error. Please try again.");
      setData(null);
    }
    setLoading(false);
  }, []);

  return (
    <div className="min-h-[100dvh]">
      {/* nav */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[rgba(11,15,26,0.8)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent)] text-white">
              <MagnifyingGlass size={17} weight="bold" />
            </span>
            <span className="text-lg font-semibold tracking-tight">GitHubLens</span>
          </div>
          <a
            href="https://github.com/Rahul777111"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-[var(--text-dim)] transition hover:text-[var(--text)]"
          >
            <GithubLogo size={18} weight="fill" /> Rahul777111
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 py-10">
        {/* hero + search */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Analyze any GitHub profile.
          </h1>
          <p className="mt-2 text-[var(--text-dim)]">
            Stars, languages, top repositories, and a developer score in one view.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              analyze(input);
            }}
            className="mt-6 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 focus-within:border-[var(--accent)]"
          >
            <span className="pl-2 text-[var(--text-dim)]">
              <MagnifyingGlass size={18} />
            </span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a GitHub username"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-dim)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 active:scale-[0.97] disabled:opacity-60"
            >
              {loading ? <CircleNotch size={15} className="animate-spin" /> : "Analyze"}
            </button>
          </form>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--text-dim)]">
            Try:
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setInput(ex);
                  analyze(ex);
                }}
                className="rounded-md border border-[var(--border)] px-2 py-1 transition hover:border-[var(--accent)] hover:text-[var(--text)]"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--bad)]"
            >
              <Warning size={18} weight="fill" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* results */}
        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              key={data.user.login}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-10 flex flex-col gap-5"
            >
              {/* profile header */}
              <div className="flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:flex-row sm:items-center">
                <img
                  src={data.user.avatar}
                  alt={data.user.login}
                  className="h-24 w-24 rounded-2xl border border-[var(--border)]"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {data.user.name || data.user.login}
                    </h2>
                    <a
                      href={data.user.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mono text-sm text-[var(--accent-2)] hover:underline"
                    >
                      @{data.user.login}
                    </a>
                  </div>
                  {data.user.bio && (
                    <p className="mt-1.5 text-sm text-[var(--text-dim)]">{data.user.bio}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[var(--text-dim)]">
                    {data.user.company && (
                      <span className="flex items-center gap-1">
                        <Buildings size={13} /> {data.user.company}
                      </span>
                    )}
                    {data.user.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} /> {data.user.location}
                      </span>
                    )}
                    {data.user.blog && (
                      <a
                        href={data.user.blog.startsWith("http") ? data.user.blog : `https://${data.user.blog}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-[var(--text)]"
                      >
                        <LinkSimple size={13} /> {data.user.blog}
                      </a>
                    )}
                    <span className="flex items-center gap-1">
                      <CalendarBlank size={13} /> Joined{" "}
                      {new Date(data.user.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>

                {/* score gauge */}
                <ScoreGauge score={data.stats.score} />
              </div>

              {/* stat tiles */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <Stat icon={Star} label="Total stars" value={data.stats.totalStars} color="#fbbf24" />
                <Stat icon={GitFork} label="Total forks" value={data.stats.totalForks} color="#22d3ee" />
                <Stat icon={BookmarkSimple} label="Repos" value={data.stats.ownRepos} color="#6366f1" />
                <Stat icon={Users} label="Followers" value={data.user.followers} color="#34d399" />
                <Stat icon={Users} label="Following" value={data.user.following} color="#a78bfa" />
                <Stat icon={Translate} label="Languages" value={data.stats.languageCount} color="#fb7185" />
              </div>

              {/* languages + most starred */}
              <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    Language breakdown
                  </h3>
                  <LanguageChart languages={data.languages} />
                </div>
                <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    Highlights
                  </h3>
                  <Highlight label="Developer score" value={`${data.stats.score} / 100`} />
                  <Highlight label="Account age" value={`${data.stats.accountYears} yrs`} />
                  {data.stats.mostStarred && (
                    <a
                      href={data.stats.mostStarred.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-[var(--elevated)] p-3 transition hover:bg-[var(--border)]"
                    >
                      <div className="text-xs text-[var(--text-dim)]">Most starred</div>
                      <div className="mt-0.5 flex items-center justify-between">
                        <span className="mono text-sm text-[var(--text)]">
                          {data.stats.mostStarred.name}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-[var(--warn)]">
                          <Star size={14} weight="fill" /> {data.stats.mostStarred.stars}
                        </span>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* top repos */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                  Top repositories
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.topRepos.map((r, i) => (
                    <motion.a
                      key={r.name}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="group flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent)]/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="mono text-sm font-medium text-[var(--text)]">{r.name}</span>
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-[var(--text-dim)] transition group-hover:text-[var(--accent)]"
                        />
                      </div>
                      <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--text-dim)]">
                        {r.description || "No description."}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-dim)]">
                        {r.language && (
                          <span className="flex items-center gap-1">
                            <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                            {r.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star size={12} weight="fill" /> {r.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork size={12} /> {r.forks}
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!data && !loading && !error && (
          <div className="mt-16 text-center text-sm text-[var(--text-faint)] text-[var(--text-dim)]">
            Search a username above to begin.
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-[var(--text-dim)]">
          <span>Built by D L Narayana</span>
          <span className="mono text-xs">Next.js · GitHub REST API · Recharts</span>
        </div>
      </footer>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <Icon size={18} style={{ color }} weight="fill" />
      <div className="mono mt-2 text-xl font-semibold">{value.toLocaleString()}</div>
      <div className="text-xs text-[var(--text-dim)]">{label}</div>
    </div>
  );
}

function Highlight({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[var(--elevated)] px-3 py-2.5">
      <span className="text-xs text-[var(--text-dim)]">{label}</span>
      <span className="mono text-sm font-medium">{value}</span>
    </div>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const color = score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#fb7185";
  return (
    <div className="relative grid h-24 w-24 shrink-0 place-items-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="var(--elevated)" strokeWidth="8" />
        <motion.circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="mono text-xl font-bold">{score}</span>
        <span className="text-[10px] text-[var(--text-dim)]">score</span>
      </div>
    </div>
  );
}
