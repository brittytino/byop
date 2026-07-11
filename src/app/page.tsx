import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { HeroContent } from "@/components/portfolio/hero-content";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://portfolio.tinobritty.me";

export const metadata: Metadata = {
  title: "Free Portfolio Generator for Developers",
  description:
    "BYOP helps you generate a free portfolio from GitHub and publish your portfolio in minutes.",
  alternates: {
    canonical: "/"
  }
};

export default async function HomePage() {
  const session = await auth();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BYOP",
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    description:
      "Generate a free developer portfolio from GitHub and publish it instantly.",
    url: siteUrl
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroContent session={session} />
    </>
  );
}
