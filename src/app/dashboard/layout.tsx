import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/shared/dashboard-topbar";
import { auth } from "@/lib/auth";
import { getUserByGithubId } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false
  }
};

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
      <DashboardTopbar
        username={user.username}
        displayName={user.name}
        avatarUrl={user.avatar_url}
      />
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <DashboardSidebar />
        <section>{children}</section>
      </div>
    </div>
  );
}
