"use client";

import { useState } from "react";
import { BiLaptop, BiMenu, BiMoon, BiSun, BiX } from "react-icons/bi";
import { motion } from "framer-motion";

const NavbarItems = () => {
  return (
    <>
      <a
        href="#home"
        className="cursor-pointer text-xl font-semibold opacity-70 transition-all duration-300 hover:opacity-100"
      >
        <li>首页</li>
      </a>
      <a
        href="#tech"
        className="cursor-pointer text-xl font-semibold opacity-70 transition-all duration-300 hover:opacity-100"
      >
        <li>技术</li>
      </a>
      <a
        href="#projects"
        className="cursor-pointer text-xl font-semibold opacity-70 transition-all duration-300 hover:opacity-100"
      >
        <li>项目</li>
      </a>
      <a
        href="#contact"
        className="cursor-pointer text-xl font-semibold opacity-70 transition-all duration-300 hover:opacity-100"
      >
        <li>联系</li>
      </a>
    </>
  );
};

const ThemeSwitch = ({
  colorMode,
  setColorMode,
}: {
  colorMode: string;
  setColorMode: (colorMode: string) => void;
}) => {
  return (
    <>
      <motion.button
        whileHover={{ rotate: 360 }}
        whileTap={{ scale: 0.9, opacity: 0.8 }}
        transition={{ duration: 0.3, ease: "linear", type: "tween" }}
        className={`rounded-full p-1 transition-all ${
          colorMode === "light"
            ? "bg-blue-600/50"
            : "hover:bg-gray-300/50 dark:hover:bg-neutral-700/50"
        }`}
        onClick={() => setColorMode("light")}
      >
        <BiSun className="text-2xl" />
      </motion.button>
      <motion.button
        whileHover={{ rotate: 360 }}
        whileTap={{ scale: 0.9, opacity: 0.8 }}
        transition={{ duration: 0.3, ease: "linear", type: "tween" }}
        className={`rounded-full p-1 transition-all ${
          colorMode === "dark"
            ? "bg-purple-800/50"
            : "hover:bg-gray-300/50 dark:hover:bg-neutral-700/50"
        }`}
        onClick={() => setColorMode("dark")}
      >
        <BiMoon className="text-2xl" />
      </motion.button>
      <motion.button
        whileHover={{ rotate: 360 }}
        whileTap={{ scale: 0.9, opacity: 0.8 }}
        transition={{ duration: 0.3, ease: "linear", type: "tween" }}
        className={`rounded-full p-1 transition-all duration-100 ${
          colorMode === "system"
            ? "bg-blue-600/50 dark:bg-purple-800/50"
            : "hover:bg-gray-300/50 dark:hover:bg-neutral-700/50"
        }`}
        onClick={() => setColorMode("system")}
      >
        <BiLaptop className="text-2xl" />
      </motion.button>
    </>
  );
};

export default function Navbar({
  colorMode,
  setColorMode,
}: {
  colorMode: string;
  setColorMode: (colorMode: string) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="fixed top-6 z-10 flex w-[90%] md:w-[691px] lg:w-[900px] items-center justify-between rounded-full dark:bg-neutral-700/70 dark:border-neutral-900 border border-gray-300 bg-white/70 px-5 py-3 backdrop-blur-md md:justify-between shadow-md shadow-gray-200 dark:shadow-none transition-all duration-300">
        <a href="#home" className="cursor-pointer flex gap-2 items-center">
          <span className="opacity-80 text-2xl font-semibold transition-all duration-300 hover:opacity-100">
          陈华杰
          </span>
        </a>
        <ul className="hidden md:flex gap-10 ">
          <NavbarItems />
        </ul>
        <div className="hidden md:flex md:items-center md:justify-evenly rounded-full overflow-hidden p-1 gap-2 bg-gray-200/50 dark:bg-neutral-800/50 shadow-inner">
          <ThemeSwitch colorMode={colorMode} setColorMode={setColorMode} />
        </div>

        {!isMenuOpen && (
          <BiMenu className="block md:hidden text-3xl" onClick={toggleMenu} />
        )}
      </nav>
      {isMenuOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          className={`fixed right-0 top-0 flex w-1/2 rounded-3xl flex-col items-start justify-start gap-10 dakr:border-neutral-900 p-12 z-20 m-2 bg-slate-200/70 dark:bg-neutral-900/70 backdrop-blur-md ${
            isMenuOpen ? "flex" : "hidden"
          }`}
        >
          <BiX className="self-end block text-3xl z-30" onClick={toggleMenu} />
          <ul className="flex flex-col gap-8">
            <NavbarItems />
          </ul>
          <div className="flex items-center justify-evenly rounded-full overflow-hidden p-1 gap-2 bg-gray-200/50 dark:bg-neutral-800/50 shadow-inner">
            <ThemeSwitch colorMode={colorMode} setColorMode={setColorMode} />
          </div>
        </motion.div>
      )}
    </>
  );
}
