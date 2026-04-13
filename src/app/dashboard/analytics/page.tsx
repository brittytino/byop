import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getPortfolioViews, getUserByGithubId } from "@/lib/repositories";

export default async function AnalyticsPage() {
  const session = await auth();
  const user = await getUserByGithubId(session?.user.githubId ?? "");

  if (!user) {
    return null;
  }

  const views = await getPortfolioViews(user.id);

  return (
    <Card>
      <h2 className="text-xl font-semibold">Analytics</h2>
      <p className="mt-1 text-sm text-muted">Track visits for your public portfolio.</p>
      <div className="mt-6 rounded-2xl border border-border bg-surface/80 p-5">
        <p className="text-sm text-muted">Total portfolio views</p>
        <p className="mt-2 text-4xl font-semibold text-primary">{views}</p>
      </div>
    </Card>
  );
}
