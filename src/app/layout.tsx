import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHubLens — Profile & Repo Analyzer",
  description:
    "Analyze any GitHub profile: stats, language breakdown, top repositories, and a developer score. Built by D L Narayana.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
