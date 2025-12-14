"use client";

import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {Moon, Sun, Monitor} from "lucide-react";
import {Button} from "@/components/ui/button";

import { Dropdown, Label } from "@heroui/react";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="small" isDisabled>
                <Sun className="size-5" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    return (
        <Dropdown>
            <Button variant="ghost" size="small">
                <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Dropdown.Popover>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setTheme("light")}>
                    <Sun className="size-4" />
                    <Label>Light</Label>
                    {theme === "light" && <span className="ml-auto text-xs">✓</span>}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setTheme("dark")}>
                        <Moon className="size-4" />
                        <Label>Dark</Label>
                        {theme === "dark" && <span className="ml-auto text-xs">✓</span>}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setTheme("system")}>
                        <Monitor className="size-4" />
                        <Label>System</Label>
                        {theme === "system" && <span className="ml-auto text-xs">✓</span>}
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}
