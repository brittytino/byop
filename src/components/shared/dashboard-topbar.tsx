"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

type DashboardTopbarProps = {
  username: string;
};

export function DashboardTopbar({ username }: DashboardTopbarProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">DevfolioX</p>
        <h1 className="text-2xl font-semibold">Build your live portfolio</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link href={`/${username}`} target="_blank">
          <Button variant="secondary">View Portfolio</Button>
        </Link>
        <Button
          variant="ghost"
          onClick={async () => {
            await signOut({ callbackUrl: "/" });
          }}
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
}
