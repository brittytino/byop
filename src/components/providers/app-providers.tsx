"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "sonner";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SessionProvider>
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            className: "border border-border bg-surface text-foreground"
          }}
        />
      </SessionProvider>
    </ThemeProvider>
  );
}
