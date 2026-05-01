import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BiBookOpen,
  BiCodeAlt,
  BiGame,
  BiLogoGithub,
  BiLogoGmail,
  BiPen,
  BiRightArrowAlt,
} from "react-icons/bi";

export const metadata: Metadata = {
  title: "陈华杰 | New",
  robots: {
    index: false,
    follow: false,
  },
};

const works = [
  {
    title: "Blog",
    label: "技术博客",
    description: "技术文章、工程笔记，以及对 AI 与系统实践的长期整理。",
    href: "https://blog.caoqinping.com",
    icon: BiBookOpen,
    tone: "bg-[#edf4f1]",
    external: true,
  },
  {
    title: "Poem",
    label: "诗稿",
    description: "诗稿与文字创作，保留工程之外更慢、更个人的表达。",
    href: "/poem",
    icon: BiPen,
    tone: "bg-[#f6eee8]",
    external: false,
  },
  {
    title: "Game",
    label: "纸牌游戏",
    description: "可玩的网页实验，用规则、交互和反馈做轻量创作。",
    href: "https://game.caoqinping.com",
    icon: BiGame,
    tone: "bg-[#eef3e9]",
    external: true,
  },
  {
    title: "Playground",
    label: "LLM 游乐场",
    description: "工具、原型和想法试验场，快速验证一些有趣的问题。",
    href: "https://playground.caoqinping.com",
    icon: BiCodeAlt,
    tone: "bg-[#f5efd9]",
    external: true,
  },
];

const contacts = [
  {
    label: "Email",
    value: "cmathking@gmail.com",
    href: "mailto:cmathking@gmail.com",
    icon: BiLogoGmail,
    color: "text-[#ea4335]",
  },
  {
    label: "GitHub",
    value: "gamersover",
    href: "https://github.com/gamersover",
    icon: BiLogoGithub,
    color: "text-[#24292f]",
  },
];

const experiences = [
  {
    period: "2019 - 2023",
    company: "腾讯",
    role: "算法工程师",
    description: "参与算法系统与工程化落地，关注模型效果、数据链路与线上稳定性。",
  },
  {
    period: "2023 - 至今",
    company: "理想汽车",
    role: "AI Agent 与安全",
    description: "围绕 AI Agent 的能力边界、系统安全与产品化应用展开工程实践。",
  },
];

const labelClass =
  "text-xs font-semibold uppercase tracking-[0.22em] text-[#766c60]";

export default function NewHomePage() {
  return (
    <main className="min-h-screen bg-[#f3eee5] text-[#19130f]">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-[#d8ccbc] py-5">
          <Link href="/" aria-label="返回旧首页">
            <Image
              src="/logo.svg"
              alt=""
              width={42}
              height={42}
              className="h-10 w-10"
              priority
            />
          </Link>

          <nav aria-label="主要页面" className="hidden items-center gap-8 md:flex">
            {works.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="text-sm font-semibold text-[#6d6359] transition hover:text-[#9f3328]"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </header>

        <section className="grid gap-8 border-b border-[#d8ccbc] py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:py-12">
          <div>
            <p className={labelClass}>AI Agent / Security / Algorithm</p>
            <h1
              className="mt-6 text-[78px] font-normal leading-[0.92] tracking-normal sm:text-[124px] lg:text-[142px]"
              style={{
                fontFamily:
                  "'Songti SC', 'STSong', 'Noto Serif SC', 'Source Han Serif SC', serif",
              }}
            >
              陈华杰
            </h1>
            <p className="mt-7 max-w-3xl text-[22px] font-medium leading-10 text-[#2e2822]">
              算法工程师，曾在腾讯从事算法相关工作，目前在理想汽车负责 AI Agent 与安全方向。
            </p>
            <p className="mt-3 max-w-2xl text-base leading-8 text-[#61574d]">
              持续写技术文章、做工具和创作实验，也留下一些诗稿和更慢的文字。
            </p>
          </div>

          <aside className="border-t border-[#d8ccbc] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <h2 className={labelClass}>Contact</h2>
            <div className="mt-5 grid gap-4">
              {contacts.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group flex items-center gap-4"
                  >
                    <Icon className={`text-3xl ${item.color}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#766c60]">
                        {item.label}
                      </p>
                      <p className="mt-1 break-all text-base font-semibold">
                        {item.value}
                      </p>
                    </div>
                    <BiRightArrowAlt className="text-2xl text-[#968b7d] transition group-hover:translate-x-1 group-hover:text-[#9f3328]" />
                  </a>
                );
              })}
            </div>
          </aside>
        </section>

        <section className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:py-12">
          <section aria-labelledby="works-heading">
            <h2 id="works-heading" className={`${labelClass} mb-5`}>
              Works
            </h2>

            <nav aria-label="页面入口" className="grid gap-4 sm:grid-cols-2">
              {works.map((item, index) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className={`group relative flex min-h-[220px] overflow-hidden rounded-3xl border border-[#d8ccbc] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#9f3328]/40 hover:bg-[#fffaf2] hover:shadow-[0_18px_45px_rgba(49,36,25,0.10)] ${item.tone}`}
                  >
                    <div className="relative z-10 flex min-h-full w-full flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-sm font-semibold text-[#8b8175]">
                          0{index + 1}
                        </span>
                        <Icon className="text-4xl text-[#9f3328]" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#766c60]">
                          {item.label}
                        </p>
                        <h3 className="mt-2 text-4xl font-semibold leading-none">
                          {item.title}
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-[#61574d]">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <BiRightArrowAlt className="text-4xl text-[#968b7d] transition group-hover:translate-x-1 group-hover:text-[#9f3328]" />
                      </div>
                    </div>
                  </a>
                );
              })}
            </nav>
          </section>

          <section aria-labelledby="experience-heading" className="lg:pl-4">
            <h2 id="experience-heading" className={`${labelClass} mb-5`}>
              Experience
            </h2>

            <div className="grid gap-7">
              {experiences.map((item) => (
                <article key={item.company}>
                  <p className="text-sm font-semibold text-[#766c60]">
                    {item.period}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight">
                    {item.company}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-[#9f3328]">
                    {item.role}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#61574d]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
