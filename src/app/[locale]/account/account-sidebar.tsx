"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@heroui/react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from '@heroui/drawer';
import {
  Package,
  MapPin,
  User,
  CreditCard,
  Menu,
  X,
  Store,
} from "lucide-react";

const iconMap = {
  package: Package,
  mapPin: MapPin,
  user: User,
  creditCard: CreditCard,
};

type IconKey = keyof typeof iconMap;

export type NavItem = {
  href: string;
  label: string;
  icon: IconKey;
};

export default function AccountSidebar({
  navItems,
  sellersUrl,
}: {
  navItems: NavItem[];
  sellersUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname.endsWith(href) || pathname.includes(href + '/');

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(href)
        ? 'bg-gradient-to-r from-[#9969F8] to-[#6BB8FF] text-white shadow-md shadow-[#9969F8]/25'
        : 'text-[#12123F]/70 dark:text-foreground/70 hover:text-[#12123F] dark:hover:text-foreground hover:bg-[#9969F8]/10'
    }`;

  const iconClass = (href: string) =>
    `h-4 w-4 shrink-0 ${isActive(href) ? 'text-white' : 'text-[#9969F8]'}`;

  return (
    <>
      {/* Mobile toggle */}
      <div className="sm:hidden mb-4">
        <Button
          isIconOnly
          variant="ghost"
          onPress={() => setOpen(true)}
          aria-label="Open menu"
          className="border border-[#9969F8]/40 text-[#9969F8]"
        >
          <Menu className="size-5" />
        </Button>
      </div>

      {/* Desktop aside */}
      <aside className="hidden sm:flex flex-col w-56 shrink-0 gap-2">
        {/* section label */}
        <div className="mb-4 px-3">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#9969F8] mb-1">
            MI CUENTA
          </p>
          <div className="h-px bg-gradient-to-r from-[#9969F8]/60 to-transparent" />
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                <Icon className={iconClass(item.href)} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sellers CTA */}
        {sellersUrl && (
          <div className="mt-6 px-1">
            <div className="h-px bg-gradient-to-r from-[#9969F8]/30 to-transparent mb-4" />
            <a
              href={sellersUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#9969F8]/30"
              style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}
            >
              <Store className="h-4 w-4 shrink-0" />
              Quiero vender
            </a>
          </div>
        )}
      </aside>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={open}
        placement="left"
        onOpenChange={setOpen}
        className="bg-background backdrop-blur-sm shadow-2xl dark:shadow-[#9969F8]/20"
        backdrop="blur"
        closeButton={<br />}
        motionProps={{
          variants: {
            enter: { opacity: 1, x: 0, transitionDuration: 0.3 },
            exit: { x: -100, opacity: 0, transitionDuration: 0.3 },
          },
        }}
      >
        <DrawerContent className="w-[260px] max-w-[80vw]">
          {(onClose) => (
            <>
              <DrawerHeader className="flex items-center justify-between pb-4 border-b border-[#9969F8]/20">
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#9969F8]">
                    MI CUENTA
                  </p>
                  <span className="text-lg font-semibold text-foreground">Menú</span>
                </div>
                <Button
                  variant="ghost"
                  isIconOnly
                  className="text-muted-foreground hover:text-[#9969F8]"
                  onClick={() => onClose()}
                  onPress={() => onClose()}
                >
                  <X className="size-5" />
                </Button>
              </DrawerHeader>

              <DrawerBody className="flex flex-col gap-1 p-4">
                {navItems.map((item) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onClose()}
                      className={linkClass(item.href)}
                    >
                      <Icon className={iconClass(item.href)} />
                      {item.label}
                    </Link>
                  );
                })}

                {/* Sellers CTA in drawer */}
                {sellersUrl && (
                  <div className="mt-4 pt-4 border-t border-[#9969F8]/20">
                    <a
                      href={sellersUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onClose()}
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}
                    >
                      <Store className="h-4 w-4 shrink-0" />
                      Quiero vender
                    </a>
                  </div>
                )}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
