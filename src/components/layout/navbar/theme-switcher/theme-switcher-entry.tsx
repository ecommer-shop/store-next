"use client";

import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";

export function ThemeSwitcherEntry() {
    const pathname = usePathname();

    return <ThemeSwitcher key={pathname}/>
}