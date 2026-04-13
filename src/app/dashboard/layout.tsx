import { redirect } from "next/navigation";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/shared/dashboard-topbar";
import { auth } from "@/lib/auth";
import { getUserByGithubId } from "@/lib/repositories";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.githubId) {
    redirect("/");
  }

  const user = await getUserByGithubId(session.user.githubId);
  if (!user) {
    redirect("/");
  }

  return (
    <div className="container py-8">
      <DashboardTopbar username={user.username} />
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <DashboardSidebar />
        <section>{children}</section>
      </div>
    </div>
  );
}
