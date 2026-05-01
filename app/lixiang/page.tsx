import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function LixiangPage() {
  return (
    <iframe
      src="/lixiang/index.html"
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
}
