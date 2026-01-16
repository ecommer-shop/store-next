"use client";

import { Modal, Button, Separator } from "@heroui/react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { useEffect } from "react";
import { I18N } from "@/i18n/keys";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string
};

const LOCALES = [
  { code: "es", label: "Español", flag: "🇨🇴" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export function LocaleModal({ isOpen, onClose, t }: Props) {
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

useEffect(() => {
  document.body.style.overflow = isOpen ? "hidden" : "";
  return () => {
    document.body.style.overflow = "";
  };
}, [isOpen]);


  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Container className="" backdropClassName="fixed inset-0 z-[9999]
      bg-black/30 backdrop-blur-sm" placement="center" style={
        {
          height: "100%"
        }
      }>
        <Modal.Dialog className="relative z-9999 sm:max-w-md rounded-md p-10
        backdrop-blur-sm 
        bg-primary-foreground/95 dark:bg-primary-foreground/95
        shadow-2xl shadow-[#12123F]/90
        dark:shadow-2xl dark:shadow-white/30">
            <Modal.CloseTrigger className="text-foreground items-center flex shrink-0 size-8"/>
            <Modal.Heading className="flex flex-row gap-3">
                <Modal.Icon className="block bg-accent-soft text-accent-soft-foreground">
                  <Globe className="size-8 text-foreground" />
                </Modal.Icon>
            <p className="text-lg font-semibold">{t(I18N.UserBar.langSwitcher.tittle)}</p>
            </Modal.Heading>
            <Modal.Body className="flex flex-col gap-2">
                {LOCALES.map((l) => (
                    <>
                    <Button
                    key={l.code}
                    variant={l.code === currentLocale ? "primary" : "primary"}
                    onClick={() => changeLocale(l.code)}
                    className="justify-start"
                    >
                    <span className="mr-2">{l.flag}</span>
                    {l.label}
                    </Button>
                    <Separator orientation="horizontal" className="bg-primary opacity-50"/>
                    </>
                ))}
            </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
}
