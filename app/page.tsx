"use client";

import useLocalStorage from "@/hooks/useLocalStorage";
import Navbar from "@/components/Navbar";
import Home from "@/components/Home";
import Tech from "@/components/Tech";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { useEffect, useState } from "react";

export default function App() {
  const [colorMode, setColorMode] = useLocalStorage("colorMode", "light");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (colorMode === "system") {
      // 如果是 system 模式，立即根据系统主题切换
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(isDarkMode ? "dark" : "light");
    } else {
      setTheme(colorMode); // 如果是 light 或 dark，直接应用
    }
  }, [colorMode]);

  return (
    <body className={theme}>
      <div className="-z-10 min-h-screen0 w-full bg-slate-100 dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-black dark:text-white ">
        <div className="flex flex-col items-center px-4 md:px-8 lg:px-16">
          <Navbar colorMode={colorMode} setColorMode={setColorMode} />
          <Home theme={theme} />
          <Tech />
          <Projects theme={theme} />
          <Contact />
        </div>
      </div>
    </body>
  );
}
