import Link from "next/link";

import { auth } from "@/lib/auth";
import { GitHubSignInButton } from "@/components/auth/github-signin-button";
import { MotionFade } from "@/components/shared/motion-fade";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="noise min-h-screen px-4 py-20">
      <div className="container relative z-10">
        <MotionFade className="mx-auto max-w-4xl text-center" delay={0.05}>
          <Badge>DevfolioX</Badge>
          <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-6xl">
            Build your own portfolio.
            <span className="block text-primary">Ship it in minutes.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted md:text-lg">
            A multi-user portfolio generator for students and developers. Sign in with
            GitHub, edit your profile, import repos, and publish to your own public route.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <GitHubSignInButton />
            )}
          </div>
        </MotionFade>

        <MotionFade delay={0.15} className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            {
              title: "GitHub Native",
              description: "OAuth only flow. Pull repositories with one click."
            },
            {
              title: "Theme Engine",
              description: "Midnight Inferno by default, with light and dark support."
            },
            {
              title: "Publish Workflow",
              description: "Toggle visibility and instantly expose /[username]."
            }
          ].map((item) => (
            <Card key={item.title}>
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            </Card>
          ))}
        </MotionFade>
      </div>
    </main>
  );
}
