import type { Metadata } from "next";
import { Sora } from "next/font/google";

import "@/app/globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevfolioX",
  description: "Build and publish developer portfolios instantly"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={sora.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
