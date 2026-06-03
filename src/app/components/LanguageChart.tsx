"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#6366f1",
  "#22d3ee",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#a78bfa",
  "#f472b6",
  "#38bdf8",
  "#4ade80",
  "#fb923c",
];

export default function LanguageChart({
  languages,
}: {
  languages: { name: string; value: number }[];
}) {
  const data = languages.slice(0, 8);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text-dim)]">
        No language data available.
      </p>
    );
  }

  return (
    <div className="grid items-center gap-4 sm:grid-cols-[180px_1fr]">
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1a2234",
                border: "1px solid #232c42",
                borderRadius: 10,
                color: "#e9edf6",
                fontSize: 12,
              }}
              formatter={(v) => [`${v} repos`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-col gap-2">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 shrink-0 rounded-[3px]"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="flex-1 text-[var(--text)]">{d.name}</span>
            <span className="mono text-[var(--text-dim)]">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
