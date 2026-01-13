"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Dropdown, Label, Button, Popover } from "@heroui/react";
function checkIcon() {
  return(
    <div className="pl-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <path className="text-foreground" fill="currentColor" fillRule="evenodd" d="M13.488 3.43a.75.75 0 0 1 .081 1.058l-6 7a.75.75 0 0 1-1.1.042l-3.5-3.5A.75.75 0 0 1 4.03 6.97l2.928 2.927l5.473-6.385a.75.75 0 0 1 1.057-.081" clipRule="evenodd" />
      </svg>
    </div>
  )
}
export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const ignoreNextAction = useRef(false);

  useEffect(() => {
  if (!open) return;

  const close = () => setOpen(false);

  // scroll real (no burbujea)
  document.addEventListener("scroll", close, true);

  // mouse wheel
  window.addEventListener("wheel", close, { passive: true });

  // mobile
  window.addEventListener("touchmove", close, { passive: true });

  // resize
  window.addEventListener("resize", close);

  return () => {
    document.removeEventListener("scroll", close, true);
    window.removeEventListener("wheel", close);
    window.removeEventListener("touchmove", close);
    window.removeEventListener("resize", close);
  };
}, [open]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (value: "light" | "dark" | "system") => {
    if (ignoreNextAction.current) {
      ignoreNextAction.current = false;
      return;
    }

    setTheme(value);
    setOpen(false);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="lg" isDisabled>
        <Sun className="size-5" />
      </Button>
    );
  }

  return (
    <Popover
      isOpen={open}
      onOpenChange={setOpen}
    >
      <Popover.Trigger>
        <Button
          variant="primary"
          
          size="lg"
          aria-expanded={open}
          className="
            relative
            inline-flex
            items-center
            justify-center
            w-5
            h-5
            rounded-md
            transition-colors"
        >
          <Sun className="absolute size-5 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-5 transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
        </Button>
      </Popover.Trigger>

      
      <Popover.Content className="rounded-sm  top-16 right-4 w-50" placement="right bottom"
        onPointerDownCapture={(e) => {
        e.stopPropagation();
      }}>
        <Popover.Arrow />
        <Popover.Dialog className="flex flex-col col-span-7 gap-3 sticky h-full">
          <Popover.Heading className="flex pt-2 cursor-pointer" onClick={() => handleChange("light")}>
            <Sun className="size-4" />
            <Label className="pl-2 cursor-pointer">Claro</Label>
            {theme === "light" && checkIcon()}
            <Dropdown.ItemIndicator />
          </Popover.Heading>

          <Popover.Heading className="flex pt-2 cursor-pointer" onClick={() => handleChange("dark")}>
            <Moon className="size-4" />
            <Label className="pl-2 cursor-pointer">Oscuro</Label>
            {theme === "dark" && checkIcon()}
            
          </Popover.Heading>

          <Popover.Heading className="flex pt-2 pb-2 cursor-pointer" onClick={() => handleChange("system")}>
            <Monitor className="size-4" />
            <Label className="pl-2 cursor-pointer">Sistema</Label>
              {theme === "system" && checkIcon()}
          </Popover.Heading>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
