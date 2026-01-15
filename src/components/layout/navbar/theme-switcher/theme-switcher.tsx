"use client";

import { Modal, ModalHeader, ModalBody } from "@heroui/react";
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
      <Modal.Container backdropClassName="bg-black/30 backdrop-blur-sm">
        <ModalHeader>Cambiar tema</ModalHeader>

        <ModalBody className="flex flex-col gap-3 text-foreground">
          <button onClick={() => select("light")} className="flex gap-2">
            <Sun /> Claro {theme === "light" && "✓"}
          </button>

          <button onClick={() => select("dark")} className="flex gap-2">
            <Moon /> Oscuro {theme === "dark" && "✓"}
          </button>

          <button onClick={() => select("system")} className="flex gap-2">
            <Monitor /> Sistema {theme === "system" && "✓"}
          </button>
        </ModalBody>
      </Modal.Container>
    </Modal>
  );
}
