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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path fill="#12123f" fillRule="evenodd" d="M7.199 2H8.8a.2.2 0 0 1 .2.2c0 1.808 1.958 2.939 3.524 2.034a.2.2 0 0 1 .271.073l.802 1.388a.2.2 0 0 1-.073.272c-1.566.904-1.566 3.164 0 4.069a.2.2 0 0 1 .073.271l-.802 1.388a.2.2 0 0 1-.271.073C10.958 10.863 9 11.993 9 13.8a.2.2 0 0 1-.199.2H7.2a.2.2 0 0 1-.2-.2c0-1.808-1.958-2.938-3.524-2.034a.2.2 0 0 1-.272-.073l-.8-1.388a.2.2 0 0 1 .072-.271c1.566-.905 1.566-3.165 0-4.07a.2.2 0 0 1-.073-.27l.801-1.389a.2.2 0 0 1 .272-.072C5.042 5.138 7 4.007 7 2.199c0-.11.089-.199.199-.199M5.5 2.2c0-.94.76-1.7 1.699-1.7H8.8c.94 0 1.7.76 1.7 1.7a.85.85 0 0 0 1.274.735a1.7 1.7 0 0 1 2.32.622l.802 1.388c.469.813.19 1.851-.622 2.32a.85.85 0 0 0 0 1.472a1.7 1.7 0 0 1 .622 2.32l-.802 1.388a1.7 1.7 0 0 1-2.32.622a.85.85 0 0 0-1.274.735c0 .939-.76 1.7-1.699 1.7H7.2a1.7 1.7 0 0 1-1.699-1.7a.85.85 0 0 0-1.274-.735a1.7 1.7 0 0 1-2.32-.622l-.802-1.388a1.7 1.7 0 0 1 .622-2.32a.85.85 0 0 0 0-1.471a1.7 1.7 0 0 1-.622-2.32l.801-1.389a1.7 1.7 0 0 1 2.32-.622A.85.85 0 0 0 5.5 2.2m4 5.8a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0M11 8a3 3 0 1 1-6 0a3 3 0 0 1 6 0" clipRule="evenodd" />
          </svg>
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
