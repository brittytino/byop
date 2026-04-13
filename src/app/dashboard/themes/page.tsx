import { ThemePicker } from "@/components/dashboard/theme-picker";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getPortfolioByUserId, getUserByGithubId } from "@/lib/repositories";

export default async function ThemesPage() {
  const session = await auth();
  const user = await getUserByGithubId(session?.user.githubId ?? "");

  if (!user) {
    return null;
  }

  const portfolio = await getPortfolioByUserId(user.id);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold">Themes & Templates</h2>
        <p className="mt-1 text-sm text-muted">Choose a theme and template style for your public portfolio.</p>
        <p className="mt-3 text-xs text-muted">
          Each option includes dark and light previews so you can pick the cleanest professional look.
        </p>
      </Card>
      <ThemePicker activeTheme={portfolio?.theme ?? "midnight-inferno"} />
    </div>
  );
}
