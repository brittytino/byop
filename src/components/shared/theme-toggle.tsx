"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="secondary" size="sm" className="w-10 h-10 rounded-full opacity-50" disabled />;
  }

  const isDark = theme !== "light";

  return (
    <Button
      variant="secondary"
      size="sm"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface p-0 transition-all duration-300 hover:border-primary/50"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle light and dark mode"
    >
      {isDark ? (
        <Sun className="h-4 w-4 animate-in spin-in-90 duration-300" />
      ) : (
        <Moon className="h-4 w-4 animate-in -spin-in-90 duration-300" />
      )}
    </Button>
  );
}
