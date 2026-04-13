import { NextResponse } from "next/server";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://portfolio.tinobritty.me";

export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /api/",
    "Disallow: /auth/error",
    `Sitemap: ${siteUrl}/sitemap.xml`
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
