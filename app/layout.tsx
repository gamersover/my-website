import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "尘雨尘风",
  description: "个人网站",
  appleWebApp: {},
  icons: {
    icon: ["/logo.png"],
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'light' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <html lang="en">{children}</html>;
}
