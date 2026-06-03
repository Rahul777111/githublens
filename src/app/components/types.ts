export type Analysis = {
  user: {
    login: string;
    name: string | null;
    avatar: string;
    bio: string | null;
    company: string | null;
    location: string | null;
    blog: string | null;
    followers: number;
    following: number;
    publicRepos: number;
    createdAt: string;
    url: string;
  };
  stats: {
    totalStars: number;
    totalForks: number;
    ownRepos: number;
    languageCount: number;
    accountYears: number;
    score: number;
    mostStarred: { name: string; stars: number; url: string } | null;
  };
  languages: { name: string; value: number }[];
  topRepos: {
    name: string;
    url: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    issues: number;
    updated: string;
    topics: string[];
    archived: boolean;
  }[];
};
