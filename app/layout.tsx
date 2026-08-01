// @ts-ignore Next.js resolves global CSS imports at build time
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "陈华杰｜AI Agent、算法与创作",
  description: "陈华杰的个人主页：AI Agent、安全、算法工程实践，以及最近的文章与创作。",
  appleWebApp: {},
  icons: {
    icon: ["/logo.png"],
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "light" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
