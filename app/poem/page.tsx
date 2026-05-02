"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PoemItem = {
  title: string;
  file: string;
  note: string;
  accent: string;
  text: string[];
  wide?: boolean;
};

const poems: PoemItem[] = [
  {
    title: "庆新婚",
    file: "/poem/庆新婚.png",
    note: "喜气盈纸，落笔稳而有节。",
    accent: "嘉礼",
    text: [
      "群芳众蕊护新春，",
      "百艳一枝恋旧尘。",
      "不让须眉慷慨气，",
      "从如洛女覆国身。",
      "曾成傲骨凌云志，",
      "又觅诚心知意人。",
      "宇霁虹中飞喜鹊，",
      "闺妆镜里映红唇。",
    ],
  },
  {
    title: "念柳图",
    file: "/poem/念柳图.png",
    note: "枝影含烟，气息清柔而不弱。",
    accent: "春思",
    text: [
      "遍缕丝轻花影空，",
      "鸟语画色映帘中。",
      "情柳似烟袅袅起，",
      "化作尘雨随尘风。",
    ],
  },
  {
    title: "情有感",
    file: "/poem/情有感.png",
    note: "字里有起伏，意绪在转折处最动人。",
    accent: "心声",
    text: [
      "半影哀鸿寄妾伤，",
      "孤衣破镜弄眉妆；",
      "陈姻落尽双娥泪，",
      "忆最倾心爱未央。",
    ],
  },
  {
    title: "生有感",
    file: "/poem/生有感.png",
    note: "情绪铺陈更开阔，字势之间能看到层层递进。",
    accent: "生念",
    wide: true,
    text: [
      "魄净七重日，",
      "魂安一处沙。",
      "平生趋富贵，",
      "暮世系荣华。",
      "善水出坚木，",
      "春泥育毅花。",
      "文章传万载，",
      "绿叶蔓青崖。",
    ],
  },
  {
    title: "死有感",
    file: "/poem/死有感.png",
    note: "题意沉着，整体更凝练，节奏也更压低了一些。",
    accent: "沉思",
    wide: true,
    text: [
      "深秋叶落谢花飞，",
      "几许忧愁几许悲；",
      "好雨清风终散去，",
      "夕阳皓月暂轮回；",
      "焉无万紫争奇艳，",
      "更有千红斗正魁；",
      "待到新春初霁后，",
      "凭风会自百花归。",
    ],
  },
  {
    title: "归乡",
    file: "/poem/归乡.png",
    note: "篇幅舒展，气息平缓，像一路回望后的落笔。",
    accent: "归途",
    text: [
      "幽幽径远花香，林裔裳裳，落水月光，座似影叠嶂，情源系何方？",
      "一一子规啼阳，叶迹晃晃，青风云翔，空归梦惆怅，横塘是吾乡。",
    ],
  },
  {
    title: "来去诗",
    file: "/poem/来去诗.png",
    note: "收放之间见从容，行气舒朗。",
    accent: "往复",
    text: [
      "三年研究路步步实足，一首来去诗字字真心。",
      "",
      "来之欣欣，去之轻轻，不闻不语，不溢不惊。",
      "诚心故致，鸣谦以行，知心故纯，知理以明。",
      "来之糠糠，去之泱泱，不悦不愠，不曲不觞。",
      "痴心尚溃，衔悲以扬，情心尚壁，怀悠以藏。",
      "来之迢迢，去之夭夭，不思不寄，不怠不消。",
      "秽心止清，守德以昭，欲心止静，效仁以韬。",
      "来也夕夕，去也夕夕，不咽不叹，不悔不期。",
      "仕心尝醉，夙诗以启，志心尝危，晓词以惕。",
    ],
  },
  {
    title: "访仙",
    file: "/poem/访仙.png",
    note: "有远意，也有山行般的空灵。",
    accent: "游想",
    wide: true,
    text: [
      "弄月摘星遇圣灵，",
      "趋云驾雾访仙名。",
      "同观柳绿梅红色，",
      "共奏鸥琴鹤瑟声。",
      "我与清风杯酒后，",
      "清风送我速归行。",
      "人间岁有浑浊气，",
      "愿作长天一片青。",
    ],
  },
  {
    title: "寻乐九首（其七）",
    file: "/poem/寻乐九首（其七）.png",
    note: "横向展开的章法更开阔，读起来有一种徐徐铺陈的节奏。",
    accent: "长歌",
    wide: true,
    text: [
      "昔日与，饮无觞，今宵共，月半常。一旎乘辑卒逐去，万绿随风且呈黄。醉幕许开天河路，云掩乘之金銮堂，俯看浮云飘似乐，矗山皆已粟渺茫。",
      "桃荔酒，篪籁音，寒姿艳，鹤仙鸣，霁雨花开春暖迟，庭看瑶池千百枝，月镜浩荡川瀑逝，欲渡千载也无尝，品杯枉饮歌数阕，一阕无意触神皇。",
      "愿叹：酌不乐，乐何以哉？",
    ],
  },
  {
    title: "酒",
    file: "/poem/酒.png",
    note: "短题却有烈度，墨色与情绪都更浓。",
    accent: "酣兴",
    text: [
      "醒韵十里香，",
      "缘何寄此觞？",
      "欲与逐流去，",
      "又恨此杯长。",
    ],
  },
];

