"use client";

import { useTransition } from "react";

import { setThemeAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ThemePickerProps = {
  activeTheme: string;
};

const themes = [
  {
    id: "midnight-inferno",
    name: "Midnight Inferno",
    description: "Black canvas, red glow, glass surfaces"
  },
  {
    id: "snow-crimson",
    name: "Snow Crimson",
    description: "Bright mode with restrained red accents"
  }
];

export function ThemePicker({ activeTheme }: ThemePickerProps) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {themes.map((theme) => {
        const selected = theme.id === activeTheme;
        return (
          <Card key={theme.id} className={selected ? "border-primary" : ""}>
            <p className="text-lg font-semibold">{theme.name}</p>
            <p className="mt-1 text-sm text-muted">{theme.description}</p>
            <Button
              className="mt-4"
              variant={selected ? "secondary" : "default"}
              disabled={pending || selected}
              onClick={() => {
                startTransition(async () => {
                  await setThemeAction(theme.id);
                });
              }}
            >
              {selected ? "Selected" : "Use this theme"}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
