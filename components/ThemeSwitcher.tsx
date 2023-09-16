"use client";

import { NavbarItem } from "@nextui-org/navbar";
import { Switch } from "@nextui-org/switch";
import { MoonIcon, SunIcon } from "@/components/Icons";

export function ThemeSwitcher({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) {

  function handleThemeChange() {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  return (
    <NavbarItem>
      <Switch
        isSelected={theme === "dark"}
        onValueChange={handleThemeChange}
        size="lg"
        color="success"
        thumbIcon={() => (theme === "dark" ? <MoonIcon /> : <SunIcon />)}
      />
    </NavbarItem>
  );
}
