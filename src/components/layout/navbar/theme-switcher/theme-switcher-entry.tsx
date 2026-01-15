"use client";

import { usePathname } from "next/navigation";
import { ThemeModal } from "./theme-switcher";

export function ThemeSwitcherEntry() {
    const pathname = usePathname();

    return <ThemeModal key={pathname} isOpen={false} onClose={() => {}}/>
}