import type { Metadata } from "next";
import NewHomePageClient from "./NewHomePageClient";

export const metadata: Metadata = {
  title: "陈华杰 | New",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewHomePage() {
  return <NewHomePageClient />;
}
