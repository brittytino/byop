type GitHubRepoCacheEntry = {
  data: GitHubRepo[];
  expiresAt: number;
};

type GitHubCacheGlobal = typeof globalThis & {
  __devfolioxGitHubRepoCache?: Map<string, GitHubRepoCacheEntry>;
};

const GITHUB_REPO_CACHE_TTL_MS = 60_000;

export type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
};

function getRepoCache() {
  const globalCache = globalThis as GitHubCacheGlobal;
  if (!globalCache.__devfolioxGitHubRepoCache) {
    globalCache.__devfolioxGitHubRepoCache = new Map();
  }

  return globalCache.__devfolioxGitHubRepoCache;
}

export async function getGitHubRepos(accessToken: string): Promise<GitHubRepo[]> {
  if (!accessToken) {
    throw new Error("Missing GitHub access token");
  }

  const cache = getRepoCache();
  const now = Date.now();

  for (const [key, value] of cache.entries()) {
    if (value.expiresAt <= now) {
      cache.delete(key);
    }
  }

  const cached = cache.get(accessToken);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`GitHub repo fetch failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Array<{
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    stargazers_count: number;
  }>;

  const repos: GitHubRepo[] = payload.map((repo) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    html_url: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    stargazers_count: repo.stargazers_count
  }));

  cache.set(accessToken, {
    data: repos,
    expiresAt: now + GITHUB_REPO_CACHE_TTL_MS
  });

  return repos;
}