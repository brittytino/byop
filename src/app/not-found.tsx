import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="glass w-full max-w-md rounded-2xl border border-border p-8 text-center shadow-glow">
        <p className="text-sm text-muted">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Portfolio not found</h1>
        <p className="mt-2 text-sm text-muted">
          This portfolio may be private or the username does not exist.
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
