import type { MetadataRoute } from "next";

import { sql } from "@/lib/db";

type PublishedPortfolioRow = {
  username: string;
  updated_at: string;
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://portfolio.tinobritty.me";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    }
  ];

  try {
    const rows = await sql<PublishedPortfolioRow>`
      select users.username, portfolios.updated_at
      from portfolios
      inner join users on users.id = portfolios.user_id
      where portfolios.is_published = true
      order by portfolios.updated_at desc
    `;

    const portfolioRoutes: MetadataRoute.Sitemap = rows.map((row) => ({
      url: `${siteUrl}/${row.username}`,
      lastModified: new Date(row.updated_at),
      changeFrequency: "weekly",
      priority: 0.8
    }));

    return [...staticRoutes, ...portfolioRoutes];
  } catch {
    return staticRoutes;
  }
}
