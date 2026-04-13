"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import { UserCircle } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

type DashboardTopbarProps = {
  username: string;
};

export function DashboardTopbar({ username }: DashboardTopbarProps) {
  return (
    <header className="mb-10 flex w-full items-center justify-between rounded-3xl border border-border glass bg-surface/75 px-6 py-4 shadow-[0_4px_20px_rgba(2,6,23,0.10)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-4">
        <h1 className="font-heading text-xl font-bold tracking-tight">BYOP<span className="text-primary">.</span></h1>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link href={`/${username}`} target="_blank">
          <Button variant="secondary" size="sm" className="hidden sm:inline-flex">View Portfolio</Button>
        </Link>
        <button className="ml-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-primary" title="Sign Out" onClick={async () => { await signOut({ callbackUrl: "/" }); }}>
           <UserCircle className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
