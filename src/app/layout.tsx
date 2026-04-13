import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "@/app/globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });
const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://portfolio.tinobritty.me";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BYOP - Build Your Own Portfolio",
    template: "%s | BYOP"
  },
  description:
    "Generate a free developer portfolio from GitHub and publish it instantly with BYOP.",
  applicationName: "BYOP",
  keywords: [
    "portfolio generator",
    "free portfolio website",
    "build your own portfolio",
    "publish developer portfolio",
    "GitHub portfolio",
    "student portfolio"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "BYOP - Build Your Own Portfolio",
    description:
      "Generate a free developer portfolio from GitHub and publish it instantly.",
    siteName: "BYOP"
  },
  twitter: {
    card: "summary_large_image",
    title: "BYOP - Build Your Own Portfolio",
    description:
      "Generate a free developer portfolio from GitHub and publish it instantly."
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#f5a300"
      }
    ]
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1
    }
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5a300" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${interTight.variable} font-sans`}>
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
