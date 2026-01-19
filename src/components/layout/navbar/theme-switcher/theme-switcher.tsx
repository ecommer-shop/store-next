"use client";

import { I18N } from "@/i18n/keys";
import { Modal, ModalHeader, ModalBody, Button, Separator } from "@heroui/react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

interface Props{
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
};

export function ThemeModal({ isOpen, onClose, t }: Props) {
  const { theme, setTheme } = useTheme();

  const select = (value: "light" | "dark" | "system") => {
    setTheme(value);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Backdrop variant="blur" className="containerModal bg-black/30 backdrop-blur-sm" style={
        {
          height: "100%"
        }
      }>
        <Modal.Container placement="center" >
          <Modal.Dialog className="relative z-9999 sm:max-w-md rounded-md w-90 p-10
          backdrop-blur-sm
          bg-primary-foreground/95 dark:bg-primary-foreground/95
          shadow-2xl shadow-[#12123F]/90
          dark:shadow-2xl dark:shadow-white/30">
            <Modal.CloseTrigger className="text-foreground items-center flex shrink-0 size-8"/>
            <Modal.Heading className="flex flex-row gap-3">
                    <Modal.Icon className="block bg-accent-soft text-accent-soft-foreground">
                      <Sun className="size-8 text-foreground" />
                    </Modal.Icon>
              <p className="text-lg font-semibold">{t(I18N.UserBar.themeSwitcher.subtittle)}</p>
            </Modal.Heading>

            <ModalBody className="flex flex-col gap-3 text-foreground">
              <Button onClick={() => select("light")} className="flex gap-2">
                <Sun /> <p className="text-lg font-semibold">{t(I18N.UserBar.themeSwitcher.light)}</p> {theme === "light" && "✓"}
              </Button>
              <Separator orientation="horizontal" className="bg-primary opacity-50"/>
              <Button onClick={() => select("dark")} className="flex gap-2">
                <Moon /> <p className="text-lg font-semibold">{t(I18N.UserBar.themeSwitcher.dark)}</p> {theme === "dark" && "✓"}
              </Button>
              <Separator orientation="horizontal" className="bg-primary opacity-50"/>
              <Button onClick={() => select("system")} className="flex gap-2">
                <Monitor /> <p className="text-lg font-semibold">{t(I18N.UserBar.themeSwitcher.system)}</p> {theme === "system" && "✓"}
              </Button>
              <Separator orientation="horizontal" className="bg-primary opacity-50"/>
            </ModalBody>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
