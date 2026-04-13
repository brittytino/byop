import type { Metadata } from "next";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { MotionFade } from "@/components/shared/motion-fade";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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

  const themeClass =
    portfolio?.theme && portfolio.theme !== "midnight-inferno"
      ? `theme-${portfolio.theme}`
      : "";

  return (
    <main className={cn("noise min-h-screen pb-20 pt-10 overflow-hidden", themeClass)}>
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -z-10 h-[30rem] w-[30rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      {portfolio?.is_published ? <ViewTracker username={user?.username ?? ""} /> : null}
      <div className="container relative z-10 space-y-8 max-w-6xl mx-auto">
        {showUnpublishedBanner ? (
          <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-200">
            This portfolio is not published. You are viewing private preview mode.
          </div>
        ) : null}

        <MotionFade delay={0.1}>
          <header className="glass rounded-3xl border border-border bg-surface/60 p-8 shadow-lg dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] md:p-12">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-heading text-xs uppercase tracking-[0.2em] text-primary font-bold">
                  DevfolioX Portfolio
                </p>
                <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight md:text-6xl text-foreground">
                  {user?.name}
                </h1>
                <p className="mt-5 max-w-2xl text-base text-muted md:text-lg font-medium leading-relaxed">
                  {user?.bio || "A builder crafting reliable and polished web products."}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-foreground/5 hover:bg-foreground/10 transition-colors">@{user?.username}</Badge>
                  {user?.location ? (
                    <Badge variant="secondary" className="bg-foreground/5 hover:bg-foreground/10 transition-colors">{user.location}</Badge>
                  ) : null}
                  {portfolio?.is_published ? (
                    <Badge variant="secondary" className="bg-primary/20 text-primary border border-primary/20">{views} views</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/20">Draft Preview</Badge>
                  )}
                </div>
              </div>
              <ThemeToggle />
            </div>
          </header>
        </MotionFade>

        <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <MotionFade delay={0.2}>
            <Card className="h-full">
              <h2 className="font-heading text-2xl font-bold tracking-tight">Skills</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {skills.length === 0 ? (
                  <p className="text-sm text-muted">
                    Add skills from your dashboard profile section.
                  </p>
                ) : (
                  skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-foreground/5 hover:bg-foreground/10 transition-colors">
                      {skill}
                    </Badge>
                  ))
                )}
              </div>

              <h3 className="mt-10 font-heading text-xl font-bold tracking-tight">Contact</h3>
              <div className="mt-4 space-y-3 text-sm text-muted">
                {Object.entries(links).length === 0 ? (
                  <p>No contact links configured yet.</p>
                ) : (
                  Object.entries(links).map(([label, url]) => (
                    <Link
                      key={label}
                      href={url}
                      target="_blank"
                      className="block hover:text-foreground transition-colors"
                    >
                      {label}: <span className="text-primary hover:underline">{url}</span>
                    </Link>
                  ))
                )}
              </div>
            </Card>
          </MotionFade>

          <MotionFade delay={0.3}>
            <Card className="h-full">
              <h2 className="font-heading text-2xl font-bold tracking-tight">Projects</h2>
              <p className="mt-2 text-sm text-muted">Selected work and experiments.</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {projects.length === 0 ? (
                  <p className="text-sm text-muted">No projects published yet.</p>
                ) : (
                  projects.map((project) => (
                    <article
                      key={project.id}
                      className="group rounded-2xl border border-border bg-surface/50 p-5 transition-all duration-300 hover:scale-[1.02] hover:border-foreground/10 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                    >
                      <h3 className="font-heading text-lg font-bold tracking-tight group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="mt-2 text-sm text-muted leading-relaxed">
                        {project.description || "No description provided."}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {((project.tech_stack ?? []) as string[])
                          .filter((tech) => tech && tech.trim().length > 0)
                          .map((tech: string) => (
                            <Badge key={tech} variant="outline" className="border-border bg-foreground/5 text-xs">
                              {tech}
                            </Badge>
                          ))}
                      </div>
                      <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium">
                        {project.github_url ? (
                          <Link href={project.github_url} target="_blank" className="text-primary hover:text-primary/80 transition-colors">
                            GitHub Repo
                          </Link>
                        ) : null}
                        {project.live_url ? (
                          <Link href={project.live_url} target="_blank" className="text-primary hover:text-primary/80 transition-colors">
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
          </MotionFade>
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
