import { DeployControls } from "@/components/dashboard/deploy-controls";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getPortfolioByUserId, getUserByGithubId } from "@/lib/repositories";

export default async function DeployPage() {
  const session = await auth();
  const user = await getUserByGithubId(session?.user.githubId ?? "");

  if (!user) {
    return null;
  }

  const portfolio = await getPortfolioByUserId(user.id);
  const isPublished = portfolio?.is_published ?? false;

  return (
    <Card>
      <h2 className="text-xl font-semibold">Deploy</h2>
      <p className="mt-1 text-sm text-muted">
        Publish your portfolio when you are ready to share it publicly.
      </p>

      <div className="mt-6">
        <DeployControls
          username={user.username}
          isPublished={isPublished}
          updatedAt={portfolio?.updated_at ?? null}
        />
      </div>
    </Card>
  );
}
