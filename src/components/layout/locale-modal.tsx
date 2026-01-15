"use client";

import { Modal, Button } from "@heroui/react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const LOCALES = [
  { code: "es", label: "Español", flag: "🇨🇴" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export function LocaleModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const changeLocale = (locale: string) => {
    if (locale === currentLocale) return;

    const segments = pathname.split("/");
    segments[1] = locale; // /es/..., /en/...

    router.push(segments.join("/"));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Container className="rounded-sm" backdropClassName="bg-black/30 backdrop-blur-sm" placement="auto">
        <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger className="text-foreground"/>
            <Modal.Heading>
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">

                </Modal.Icon>
            <p className="text-lg font-semibold">Idioma</p>
            </Modal.Heading>
            <Modal.Body className="flex flex-col gap-2">
                {LOCALES.map((l) => (
                    <Button
                    key={l.code}
                    variant={l.code === currentLocale ? "primary" : "ghost"}
                    onClick={() => changeLocale(l.code)}
                    className="justify-start"
                    >
                    <span className="mr-2">{l.flag}</span>
                    {l.label}
                    </Button>
                ))}
            </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
}
