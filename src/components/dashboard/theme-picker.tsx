"use client";

import { Check, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
    description: "Black canvas, amber glow, glass surfaces",
    template: "Cinematic (GSAP)",
    preview: {
      darkBackground: "#060606",
      darkSurface: "#121212",
      lightBackground: "#fffdf6",
      lightSurface: "#ffffff",
      accent: "#f5a300"
    }
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    description: "Deep blue depths with bright cyan highlights",
    template: "Swipe Layout",
    preview: {
      darkBackground: "#08142c",
      darkSurface: "#10203c",
      lightBackground: "#f4f9ff",
      lightSurface: "#ffffff",
      accent: "#00bcd4"
    }
  },
  {
    id: "forest-whisper",
    name: "Forest Whisper",
    description: "Subtle dark greens with fresh lime accents",
    template: "Editorial Grid",
    preview: {
      darkBackground: "#061b11",
      darkSurface: "#0d2a1d",
      lightBackground: "#f5fcf8",
      lightSurface: "#ffffff",
      accent: "#37b24d"
    }
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    description: "Royal violet backing with a warm orange aura",
    template: "Executive Sidebar",
    preview: {
      darkBackground: "#1f1028",
      darkSurface: "#2c1635",
      lightBackground: "#fff7f0",
      lightSurface: "#ffffff",
      accent: "#ff8c42"
    }
  },
  {
    id: "monochrome-exec",
    name: "Monochrome Exec",
    description: "Absolute black and white for pure minimalism",
    template: "Monolith Timeline",
    preview: {
      darkBackground: "#050505",
      darkSurface: "#101010",
      lightBackground: "#fafafa",
      lightSurface: "#ffffff",
      accent: "#111111"
    }
  },
  {
    id: "rose-luxe",
    name: "Rose Luxe",
    description: "Burgundy depth with rose-gold luxury accents",
    template: "Atelier Signature",
    preview: {
      darkBackground: "#1a0c12",
      darkSurface: "#2a121d",
      lightBackground: "#fff5f8",
      lightSurface: "#ffffff",
      accent: "#d9779f"
    }
  }
];

export function ThemePicker({ activeTheme }: ThemePickerProps) {
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {themes.map((theme) => {
        const selected = theme.id === activeTheme;
        const isSaving = pending && activeThemeId === theme.id;

        return (
          <Card
            key={theme.id}
            className={selected ? "border-primary shadow-glow" : "border-border"}
          >
            <p className="text-lg font-semibold">{theme.name}</p>
            <p className="mt-1 text-sm text-muted">{theme.description}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-primary/80">
              Template: {theme.template}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div
                className="rounded-xl border border-border p-3"
                style={{ backgroundColor: theme.preview.darkBackground }}
              >
                <p className="text-xs font-medium text-white/80">Dark Preview</p>
                <div
                  className="mt-2 rounded-lg border p-3"
                  style={{
                    backgroundColor: theme.preview.darkSurface,
                    borderColor: "rgba(255,255,255,0.12)"
                  }}
                >
                  <div
                    className="h-2 w-20 rounded-full"
                    style={{ backgroundColor: theme.preview.accent }}
                  />
                  <div className="mt-2 h-2 w-14 rounded-full bg-white/25" />
                </div>
              </div>

              <div
                className="rounded-xl border border-border p-3"
                style={{ backgroundColor: theme.preview.lightBackground }}
              >
                <p className="text-xs font-medium text-black/60">Light Preview</p>
                <div
                  className="mt-2 rounded-lg border p-3"
                  style={{
                    backgroundColor: theme.preview.lightSurface,
                    borderColor: "rgba(0,0,0,0.08)"
                  }}
                >
                  <div
                    className="h-2 w-20 rounded-full"
                    style={{ backgroundColor: theme.preview.accent }}
                  />
                  <div className="mt-2 h-2 w-14 rounded-full bg-black/15" />
                </div>
              </div>
            </div>

            <Button
              className="mt-4"
              variant={selected ? "secondary" : "default"}
              disabled={pending || selected}
              onClick={() => {
                setActiveThemeId(theme.id);
                startTransition(async () => {
                  const result = await setThemeAction(theme.id);
                  if (result.ok) {
                    toast.success(result.message);
                  } else {
                    toast.error(result.message);
                  }
                  setActiveThemeId(null);
                });
              }}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {selected ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Selected
                </>
              ) : (
                "Use this theme"
              )}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
