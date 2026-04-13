"use client";

import { BarChart3, Brush, FolderGit2, Rocket, ScrollText, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Projects", href: "/dashboard/projects", icon: FolderGit2 },
  { label: "Themes", href: "/dashboard/themes", icon: Brush },
  { label: "Deploy", href: "/dashboard/deploy", icon: Rocket },
  { label: "Resume", href: "/dashboard/resume", icon: ScrollText },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 }
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass sticky top-6 h-fit rounded-2xl border border-border p-4 shadow-glow">
      <p className="mb-4 px-3 text-sm font-semibold text-muted">Workspace</p>
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-foreground",
                isActive && "bg-primary/10 text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