function PoemText({
  lines,
  className,
  gapClassName = "gap-y-2",
}: {
  lines: string[];
  className: string;
  gapClassName?: string;
}) {
  const isCoupletGrid = lines.length === 8 && lines.every((line) => line !== "");

  if (isCoupletGrid) {
    return (
      <div className={`inline-grid grid-cols-[max-content_max-content] gap-x-1.5 ${gapClassName} ${className}`}>
        {lines.map((line, lineIndex) => (
          <p key={`${line}-${lineIndex}`}>{line}</p>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {lines.map((line, lineIndex) =>
        line === "" ? (
          <div key={`spacer-${lineIndex}`} className="h-2" />
        ) : (
          <p key={`${line}-${lineIndex}`}>{line}</p>
        )
      )}
    </div>
  );
}

export default function Poem() {
  const [selected, setSelected] = useState<number | null>(null);
  const [activePoemIndex, setActivePoemIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imageFullscreen, setImageFullscreen] = useState(false);
  const imageScrollerRef = useRef<HTMLDivElement | null>(null);
  const poemCount = poems.length;
  const selectedPoem = useMemo(
    () => (selected === null ? null : poems[selected]),
    [selected]
  );
  const selectedPoemIsWide = selectedPoem?.wide === true;

  // Swipe-right from left edge to open sidebar
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientX < 30) {
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    }
  }, []);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX.current;
    const dy = Math.abs(touch.clientY - touchStartY.current);
    touchStartX.current = null;
    touchStartY.current = null;
    if (dx > 60 && dy < 80) {
      setSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onTouchStart, onTouchEnd]);

  useEffect(() => {
    const sections = poems
      .map((_, index) => document.getElementById(`poem-${index + 1}`))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

        if (visibleEntries.length === 0) {
          return;
        }

        const nextIndex = sections.findIndex(
          (section) => section.id === visibleEntries[0].target.id
        );

        if (nextIndex !== -1) {
          setActivePoemIndex(nextIndex);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.2, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToPoem = useCallback((index: number) => {
    setActivePoemIndex(index);

    window.setTimeout(() => {
      document.getElementById(`poem-${index + 1}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }, []);

  const closePoem = useCallback(() => {
    if (selected === null) {
      return;
    }

    const closingPoemIndex = selected;
    setSelected(null);
    scrollToPoem(closingPoemIndex);
  }, [scrollToPoem, selected]);

  useEffect(() => {
    if (selected === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (imageFullscreen) {
          setImageFullscreen(false);
          return;
        }

        closePoem();
      }

      if (event.key === "ArrowLeft") {
        setSelected((current) => {
          if (current === null) {
            return current;
          }

          return (current - 1 + poems.length) % poems.length;
        });
      }

      if (event.key === "ArrowRight") {
        setSelected((current) => {
          if (current === null) {
            return current;
          }

          return (current + 1) % poems.length;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePoem, imageFullscreen, selected]);

  useEffect(() => {
    if (imageScrollerRef.current) {
      imageScrollerRef.current.scrollLeft = 0;
    }
    setImageFullscreen(false);
  }, [selected]);

  const openPoem = (index: number) => setSelected(index);
  const showPrevious = () => {
    setSelected((current) => {
      if (current === null) {
        return current;
      }

      return (current - 1 + poems.length) % poems.length;
    });
  };
  const showNext = () => {
    setSelected((current) => {
      if (current === null) {
        return current;
      }

      return (current + 1) % poems.length;
    });
  };

  return (
    <div
      className="relative min-h-screen bg-[#f7f1e8] text-stone-800"
      style={{ fontFamily: "'Iowan Old Style', 'Songti SC', 'Noto Serif SC', serif" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),transparent_45%),linear-gradient(135deg,rgba(165,42,42,0.08),transparent_40%),linear-gradient(180deg,#f8f3ec_0%,#f0e5d7_100%)]" />
        <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-[#b44a3f]/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-[32rem] w-[32rem] rounded-full bg-[#d7b98f]/20 blur-3xl" />
        <div className="absolute bottom-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-8 lg:px-12 lg:pb-32">
        {/* Mobile sidebar trigger */}
        <button
          type="button"
          onClick={() => setSidebarOpen((open) => !open)}
          className={`fixed bottom-6 left-4 flex h-12 w-12 items-center justify-center rounded-full border border-stone-300/80 bg-white/85 shadow-lg backdrop-blur transition hover:bg-white lg:hidden ${
            sidebarOpen ? "z-[60]" : "z-40"
          }`}
          aria-label={sidebarOpen ? "关闭导航" : "打开导航"}
        >
          {sidebarOpen ? (
            <span className="text-xl leading-none text-stone-600">×</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-600"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          )}
        </button>

        {/* Mobile sidebar overlay */}
        <div
          className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
            sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Mobile sidebar drawer */}
        <aside
          className={`fixed left-0 top-0 z-50 h-full w-[300px] max-w-[85vw] overflow-y-auto bg-[#f7f1e8] p-6 pb-24 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-4">
            <p className="text-xs tracking-[0.35em] text-stone-400">导航</p>
          </div>
          <div className="flex flex-col gap-2">
            {poems.map((poem, i) => (
              <a
                key={poem.title}
                href={`#poem-${i + 1}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                  activePoemIndex === i
                    ? "border-stone-400 bg-white text-stone-900 shadow-sm"
                    : "border-stone-200/70 bg-white/60 text-stone-600 hover:border-stone-300 hover:bg-white"
                }`}
              >
                <span className={`tracking-[0.12em] ${activePoemIndex === i ? "text-stone-900" : "text-stone-700"}`}>
                  {poem.title}
                </span>
                <span className={`text-xs ${activePoemIndex === i ? "text-stone-700" : "text-stone-400"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </a>
            ))}
          </div>
        </aside>

        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
          <aside className="hidden lg:sticky lg:top-6 lg:block lg:self-start lg:max-h-[calc(100vh-3rem)]">
            <div className="rounded-[2rem] border border-stone-200/80 bg-white/65 p-6 shadow-[0_20px_80px_rgba(112,73,44,0.12)] backdrop-blur lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.35em] text-stone-400">手稿小记</p>
                  <h2 className="mt-3 text-2xl tracking-[0.2em] text-stone-900">{poemCount} 幅诗稿</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#9f2f23] text-sm tracking-[0.2em] text-white shadow-lg shadow-[#9f2f23]/20">
                  印
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm leading-7 text-stone-600">
                <p>
                  收录《庆新婚》《念柳图》《情有感》《归乡》《生有感》《死有感》《访仙》等作品。
                </p>
                <p>
                  点开作品可查看大图，桌面端支持键盘方向键切换。
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-dashed border-stone-200 pt-6 text-center">
                <div>
                  <p className="text-2xl text-stone-900">{poemCount}</p>
                  <p className="mt-1 text-[11px] tracking-[0.24em] text-stone-400">诗稿</p>
                </div>
                <div>
                  <p className="text-2xl text-stone-900">1</p>
                  <p className="mt-1 text-[11px] tracking-[0.24em] text-stone-400">主题页</p>
                </div>
                <div>
                  <p className="text-2xl text-stone-900">∞</p>
                  <p className="mt-1 text-[11px] tracking-[0.24em] text-stone-400">回味</p>
                </div>
              </div>

              <div className="mt-8 border-t border-dashed border-stone-200 pt-6">
                <p className="text-xs tracking-[0.35em] text-stone-400">作品导航</p>
                <div className="mt-4 flex flex-col gap-2">
                  {poems.map((poem, i) => (
                    <a
                      key={poem.title}
                      href={`#poem-${i + 1}`}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                        activePoemIndex === i
                          ? "border-stone-400 bg-white text-stone-900 shadow-sm"
                          : "border-stone-200/70 bg-white/60 text-stone-600 hover:border-stone-300 hover:bg-white"
                      }`}
                    >
                      <span className={`tracking-[0.12em] ${activePoemIndex === i ? "text-stone-900" : "text-stone-700"}`}>
                        {poem.title}
                      </span>
                      <span className={`text-xs ${activePoemIndex === i ? "text-stone-700" : "text-stone-400"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex flex-col gap-8 pb-8 sm:gap-10">
        {poems.map((poem, i) => {
          return (
            <div key={poem.title} id={`poem-${i + 1}`} className="scroll-mt-10 lg:scroll-mt-12">
            <button
              type="button"
              className="group relative w-full text-left"
              onClick={() => openPoem(i)}
            >
              <div
                className="relative overflow-hidden rounded-[2rem] border border-stone-200/70 bg-[#fffdf9]/90 p-3 shadow-[0_20px_60px_rgba(60,34,18,0.14)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_70px_rgba(60,34,18,0.2)] sm:p-4"
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.55),transparent_32%,rgba(159,47,35,0.04)_100%)]" />

                <div className="relative overflow-hidden rounded-[1.35rem] border border-stone-100 bg-white">
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/20">
                    <span className="rounded-full border border-white/30 bg-black/45 px-4 py-2 text-xs tracking-[0.3em] text-white opacity-0 transition duration-300 group-hover:opacity-100">
                      查看全图
                    </span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={poem.file}
                    alt={poem.title}
                    className="block w-full rounded-[1.35rem] object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="relative flex flex-col gap-4 px-3 pb-3 pt-5 sm:px-4 sm:pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] tracking-[0.35em] text-stone-400">{poem.accent}</p>
                      <h3 className="mt-2 text-xl tracking-[0.24em] text-stone-900 sm:text-2xl">
                        {poem.title}
                      </h3>
                    </div>
                    <span className="mt-1 text-sm text-stone-300">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="max-w-xl text-sm leading-7 text-stone-500">
                    {poem.note}
                  </p>
                  <div className="border-t border-dashed border-stone-200 pt-4">
                    <p className="text-[11px] tracking-[0.32em] text-stone-400">原文</p>
                    <PoemText
                      lines={poem.text}
                      className="mt-3 text-sm leading-8 text-stone-700 sm:text-[15px]"
                    />
                  </div>
                </div>
              </div>
            </button>
            </div>
          );
        })}
          </div>
      </div>
      </div>

      {selectedPoem && (
        <div
          className="fixed inset-0 z-50 flex items-stretch justify-center bg-stone-950/90 p-0 backdrop-blur-md lg:items-start lg:p-6"
          onClick={closePoem}
        >
          <div
            className="relative flex h-[100dvh] w-full max-w-7xl flex-col gap-3 overflow-hidden bg-stone-950/60 p-3 shadow-2xl shadow-black/40 lg:my-0 lg:h-auto lg:max-h-[calc(100vh-3rem)] lg:gap-5 lg:rounded-[2rem] lg:border lg:border-white/10 lg:bg-white/6 lg:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 pb-3 text-white/80 sm:gap-4 sm:pb-4">
              <div className="min-w-0">
                <p className="text-[11px] tracking-[0.35em] text-white/40">诗稿预览</p>
                <h2 className="mt-1 truncate text-xl tracking-[0.2em] text-white sm:mt-2 sm:text-3xl sm:tracking-[0.24em]">
                  {selectedPoem.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closePoem}
                className="shrink-0 rounded-full border border-white/15 px-3 py-2 text-xs tracking-[0.18em] text-white/70 transition hover:bg-white/10 hover:text-white sm:px-4 sm:text-sm sm:tracking-[0.2em]"
              >
                关闭
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto lg:hidden">
              <div className="overflow-hidden rounded-[1.25rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]">
                {selectedPoemIsWide ? (
                  <div
                    ref={imageScrollerRef}
                    className="flex h-[58dvh] w-full items-center justify-center overflow-hidden p-3"
                  >
                    <button
                      type="button"
                      onClick={() => setImageFullscreen(true)}
                      className="flex h-full w-full items-center justify-center overflow-hidden"
                      aria-label={`全屏查看${selectedPoem.title}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedPoem.file}
                        alt={selectedPoem.title}
                        className="h-auto max-h-none w-[54dvh] max-w-none rotate-90 rounded-xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                      />
                    </button>
                  </div>
                ) : (
                  <div
                    ref={imageScrollerRef}
                    className="flex h-[48dvh] w-full items-center justify-center overflow-hidden p-3"
                  >
                    <button
                      type="button"
                      onClick={() => setImageFullscreen(true)}
                      className="flex h-full w-full items-center justify-center"
                      aria-label={`全屏查看${selectedPoem.title}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedPoem.file}
                        alt={selectedPoem.title}
                        className="max-h-full max-w-full rounded-xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                      />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-3 flex min-h-0 flex-col gap-3 rounded-[1.25rem] border border-white/10 bg-black/10 p-3 text-white/70">
                <div>
                  <p className="text-[11px] tracking-[0.35em] text-white/35">题签</p>
                  <p className="mt-2 text-sm leading-6 text-white/75">{selectedPoem.note}</p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[11px] tracking-[0.35em] text-white/35">原文</p>
                  <PoemText
                    lines={selectedPoem.text}
                    className="mt-3 max-h-[28dvh] overflow-y-auto pr-2 text-sm leading-7 text-white/80"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pt-2">
                  {poems.map((poem, i) => {
                    const active = i === selected;

                    return (
                      <button
                        key={poem.title}
                        type="button"
                        onClick={() => setSelected(i)}
                        className={`h-20 w-16 shrink-0 overflow-hidden rounded-xl border transition ${
                          active
                            ? "border-white/60 ring-1 ring-white/30"
                            : "border-white/10 opacity-70 hover:opacity-100"
                        }`}
                        aria-label={`查看${poem.title}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={poem.file}
                          alt={poem.title}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="hidden min-h-0 flex-1 gap-5 overflow-hidden pr-0 lg:grid lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="relative flex min-h-[40vh] min-w-0 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-16 py-6">
                <button
                  type="button"
                  className="absolute left-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white transition hover:bg-black/55"
                  onClick={showPrevious}
                  aria-label="查看上一幅"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>

                <div
                  ref={imageScrollerRef}
                  className="h-full overflow-visible"
                >
                  <div className="flex h-full min-w-full items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setImageFullscreen(true)}
                      className="flex max-h-full max-w-full items-center justify-center"
                      aria-label={`全屏查看${selectedPoem.title}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedPoem.file}
                        alt={selectedPoem.title}
                        className="max-h-[calc(100vh-14rem)] max-w-full rounded-2xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                      />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="absolute right-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white transition hover:bg-black/55"
                  onClick={showNext}
                  aria-label="查看下一幅"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>

              <div className="flex min-h-0 flex-col gap-4 overflow-y-auto rounded-[1.5rem] border border-white/10 bg-black/10 p-4 text-white/70">
                <div>
                  <p className="text-[11px] tracking-[0.35em] text-white/35">题签</p>
                  <p className="mt-3 text-sm leading-7 text-white/75">{selectedPoem.note}</p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[11px] tracking-[0.35em] text-white/35">原文</p>
                  <PoemText
                    lines={selectedPoem.text}
                    className="mt-3 max-h-[34vh] overflow-y-auto pr-2 text-sm leading-7 text-white/80"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {poems.map((poem, i) => {
                    const active = i === selected;

                    return (
                      <button
                        key={poem.title}
                        type="button"
                        onClick={() => setSelected(i)}
                        className={`overflow-hidden rounded-2xl border transition ${
                          active
                            ? "border-white/60 ring-1 ring-white/30"
                            : "border-white/10 opacity-70 hover:opacity-100"
                        }`}
                        aria-label={`查看${poem.title}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={poem.file}
                          alt={poem.title}
                          className="aspect-[4/5] w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="mt-auto text-xs leading-6 tracking-[0.18em] text-white/35">
                  使用方向键切换，按 Esc 退出预览。
                </p>
              </div>
            </div>
          </div>

          {imageFullscreen && (
            <div
              className="fixed inset-0 z-[60] flex flex-col bg-black p-3 text-white lg:p-6"
              onClick={(event) => {
                event.stopPropagation();
                setImageFullscreen(false);
              }}
            >
              <div className="flex shrink-0 items-center justify-between gap-3 pb-3">
                <p className="truncate text-sm tracking-[0.22em] text-white/65">{selectedPoem.title}</p>
                <button
                type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setImageFullscreen(false);
                  }}
                  className="shrink-0 rounded-full border border-white/20 px-3 py-2 text-xs tracking-[0.18em] text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  关闭
                </button>
              </div>

              <button
                type="button"
                className="flex min-h-0 flex-1 items-center justify-center overflow-hidden"
                onClick={(event) => event.stopPropagation()}
                aria-label={`${selectedPoem.title}全屏图片`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPoem.file}
                  alt={selectedPoem.title}
                  className={`object-contain ${
                    selectedPoemIsWide
                      ? "h-auto max-h-none w-[calc(100dvh-5rem)] max-w-none rotate-90 lg:max-h-[calc(100vh-7rem)] lg:w-auto lg:max-w-full lg:rotate-0"
                      : "max-h-full max-w-full"
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
