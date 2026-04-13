import { NextResponse } from "next/server";

import { sql } from "@/lib/db";

type PublishedPortfolioRow = {
  username: string;
  updated_at: string;
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://portfolio.tinobritty.me";

export async function GET() {
  const staticUrls = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: "1.0"
    }
  ];

  let publishedUrls: Array<{
    url: string;
    lastModified: string;
    changeFrequency: string;
    priority: string;
  }> = [];

  try {
    const rows = await sql<PublishedPortfolioRow>`
      select users.username, portfolios.updated_at
      from portfolios
      inner join users on users.id = portfolios.user_id
      where portfolios.is_published = true
      order by portfolios.updated_at desc
    `;

    publishedUrls = rows.map((row) => ({
      url: `${siteUrl}/${row.username}`,
      lastModified: new Date(row.updated_at).toISOString(),
      changeFrequency: "weekly",
      priority: "0.8"
    }));
  } catch {
    publishedUrls = [];
  }

  const allUrls = [...staticUrls, ...publishedUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls
    .map(
      (entry) =>
        `  <url>\n    <loc>${entry.url}</loc>\n    <lastmod>${entry.lastModified}</lastmod>\n    <changefreq>${entry.changeFrequency}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`
    )
    .join("\n")}\n</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
