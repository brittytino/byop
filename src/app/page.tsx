import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { GitHubSignInButton } from "@/components/auth/github-signin-button";
import { MotionFade } from "@/components/shared/motion-fade";
import { Button } from "@/components/ui/button";

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
    <main className="noise min-h-screen px-4 py-20 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Background radial glow */}
      <div className="absolute left-1/2 top-40 -z-10 h-[40rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="container relative z-10 pt-16 md:pt-32">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <MotionFade delay={0.1}>
            <div className="mb-8 inline-flex items-center rounded-full border border-border bg-surface/50 px-3 py-1 text-sm font-medium text-muted backdrop-blur-md">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-primary shadow-glow" />
              Free Portfolio Generator for Developers
            </div>
          </MotionFade>

          <div className="flex flex-col gap-2 md:gap-4">
            <MotionFade delay={0.2}>
              <h1 className="font-heading text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-[5.5rem] leading-[1.1]">
                Generate your portfolio.
                <span className="block text-primary">Publish it for free.</span>
              </h1>
            </MotionFade>
          </div>

          <MotionFade delay={0.4}>
            <p className="mx-auto mt-8 max-w-2xl text-base text-muted md:text-xl font-medium leading-relaxed">
              BYOP is a free portfolio generator for students and developers. Import
              GitHub projects, customize your theme, and publish your portfolio with a
              shareable public link in minutes.
            </p>
          </MotionFade>

          <MotionFade delay={0.5} className="mt-10">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="px-8 py-6 text-base tracking-wide h-14">Go to Dashboard</Button>
              </Link>
            ) : (
              <GitHubSignInButton />
            )}
          </MotionFade>
        </div>
      </div>
    </main>
  );
}
