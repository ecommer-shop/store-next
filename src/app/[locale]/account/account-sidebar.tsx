"use client";

import React, { useState } from 'react';
import Link from 'next/link';
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
  Menu,
  X,
} from "lucide-react";

const iconMap = {
  package: Package,
  mapPin: MapPin,
  user: User,
};

type IconKey = keyof typeof iconMap;

export type NavItem = {
  href: string;
  label: string;
  icon: IconKey;
};

export default function AccountSidebar({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Mobile toggle */}
      <div className="sm:hidden mb-4">
        <Button isIconOnly variant="ghost" onPress={() => setOpen(true)} aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </div>

      {/* Desktop aside */}
      <aside className="hidden sm:block w-64 shrink-0">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <Button key={item.href} className="w-full text-left">
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors w-full"
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={open}
        placement="left"
        onOpenChange={setOpen}
        className="bg-primary-foreground/90 dark:bg-primary-foreground/90 backdrop-blur-sm shadow-2xl dark:shadow-white/30 text-2xl"
        backdrop="blur"
        closeButton={<br />}
        motionProps={{
          variants: {
            enter: { opacity: 1, x: 0, transitionDuration: 0.3 },
            exit: { x: 100, opacity: 0, transitionDuration: 0.3 },
          },
        }}
      >
        <DrawerContent className="w-[280px] max-w-[80vw]">
          {(onClose) => (
            <>
              <DrawerHeader className="flex items-center justify-between">
                <span className="text-2xl font-semibold">Cuenta</span>
                <Button variant="danger-soft" className="text-2xl mr-3" onClick={() => onClose()} onPress={() => onClose()}>
                  <X />
                </Button>
              </DrawerHeader>

              <DrawerBody className="flex flex-col gap-3 p-4">
                {navItems.map((item) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <Button key={item.href} variant="ghost" className="justify-start" onPress={() => onClose()}>
                      <Link href={item.href} className="flex items-center gap-3 px-2 py-2 text-base w-full">
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
