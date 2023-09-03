"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { NavbarItem } from "@nextui-org/navbar";
import { Switch } from "@nextui-org/switch";
import { MoonIcon, SunIcon } from "@/components/Icons";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { isDarkmode, setIsDarkmode } = useMemo(() => {
    return {
      isDarkmode: theme == "dark",
      setIsDarkmode: () => {
        theme == "dark" ? setTheme("light") : setTheme("dark");
      },
    };
  }, [theme, setTheme]);

  if (!mounted) return null;

  return (
    <NavbarItem>
      <Switch
        isSelected={isDarkmode}
        onValueChange={setIsDarkmode}
        size="lg"
        color="success"
        thumbIcon={() => (isDarkmode ? <MoonIcon /> : <SunIcon />)}
      />
    </NavbarItem>
  );
}
