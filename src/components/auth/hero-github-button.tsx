"use client";

import { Loader2, Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function HeroGitHubButton() {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await signIn("github", { callbackUrl: "/dashboard" });
      }}
      disabled={loading}
      className="group relative flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-zinc-200/50 bg-[#111111] px-8 text-base font-bold text-white transition-all hover:bg-black hover:scale-105 active:scale-95 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 dark:border-white/10 shadow-xl disabled:opacity-50 disabled:pointer-events-none"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Github className="h-5 w-5 transition-transform group-hover:scale-110" />
      )}
      Continue with GitHub
    </button>
  );
}
