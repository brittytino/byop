import Link from "next/link";

import { auth } from "@/lib/auth";
import { GitHubSignInButton } from "@/components/auth/github-signin-button";
import { MotionFade } from "@/components/shared/motion-fade";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="noise min-h-screen px-4 py-20 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute left-1/2 top-40 -z-10 h-[40rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="container relative z-10 pt-16 md:pt-32">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <MotionFade delay={0.1}>
            <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-surface/50 px-3 py-1 text-sm font-medium text-muted backdrop-blur-md">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,46,46,0.8)]" />
              Built for students & developers
            </div>
          </MotionFade>

          <div className="flex flex-col gap-2 md:gap-4">
            <MotionFade delay={0.2}>
              <h1 className="font-heading text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-[5.5rem] leading-[1.1]">
                Build your portfolio.
              </h1>
            </MotionFade>
            <MotionFade delay={0.3}>
              <h1 className="font-heading text-5xl font-bold tracking-tight text-primary drop-shadow-[0_0_35px_rgba(255,46,46,0.3)] md:text-7xl lg:text-[5.5rem] leading-[1.1]">
                Ship it in minutes.
              </h1>
            </MotionFade>
          </div>

          <MotionFade delay={0.4}>
            <p className="mx-auto mt-8 max-w-2xl text-base text-muted md:text-xl font-medium leading-relaxed">
              A multi-user portfolio generator for students and developers. Sign in with
              GitHub, edit your profile, import repos, and instantly publish anywhere.
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
