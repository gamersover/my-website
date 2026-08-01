export type RecentPost = {
  title: string;
  date: string;
  href: string;
  summary: string;
};

// The homepage refreshes these from the blog at runtime. Keeping a small,
// verified fallback means the page is still useful if the blog is unavailable.
export const fallbackPosts: RecentPost[] = [
  {
    title: "Agent构建心得及避坑（三）",
    date: "2025-11-04",
    href: "https://blog.caoqinping.com/2025/11/04/Agent%E6%9E%84%E5%BB%BA%E5%BF%83%E5%BE%97%E5%8F%8A%E9%81%BF%E5%9D%91-%E4%B8%89/",
    summary: "继续聊 Agent，这一次把重点放在工具调用：它能做什么，又该如何落进真实系统。",
  },
  {
    title: "Agent构建心得及避坑（二）",
    date: "2025-09-11",
    href: "https://blog.caoqinping.com/2025/09/11/Agent%E6%9E%84%E5%BB%BA%E5%BF%83%E5%BE%97%E5%8F%8A%E9%81%BF%E5%9D%91-%E4%BA%8C/",
    summary: "补完知识库与 RAG 的构建细节，以及 Agent 获取模型外部知识时容易遇到的问题。",
  },
  {
    title: "Agent构建心得及避坑",
    date: "2025-09-08",
    href: "https://blog.caoqinping.com/2025/09/08/Agent%E6%9E%84%E5%BB%BA%E5%BF%83%E5%BE%97%E5%8F%8A%E9%81%BF%E5%9D%91/",
    summary: "从模型选择开始，记录构建 Agent 时真正影响效果和工程稳定性的经验。",
  },
];
