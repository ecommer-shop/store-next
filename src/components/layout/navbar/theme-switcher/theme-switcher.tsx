"use client";

import { Modal, ModalHeader, ModalBody, Button, Separator } from "@heroui/react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function ThemeModal({ isOpen, onClose }: Props) {
  const { theme, setTheme } = useTheme();

  const select = (value: "light" | "dark" | "system") => {
    setTheme(value);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Container backdropClassName="bg-black/30 backdrop-blur-sm" style={
          {
            height: "100%"
          }
        }>
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
            <p className="text-lg font-semibold">Cambiar tema</p>
          </Modal.Heading>

          <ModalBody className="flex flex-col gap-3 text-foreground">
            <Button onClick={() => select("light")} className="flex gap-2">
              <Sun /> <p className="text-lg font-semibold">Claro</p> {theme === "light" && "✓"}
            </Button>
            <Separator orientation="horizontal" className="bg-primary opacity-50"/>
            <Button onClick={() => select("dark")} className="flex gap-2">
              <Moon /> <p className="text-lg font-semibold">Oscuro</p> {theme === "dark" && "✓"}
            </Button>
            <Separator orientation="horizontal" className="bg-primary opacity-50"/>
            <Button onClick={() => select("system")} className="flex gap-2">
              <Monitor /> <p className="text-lg font-semibold">Sistema</p> {theme === "system" && "✓"}
            </Button>
            <Separator orientation="horizontal" className="bg-primary opacity-50"/>
          </ModalBody>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
}
