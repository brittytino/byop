import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { PublicPortfolioTemplate } from "@/components/portfolio/public-portfolio-template";
import { ViewTracker } from "@/components/portfolio/view-tracker";
import { auth } from "@/lib/auth";
import {
  getPortfolioByUserId,
  getPortfolioViews,
  getProjectsByUserId,
  getUserByUsername
} from "@/lib/repositories";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://portfolio.tinobritty.me";

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
  return (
    <>
      {data.portfolio?.is_published ? (
        <ViewTracker username={data.user?.username ?? ""} />
      ) : null}
      <PublicPortfolioTemplate
        data={data}
        showUnpublishedBanner={showUnpublishedBanner}
        siteUrl={siteUrl}
      />
    </>
  );
}

export async function generateMetadata({
  params
}: {
  params: { username: string };
}): Promise<Metadata> {
  const normalized = params.username.toLowerCase();
  const data = await getCachedPublishedPortfolio(normalized);

  if (!data) {
    const user = await getUserByUsername(normalized);
    const portfolio = user ? await getPortfolioByUserId(user.id) : null;

    if (user && portfolio && !portfolio.is_published) {
      return {
        title: `${user.name} | Portfolio Preview`,
        description: `Private preview for ${user.name}'s developer portfolio.`,
        robots: {
          index: false,
          follow: false
        }
      };
    }

    return {
      title: "Portfolio Not Found",
      description: "This portfolio is private or does not exist.",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const canonicalPath = `/${data.user?.username}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const title = `${data.user?.name} | BYOP Portfolio`;
  const description =
    data.user?.bio ?? `Developer portfolio of ${data.user?.name} built with BYOP.`;

  return {
    title,
    description,
    keywords: [
      `${data.user?.name} portfolio`,
      `${data.user?.username} developer`,
      "developer portfolio",
      "published portfolio"
    ],
    alternates: {
      canonical: canonicalPath
    },
    robots: {
      index: true,
      follow: true
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "profile",
      images: data.user?.avatar_url
        ? [
            {
              url: data.user.avatar_url
            }
          ]
        : []
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: data.user?.avatar_url ? [data.user.avatar_url] : []
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
