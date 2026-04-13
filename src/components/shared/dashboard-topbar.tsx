"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

import { Loader2, LogOut, UserCircle } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

type DashboardTopbarProps = {
  username: string;
  displayName: string;
  avatarUrl: string;
};

export function DashboardTopbar({
  username,
  displayName,
  avatarUrl
}: DashboardTopbarProps) {
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const initials = useMemo(() => {
    const source = displayName || username;
    return source
      .split(" ")
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [displayName, username]);

  async function handleSignOut() {
    setLoggingOut(true);
    await signOut({ callbackUrl: "/" });
  }

  return (
    <>
      <header className="mb-10 flex w-full items-center justify-between rounded-3xl border border-border glass bg-surface/75 px-6 py-4 shadow-[0_4px_20px_rgba(2,6,23,0.10)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-4">
        <h1 className="font-heading text-xl font-bold tracking-tight">
          BYOP<span className="text-primary">.</span>
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link href={`/${username}`} target="_blank">
          <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
            View Portfolio
          </Button>
        </Link>
        <button
          className="ml-2 inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface/90 pl-1 pr-3 text-sm text-foreground transition-colors hover:border-primary/40"
          title="Open profile menu"
          onClick={() => setConfirmLogoutOpen(true)}
        >
          <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-border bg-foreground/5">
            {avatarUrl && !avatarFailed ? (
              <Image
                src={avatarUrl}
                alt={`${displayName} GitHub profile`}
                width={32}
                height={32}
                className="h-full w-full object-cover"
                onError={() => setAvatarFailed(true)}
              />
            ) : initials ? (
              <span className="text-xs font-semibold text-foreground">{initials}</span>
            ) : (
              <UserCircle className="h-4 w-4" />
            )}
          </span>
          <span className="hidden max-w-[10rem] truncate sm:block">{displayName}</span>
        </button>
      </div>
      </header>

      {confirmLogoutOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-in fade-in duration-200">
          <div className="glass w-full max-w-md rounded-2xl border border-border p-6 shadow-glow animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold">Sign out of BYOP?</h3>
            <p className="mt-2 text-sm text-muted">
              You can sign in again anytime with your GitHub account.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setConfirmLogoutOpen(false)}
                disabled={loggingOut}
              >
                Cancel
              </Button>
              <Button onClick={handleSignOut} disabled={loggingOut}>
                {loggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                Logout
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
