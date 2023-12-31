"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { Avatar } from "@nextui-org/avatar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Providers } from "./providers";

import { useEffect, useMemo, useState } from "react";
import Home from "@/components/Home";
import About from "@/components/About";
import useLocalStorage from "@/hooks/useLocalStorage";


export default function App() {
  const [currRouter, setCurrRouter] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  const currComp = useMemo(() => {
    if (currRouter == "home") {
      return <Home theme={theme}/>;
    } else {
      return <About />;
    }
  }, [currRouter, theme]);

  return (
    <body className={theme}>
      <Providers>
        <div className="flex flex-col h-screen">
          <Navbar className="dark:bg-black" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent className="sm:hidden dark:text-white" justify="start">
              <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              />
            </NavbarContent>
            <NavbarContent>
              <NavbarBrand className="gap-2">
                <Avatar src="/logo.png" size="sm" radius="full" />
                <p className="font-bold text-xl dark:text-white">尘雨尘风</p>
              </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-8" justify="center">
              <NavbarItem isActive={currRouter == "home"}>
                <Link
                  color={`${currRouter == "home" ? "primary" : "foreground"}`}
                  onPress={() => setCurrRouter("home")}
                  className="hover:cursor-pointer text-xl"
                >
                  首页
                </Link>
              </NavbarItem>
              <NavbarItem isActive={currRouter == "about"}>
                <Link
                  color={`${currRouter == "about" ? "primary" : "foreground"}`}
                  onPress={() => setCurrRouter("about")}
                  className="hover:cursor-pointer text-xl"
                >
                  关于
                </Link>
              </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
              <ThemeSwitcher theme={theme} setTheme={setTheme}/>
            </NavbarContent>
            <NavbarMenu>
              <NavbarMenuItem>
                <Link
                  color={`${currRouter == "home" ? "primary" : "foreground"}`}
                  onPress={() => {
                    setCurrRouter("home");
                    setIsMenuOpen(false);
                  }}
                  className="hover:cursor-pointer w-full text-xl"
                  size="lg"
                >
                  首页
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link
                  color={`${currRouter == "about" ? "primary" : "foreground"}`}
                  onPress={() => {
                    setCurrRouter("about");
                    setIsMenuOpen(false);
                  }}
                  className="hover:cursor-pointer w-full text-xl"
                  size="lg"
                >
                  关于
                </Link>
              </NavbarMenuItem>
            </NavbarMenu>
          </Navbar>
          <>{currComp}</>
        </div>
      </Providers>
    </body>
  );
}
