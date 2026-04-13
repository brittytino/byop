import Link from "next/link";

import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getUserByGithubId } from "@/lib/repositories";

export default async function ResumePage() {
  const session = await auth();
  const user = await getUserByGithubId(session?.user.githubId ?? "");

  if (!user) {
    return null;
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Resume</h2>
      <p className="mt-1 text-sm text-muted">
        Use your generated portfolio page and browser print-to-PDF for a free resume export.
      </p>
      <div className="mt-6 rounded-2xl border border-border bg-surface/80 p-4">
        <p className="text-sm text-muted">Recommended flow</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm">
          <li>Open your public portfolio route.</li>
          <li>Use browser print action.</li>
          <li>Save as PDF.</li>
        </ol>
      </div>
      <div className="mt-6">
        <Link
          href={`/${user.username}`}
          target="_blank"
          className="inline-flex h-11 items-center rounded-2xl bg-primary px-5 font-medium text-primary-foreground shadow-glow"
        >
          Open Portfolio for PDF Export
        </Link>
      </div>
    </Card>
  );
}
