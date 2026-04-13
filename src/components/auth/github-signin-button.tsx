"use client";

import { Loader2, Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function GitHubSignInButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="secondary"
      size="lg"
      className="gap-2 px-8 py-6 text-base shadow-[0_4px_14px_0_rgba(0,0,0,0.39)]"
      onClick={async () => {
        setLoading(true);
        await signIn("github", { callbackUrl: "/dashboard" });
      }}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Github className="h-5 w-5" />}
      Continue with GitHub
    </Button>
  );
}
