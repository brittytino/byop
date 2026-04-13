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
    <aside className="glass sticky top-8 h-fit rounded-3xl border border-white/5 bg-surface/50 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <p className="mb-4 px-4 text-xs font-bold uppercase tracking-wider text-muted">Workspace</p>
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-white/5 text-foreground shadow-sm"
                  : "text-muted hover:bg-white/5 hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-1/2 w-[3px] -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_12px_rgba(255,46,46,0.8)]" />
              )}
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-primary" : "text-muted group-hover:text-foreground"
                )}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
