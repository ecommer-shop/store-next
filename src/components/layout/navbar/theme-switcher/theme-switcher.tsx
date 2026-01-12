"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Dropdown, Label, Button } from "@heroui/react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" isDisabled={mounted}>
        <Sun className="size-5" />
      </Button>
    );
  }

  const handleChange = (value: "light" | "dark" | "system") => {
    setTheme(value);
    setOpen(false); 
  };

  return (
    <Dropdown trigger="press" isOpen={open} onOpenChange={setOpen}>
      
      <Dropdown.Trigger className="
            relative
            inline-flex
            items-center
            justify-center
            w-9
            h-9
            rounded-md
            transition-colors
      ">
          <Sun
                className="
                absolute
                size-5
                transition-all
                rotate-0
                scale-100
                dark:-rotate-90
                dark:scale-0
                "
            />
            
            <Moon
                className="
                absolute
                size-5
                transition-all
                rotate-90
                scale-0
                dark:rotate-0
                dark:scale-100
                "
            />
          <span className="sr-only">Cambiar tema</span>
        </Dropdown.Trigger>
      

      <Dropdown.Popover className="rounded-sm">
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleChange("light")}>
            <Sun className="size-4" />
            <Label>Claro</Label>
            {theme === "light" && <span className="ml-auto text-xs">✓</span>}
          </Dropdown.Item>

          <Dropdown.Item onClick={() => handleChange("dark")}>
            <Moon className="size-4" />
            <Label>Oscuro</Label>
            {theme === "dark" && <span className="ml-auto text-xs">✓</span>}
          </Dropdown.Item>

          <Dropdown.Item onClick={() => handleChange("system")}>
            <Monitor className="size-4" />
            <Label>Sistema</Label>
            {theme === "system" && <span className="ml-auto text-xs">✓</span>}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
