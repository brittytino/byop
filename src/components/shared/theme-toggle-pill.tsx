"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeTogglePill() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 rounded-full border border-border bg-surface/50 px-3 py-1.5 opacity-50">
        <Sun className="h-4 w-4" />
        <span className="text-sm font-medium">Auto</span>
        <Moon className="h-4 w-4" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-3 rounded-full border border-border bg-surface/50 px-3 py-1.5 transition-all hover:border-primary/50 backdrop-blur-md"
    >
      <Sun className={`h-4 w-4 ${!isDark ? "text-primary" : "text-muted-foreground"}`} />
      <span className="text-sm font-medium text-foreground">Auto</span>
      <Moon className={`h-4 w-4 ${isDark ? "text-primary" : "text-muted-foreground"}`} />
    </button>
  );
}
