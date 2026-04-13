import type { Metadata } from "next";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ViewTracker } from "@/components/portfolio/view-tracker";
import { auth } from "@/lib/auth";
import {
  getPortfolioByUserId,
  getPortfolioViews,
  getProjectsByUserId,
  getUserByUsername
} from "@/lib/repositories";

type PortfolioBundle = {
  user: Awaited<ReturnType<typeof getUserByUsername>>;
  portfolio: Awaited<ReturnType<typeof getPortfolioByUserId>>;
  projects: Awaited<ReturnType<typeof getProjectsByUserId>>;
  views: number;
};

async function getPublishedPortfolioBundle(
  username: string
): Promise<PortfolioBundle | null> {
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }

  const portfolio = await getPortfolioByUserId(user.id);
  if (!portfolio || !portfolio.is_published) {
    return null;
  }

  const projects = await getProjectsByUserId(user.id);
  const views = await getPortfolioViews(user.id);

  return {
    user,
    portfolio,
    projects,
    views
  };
}

function getCachedPublishedPortfolio(username: string) {
  const normalized = username.toLowerCase();
  return unstable_cache(
    async () => getPublishedPortfolioBundle(normalized),
    [`published-portfolio:${normalized}`],
    {
      revalidate: 120,
      tags: [`portfolio:${normalized}`]
    }
  )();
}

type PortfolioContentProps = {
  data: PortfolioBundle;
  showUnpublishedBanner?: boolean;
};

function PortfolioContent({
  data,
  showUnpublishedBanner = false
}: PortfolioContentProps) {
  const { user, portfolio, projects, views } = data;
  const links = (user?.links as Record<string, string>) ?? {};
  const skills = (user?.skills as string[]) ?? [];

  return (
    <main className="noise min-h-screen pb-20 pt-10">
      {portfolio?.is_published ? <ViewTracker username={user?.username ?? ""} /> : null}
      <div className="container relative z-10 space-y-8">
        {showUnpublishedBanner ? (
          <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
            This portfolio is not published. You are viewing private preview mode.
          </div>
        ) : null}

        <header className="glass rounded-2xl border border-border p-6 shadow-glow md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary">
                DevfolioX Portfolio
              </p>
              <h1 className="mt-3 text-3xl font-semibold md:text-5xl">{user?.name}</h1>
              <p className="mt-4 max-w-2xl text-sm text-muted md:text-base">
                {user?.bio || "A builder crafting reliable and polished web products."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge>@{user?.username}</Badge>
                {user?.location ? (
                  <Badge className="text-foreground">{user.location}</Badge>
                ) : null}
                {portfolio?.is_published ? (
                  <Badge className="text-foreground">{views} views</Badge>
                ) : (
                  <Badge className="text-foreground">Draft Preview</Badge>
                )}
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <Card>
            <h2 className="text-xl font-semibold">Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.length === 0 ? (
                <p className="text-sm text-muted">
                  Add skills from your dashboard profile section.
                </p>
              ) : (
                skills.map((skill) => <Badge key={skill}>{skill}</Badge>)
              )}
            </div>

            <h3 className="mt-8 text-lg font-semibold">Contact</h3>
            <div className="mt-3 space-y-2 text-sm text-muted">
              {Object.entries(links).length === 0 ? (
                <p>No contact links configured yet.</p>
              ) : (
                Object.entries(links).map(([label, url]) => (
                  <Link
                    key={label}
                    href={url}
                    target="_blank"
                    className="block hover:text-primary"
                  >
                    {label}: {url}
                  </Link>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold">Projects</h2>
            <p className="mt-1 text-sm text-muted">Selected work and experiments.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {projects.length === 0 ? (
                <p className="text-sm text-muted">No projects published yet.</p>
              ) : (
                projects.map((project) => (
                  <article
                    key={project.id}
                    className="rounded-2xl border border-border bg-surface/70 p-4 transition hover:border-primary/50"
                  >
                    <h3 className="text-base font-semibold">{project.title}</h3>
                    <p className="mt-2 text-sm text-muted">
                      {project.description || "No description provided."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {((project.tech_stack ?? []) as string[])
                        .filter((tech) => tech && tech.trim().length > 0)
                        .map((tech: string) => (
                          <Badge key={tech}>{tech}</Badge>
                        ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      {project.github_url ? (
                        <Link href={project.github_url} target="_blank" className="text-primary">
                          GitHub Repo
                        </Link>
                      ) : null}
                      {project.live_url ? (
                        <Link href={project.live_url} target="_blank" className="text-primary">
                          Live Site
                        </Link>
                      ) : null}
                      {!project.github_url && !project.live_url ? (
                        <span className="text-muted">No external links</span>
                      ) : null}
                    </div>
                  </article>
                ))
              )}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

export async function generateMetadata({
  params
}: {
  params: { username: string };
}): Promise<Metadata> {
  const data = await getCachedPublishedPortfolio(params.username);

  if (!data) {
    return {
      title: "Portfolio Not Found",
      description: "This portfolio is private or does not exist."
    };
  }

  return {
    title: `${data.user?.name} | Portfolio`,
    description: data.user?.bio ?? `Developer portfolio of ${data.user?.name}`,
    openGraph: {
      title: `${data.user?.name} | Portfolio`,
      description: data.user?.bio ?? `Developer portfolio of ${data.user?.name}`,
      url: `https://portfolio.tinobritty.me/${data.user?.username}`,
      type: "profile",
      images: data.user?.avatar_url
        ? [
            {
              url: data.user.avatar_url
            }
          ]
        : []
    }
  };
}

export default async function PublicPortfolioPage({
  params,
  searchParams
}: {
  params: { username: string };
  searchParams?: { preview?: string };
}) {
  const username = params.username.toLowerCase();
  const previewRequested = searchParams?.preview === "true";
  const session = await auth();

  const publishedData = await getCachedPublishedPortfolio(username);
  if (publishedData) {
    return <PortfolioContent data={publishedData} />;
  }

  const user = await getUserByUsername(username);
  if (!user) {
    notFound();
  }

  const isOwner = Boolean(
    session?.user?.githubId && user.github_id === session.user.githubId
  );
  if (!isOwner) {
    notFound();
  }

  const portfolio = await getPortfolioByUserId(user.id);
  if (!portfolio) {
    notFound();
  }

  if (!portfolio.is_published && !previewRequested) {
    redirect(`/${user.username}?preview=true`);
  }

  if (!portfolio.is_published && previewRequested && !isOwner) {
    notFound();
  }

  const projects = await getProjectsByUserId(user.id);
  const views = await getPortfolioViews(user.id);

  return (
    <PortfolioContent
      data={{ user, portfolio, projects, views }}
      showUnpublishedBanner={!portfolio.is_published}
    />
  );
}
