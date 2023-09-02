"use client"

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from "@nextui-org/navbar"
import {Link} from "@nextui-org/link"
import { Avatar } from "@nextui-org/avatar"
import { Switch } from "@nextui-org/switch"
import { MoonIcon } from "./MoonIcon"
import { SunIcon } from "./SunIcon"
import { useMemo, useState } from "react"
import Home from "@/components/Home"
import About from "@/components/About"

export default function App() {
  const [isDarkmode, setIsDarkmode] = useState(false)
  const [currRouter, setCurrRouter] = useState("home")

  const currComp = useMemo(() => {
    if (currRouter == "home") {
      return <Home isDarkmode={isDarkmode}/>
    } else {
      return <About />
    }
  }, [currRouter, isDarkmode])

  return (
    <main className={`${isDarkmode ? "dark" : "light" }`}>
      <Navbar className="dark:bg-black">
        <NavbarBrand className="gap-2">
          <Avatar src="/logo.png" size="sm" radius="full"/>
          <p className="font-bold text-xl dark:text-white">尘雨尘风</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-8" justify="center">
          <NavbarItem isActive={currRouter == "home"}>
            <Link color={`${currRouter == "home" ? "primary" : "foreground"}`} onPress={() => setCurrRouter("home")} className="hover:cursor-pointer">
              首页
            </Link>
          </NavbarItem>
          <NavbarItem isActive={currRouter == "about"}>
            <Link color={`${currRouter == "about" ? "primary" : "foreground"}`} onPress={() => setCurrRouter("about")} className="hover:cursor-pointer">
              关于
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Switch
              isSelected={isDarkmode}
              onValueChange={setIsDarkmode}
              size="lg"
              color="success"
              thumbIcon={() => (isDarkmode ? <MoonIcon /> : <SunIcon />)}
            ></Switch>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <>
        {currComp}
      </>
    </main>
  );
}
