import { NextResponse } from "next/server";

import { fallbackPosts, type RecentPost } from "@/app/activity";

export const revalidate = 300;

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
    .split(/<article\b[^>]*>/i)
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
  // Prefer the Astro feed; retain Hexo support during the domain cutover.
  try {
    const response = await fetch(`${blogOrigin}/api/posts.json`, {
      next: { revalidate },
      headers: { "user-agent": "caoqinping.com recent-activity" },
    });
    if (!response.ok) throw new Error(`Blog feed returned ${response.status}`);
    const data: unknown = await response.json();
    const entries = data && typeof data === "object" && "posts" in data ? data.posts : null;
    if (Array.isArray(entries)) {
      const posts = entries
        .filter((post): post is RecentPost =>
          post !== null && typeof post === "object" &&
          typeof post.title === "string" && typeof post.date === "string" &&
          typeof post.href === "string" && post.href.startsWith(`${blogOrigin}/`) &&
          typeof post.summary === "string"
        )
        .slice(0, 3)
        .map((post) => ({
          title: post.title,
          date: post.date,
          href: post.href,
          summary: post.summary.length > 92 ? `${post.summary.slice(0, 92).trim()}…` : post.summary,
        }));
      if (posts.length) return NextResponse.json({ posts });
    }
  } catch {
    // The old site has no JSON feed; fall back until the new blog is live.
  }

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
