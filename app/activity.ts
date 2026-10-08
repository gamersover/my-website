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
    "title": "心之学（四）：AI时代的心之所归",
    "date": "2026-08-01",
    "href": "https://blog.caoqinping.com/2026/08/01/%E5%BF%83%E4%B9%8B%E5%AD%A6%EF%BC%88%E5%9B%9B%EF%BC%89%EF%BC%9AAI%E6%97%B6%E4%BB%A3%E7%9A%84%E5%BF%83%E4%B9%8B%E6%89%80%E5%BD%92/",
    "summary": "一、AI之后：当现实不再占据生命的中心 在人类过去的生活中，现实始终具有一种不可回避的力量。 人必须谋生、劳动，在社会中找到自己的位置。无论心真正向往什么，多数人都需要先回应生存的要求…"
  },
  {
    "title": "心之学（三）：良知与现实",
    "date": "2026-08-01",
    "href": "https://blog.caoqinping.com/2026/08/01/%E5%BF%83%E4%B9%8B%E5%AD%A6%EF%BC%88%E4%B8%89%EF%BC%89%EF%BC%9A%E8%89%AF%E7%9F%A5%E4%B8%8E%E7%8E%B0%E5%AE%9E/",
    "summary": "一、心与良知 心之所向与心之所归，当以致良知为本。 愿望与行动的一致，尚不足以成全生命。贪婪也可以有所向，恶意也可以安于所得。若只以是否违心为尺度，那么一个不再有所愧疚的人，反倒仿佛比…"
  },
  {
    "title": "心之学（二）：无为与共鸣",
    "date": "2026-08-01",
    "href": "https://blog.caoqinping.com/2026/08/01/%E5%BF%83%E4%B9%8B%E5%AD%A6%EF%BC%88%E4%BA%8C%EF%BC%89%EF%BC%9A%E6%97%A0%E4%B8%BA%E4%B8%8E%E5%85%B1%E9%B8%A3/",
    "summary": "一、无为与心之所归 这里借“无为”所要表达的，是一种不以功利强求支配全部生命的行动方式。 当人把每一件事都当作换取另一件事的工具，生活便不断被推向将来。学习为了竞争，工作为了晋升，晋升…"
  }
];
