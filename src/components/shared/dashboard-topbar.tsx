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
    <header className="mb-10 flex w-full items-center justify-between rounded-3xl border border-white/5 glass bg-surface/50 px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-4">
        <h1 className="font-heading text-xl font-bold tracking-tight">Devfolio<span className="text-primary">X</span></h1>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link href={`/${username}`} target="_blank">
          <Button variant="secondary" size="sm" className="hidden sm:inline-flex">View Portfolio</Button>
        </Link>
        <button className="ml-2 flex items-center justify-center h-10 w-10 rounded-full bg-white/5 border border-white/10 text-muted hover:text-primary transition-colors cursor-pointer group" title="Sign Out" onClick={async () => { await signOut({ callbackUrl: "/" }); }}>
           <UserCircle className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
