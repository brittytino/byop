import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign-in Error",
  robots: {
    index: false,
    follow: false
  }
};

type AuthErrorPageProps = {
  searchParams?: {
    error?: string;
    reason?: string;
  };
};

function getMessage(reason?: string, error?: string) {
  if (reason === "database_setup") {
    return "Database is not initialized yet. Run npm run db:setup, then try GitHub login again.";
  }

  if (error) {
    return `Authentication failed: ${error}`;
  }

  return "Authentication failed. Please try again.";
}

export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const message = getMessage(searchParams?.reason, searchParams?.error);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="glass w-full max-w-lg rounded-2xl border border-border p-8 shadow-glow">
        <h1 className="text-2xl font-semibold">Sign-in error</h1>
        <p className="mt-3 text-sm text-muted">{message}</p>
        <p className="mt-3 text-sm text-muted">
          If this keeps happening, verify DATABASE_URL and apply db/schema.sql in Neon.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-2xl bg-primary px-5 text-sm font-medium text-primary-foreground"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
