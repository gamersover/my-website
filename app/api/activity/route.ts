import { NextResponse } from "next/server";

import { fallbackPosts, type RecentPost } from "@/app/activity";

export const revalidate = 3600;

const blogOrigin = "https://blog.caoqinping.com";

function decodeHtml(value: string) {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
    "&asymp;": "≈",
  };

  return value
    .replace(/&(amp|lt|gt|quot|#39|nbsp|asymp);/g, (entity) => entities[entity] ?? entity)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function plainText(value: string) {
  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function parsePosts(html: string): RecentPost[] {
  return html
    .split('<article class="post')
    .slice(1)
    .map((article) => {
      const titleMatch = article.match(
        /<a href="([^"]+)" class="post-title-link"[^>]*>([\s\S]*?)<\/a>/i
      );
      const dateMatch = article.match(/itemprop="dateCreated datePublished"[^>]*>([^<]+)<\/time>/i);
      const bodyMatch = article.match(/<div class="post-body"[^>]*>([\s\S]*?)<!--noindex-->/i);

      if (!titleMatch || !dateMatch) return null;

      const rawSummary = bodyMatch ? plainText(bodyMatch[1]) : "";
      const summary = rawSummary.length > 92 ? `${rawSummary.slice(0, 92).trim()}…` : rawSummary;

      return {
        title: plainText(titleMatch[2]),
        date: plainText(dateMatch[1]),
        href: new URL(titleMatch[1], blogOrigin).toString(),
        summary,
      } satisfies RecentPost;
    })
    .filter((post): post is RecentPost => post !== null)
    .slice(0, 3);
}

export async function GET() {
  try {
    const response = await fetch(blogOrigin, {
      next: { revalidate },
      headers: { "user-agent": "caoqinping.com recent-activity" },
    });

    if (!response.ok) throw new Error(`Blog returned ${response.status}`);

    const posts = parsePosts(await response.text());
    return NextResponse.json({ posts: posts.length ? posts : fallbackPosts });
  } catch {
    return NextResponse.json({ posts: fallbackPosts });
  }
}
