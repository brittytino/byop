"use client";

import { Check, Loader2, Star } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { importGitHubRepoAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
};

type RepoImporterProps = {
  importedGithubUrls: string[];
};

const CLIENT_REPO_CACHE_TTL_MS = 45_000;
const REPOS_PER_PAGE = 10;

let cachedRepos: Repo[] | null = null;
let cachedReposAt = 0;

export function RepoImporter({ importedGithubUrls }: RepoImporterProps) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [importedSet, setImportedSet] = useState<Set<string>>(
    () => new Set(importedGithubUrls)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeRepoId, setActiveRepoId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setImportedSet(new Set(importedGithubUrls));
  }, [importedGithubUrls]);

  useEffect(() => {
    async function load() {
      const now = Date.now();
      if (cachedRepos && now - cachedReposAt < CLIENT_REPO_CACHE_TTL_MS) {
        setRepos(cachedRepos);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/github/repos", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load repositories");
      }

      const data = await response.json();
      const parsedRepos = Array.isArray(data.repos) ? data.repos : [];
      cachedRepos = parsedRepos;
      cachedReposAt = now;

      setRepos(parsedRepos);
      setLoading(false);
    }

    load().catch(() => {
      setLoading(false);
      setLoadError("Could not load GitHub repositories.");
    });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const importedCount = useMemo(
    () => repos.filter((repo) => importedSet.has(repo.html_url)).length,
    [repos, importedSet]
  );

  const filteredRepos = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return repos;
    }

    return repos.filter((repo) => {
      const haystack = [repo.name, repo.description ?? "", repo.language ?? ""]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [repos, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRepos.length / REPOS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRepos = useMemo(() => {
    const start = (currentPage - 1) * REPOS_PER_PAGE;
    return filteredRepos.slice(start, start + REPOS_PER_PAGE);
  }, [currentPage, filteredRepos]);

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Import from GitHub</h3>
          <p className="text-sm text-muted">
            Preview repositories and import them into your portfolio projects.
          </p>
        </div>
        <p className="text-sm text-muted">
          Imported: {importedCount} / {repos.length}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search repos by name, description, or language"
          aria-label="Search GitHub repositories"
        />
        <p className="text-sm text-muted">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {loadError ? <p className="text-sm text-muted">{loadError}</p> : null}

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-border bg-surface/70 p-4"
            >
              <div className="h-4 w-1/2 rounded bg-surface" />
              <div className="mt-3 h-3 w-full rounded bg-surface" />
              <div className="mt-2 h-3 w-2/3 rounded bg-surface" />
              <div className="mt-4 h-9 w-24 rounded-2xl bg-surface" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {repos.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface/70 p-5 text-sm text-muted md:col-span-2">
              No repositories found on your GitHub account.
            </div>
          ) : null}

          {repos.length > 0 && filteredRepos.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface/70 p-5 text-sm text-muted md:col-span-2">
              No repositories match your search.
            </div>
          ) : null}

          {paginatedRepos.map((repo) => {
            const isImported = importedSet.has(repo.html_url);
            const isActive = pending && activeRepoId === repo.id;

            return (
              <article
                key={repo.id}
                className={`group rounded-2xl border bg-surface/70 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-primary/50 ${
                  isImported ? "border-primary/50" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{repo.name}</p>
                  {isImported ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/50 bg-primary/10 px-2 py-1 text-xs text-primary">
                      <Check className="h-3 w-3" />
                      Imported
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {repo.description || "No description"}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs text-muted">
                    <Star className="h-3 w-3" />
                    {repo.stargazers_count}
                  </span>
                  {repo.language ? (
                    <span className="rounded-full border border-border px-2 py-1 text-xs text-muted">
                      {repo.language}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={isImported || isActive}
                    onClick={() => {
                      setActiveRepoId(repo.id);
                      startTransition(async () => {
                        const result = await importGitHubRepoAction(repo.id);

                        if (result.ok) {
                          setImportedSet((current) => {
                            const next = new Set(current);
                            next.add(repo.html_url);
                            return next;
                          });
                          toast.success(result.message);
                        } else {
                          toast.error(result.message);
                        }

                        setActiveRepoId(null);
                      });
                    }}
                  >
                    {isActive ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isImported ? "Imported" : "Import"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {filteredRepos.length > REPOS_PER_PAGE ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="pt-2"
        />
      ) : null}
    </Card>
  );
}
