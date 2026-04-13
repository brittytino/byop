"use client";

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function GitHubSignInButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      size="lg"
      onClick={async () => {
        setLoading(true);
        await signIn("github", { callbackUrl: "/dashboard" });
      }}
      disabled={loading}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Continue with GitHub
    </Button>
  );
}
