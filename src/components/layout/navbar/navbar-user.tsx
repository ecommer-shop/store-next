'use client';

import { useEffect, useState } from "react";
import { Button, Dropdown, Switch } from "@heroui/react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useClerk,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { SyncCustomer } from "@/lib/vendure/client/sync-customer";
import { useTranslations } from "next-intl";
import { I18N } from "@/i18n/keys";
import { useAuth } from "@/components/shared/useAuth";
import { auth } from "@clerk/nextjs/server";
import { Check, Globe, LogIn, Menu, Moon, Power, Sun, UserPlus } from "lucide-react";
import { ThemeModal } from "./theme-switcher/theme-switcher";
import { LocaleModal } from "../locale-modal";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter
} from "@heroui/drawer";

export function NavbarUser() {
  const { resolvedTheme, setTheme } = useTheme();
  const { signOut } = useClerk();
  const t = useTranslations("Layout");
  const [themeOpen, setThemeOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const { openSignIn, openSignUp } = useClerk();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* NO autenticado */}
      <SignedOut>
  {/* Botón hamburguesa */}
  <Button
    isIconOnly
    variant="ghost"
    aria-label="Menú"
    onPress={() => setSidebarOpen(true)}
  >
    <Menu className="size-5" />
  </Button>

  {/* Sidebar / Drawer */}
  <Drawer
    isOpen={sidebarOpen}
    placement="right"
    onOpenChange={setSidebarOpen}
    className="bg-black/30 backdrop-blur-sm"
  >
    <DrawerContent>
      {(onClose) => (
        <>
          <DrawerHeader className="flex items-center justify-between">
            <span className="text-lg font-semibold">Menú</span>
          </DrawerHeader>

          <DrawerBody className="flex flex-col gap-3">
            {/* Tema */}
            <Button
              variant="ghost"
              onPress={() => {
                onClose();
                setThemeOpen(true);
              }}
            >
              <Sun className="size-4" />Tema
            </Button>

            {/* Idioma */}
            <Button
              variant="ghost"
              onPress={() => {
                onClose();
                setLocaleOpen(true);
              }}
            >
              <Globe className="size-4" />Idioma
            </Button>

            {/* Sign In */}
            <Button
              variant="ghost"
              onPress={() => {
                onClose();
                openSignIn();
              }}
            >
              <LogIn className="size-4" />Iniciar sesión
            </Button>

            {/* Sign Up */}
            <Button
              variant="primary"
              onPress={() => {
                onClose();
                openSignUp();
              }}
            >
              <UserPlus className="size-4" />Registrarse
            </Button>
          </DrawerBody>
        </>
      )}
    </DrawerContent>
  </Drawer>

  {/* Modales */}
  <ThemeModal
    isOpen={themeOpen}
    onClose={() => setThemeOpen(false)}
  />

  <LocaleModal
    isOpen={localeOpen}
    onClose={() => setLocaleOpen(false)}
  />
</SignedOut>



      {/* Autenticado */}
      <SignedIn>
        <SyncCustomer/>
        <UserButton
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
            elements: {
              userButtonPopoverActionButton__manageAccount: "hidden!",
              userButtonPopoverActionButton__signOut: "hidden!",
            },
            variables: {
              borderRadius: "2px",
              colorBackground: resolvedTheme === "dark" ? "#12123F" : "#F1F1F1",
            },
          }}
          showName
        >
          <UserButton.MenuItems>
            <UserButton.Link
              label="Mi perfil"
              labelIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <path className="text-foreground" fill="currentColor" fillRule="evenodd" d="M7 6.5a2 2 0 1 0 0-4a2 2 0 0 0 0 4M7 8a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7m-.5 1.299c0-.43-.36-.774-.785-.724C2.473 8.955 0 10.728 0 12.5A2.5 2.5 0 0 0 2.5 15h3.25a.75.75 0 0 0 0-1.5H2.5a1 1 0 0 1-1-1c0-.205.22-.809 1.32-1.459c.765-.452 1.792-.813 2.969-.964c.397-.051.711-.378.711-.778m6.373 5.201l1.406-2.5l-1.406-2.5h-2.746L8.721 12l1.406 2.5zm2.713-1.765a1.5 1.5 0 0 0 0-1.47l-1.406-2.5A1.5 1.5 0 0 0 12.873 8h-2.746a1.5 1.5 0 0 0-1.307.765l-1.406 2.5a1.5 1.5 0 0 0 0 1.47l1.406 2.5a1.5 1.5 0 0 0 1.307.765h2.746a1.5 1.5 0 0 0 1.307-.765zM12.5 12a1 1 0 1 1-2 0a1 1 0 0 1 2 0" clipRule="evenodd" />
                </svg>
              }
              href="/account/profile"
            />
            <UserButton.Action
              label="Apariencia"
              labelIcon={<Moon className="size-4" />}
              onClick={() => setThemeOpen(true)}
            />

            <UserButton.Action
              label="Idioma"
              labelIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path
                    className="text-foreground"
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1M2.5 8c0-.8.15-1.56.43-2.26h2.52a14 14 0 0 1 0 4.52H2.93A5.5 5.5 0 0 1 2.5 8m3.2 3.76h2.6v2.38A5.52 5.52 0 0 1 5.7 11.76m2.6-1.5H5.7a12.6 12.6 0 0 1 0-4.52h2.6zm1.5 3.88v-2.38h2.6a5.52 5.52 0 0 1-2.6 2.38m2.97-3.88h-2.47a14 14 0 0 0 0-4.52h2.47c.28.7.43 1.46.43 2.26s-.15 1.56-.43 2.26m-2.97-6.4V3.86a5.52 5.52 0 0 1 2.6 2.38z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              onClick={() => setLocaleOpen(true)}
            />
            <UserButton.Link
              label="Mis pedidos"
              labelIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <path className="text-foreground" fill="currentColor" fillRule="evenodd" d="M13.5 10.421V5.475l-2 .714V8.25a.75.75 0 0 1-1.5 0V6.725l-2.25.804v6.088l4.777-1.792a1.5 1.5 0 0 0 .973-1.404m-2.254-5.734l1.6-.571a2 2 0 0 0-.175-.104L9.499 2.427a1.5 1.5 0 0 0-1.197-.063l-.941.353l3.724 1.862q.09.045.16.108M5.444 3.435l3.878 1.94l-2.273.811l-3.805-1.903q.108-.063.23-.109zm.806 4.029L2.5 5.589v5.057a1.5 1.5 0 0 0 .83 1.342l2.92 1.46zM1 5.579c0-.436.094-.856.266-1.236a.75.75 0 0 1 .2-.37c.342-.54.855-.968 1.48-1.203L7.777.96a3 3 0 0 1 2.394.125l3.172 1.586A3 3 0 0 1 15 5.354v5.067a3 3 0 0 1-1.947 2.809l-4.828 1.81a3 3 0 0 1-2.395-.125l-3.172-1.586A3 3 0 0 1 1 10.646z" clipRule="evenodd" />
                </svg>
              }
              href="/account/orders"
            />
            <UserButton.Link
              label="Direcciones"
              labelIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <path className="text-foreground" fill="currentColor" fillRule="evenodd" d="M3.125 7a4.875 4.875 0 1 1 9.75 0c0 1.864-.774 2.962-1.687 3.815c-.385.36-.765.65-1.17.958l-.365.28a9 9 0 0 0-.781.668c-.243.24-.535.575-.73 1.01a.34.34 0 0 1-.095.132l-.015.008s-.01.004-.032.004l-.032-.003l-.015-.009a.34.34 0 0 1-.095-.131a3.4 3.4 0 0 0-.73-1.01a9 9 0 0 0-.781-.668q-.187-.145-.366-.28a15 15 0 0 1-1.169-.96C3.9 9.963 3.125 8.865 3.125 7M14.5 7c0 3.4-2.066 4.975-3.53 6.091c-.634.485-1.156.882-1.345 1.305C9.355 15 8.788 15.5 8 15.5s-1.354-.5-1.625-1.104c-.19-.423-.71-.82-1.346-1.305C3.566 11.975 1.5 10.399 1.5 7a6.5 6.5 0 0 1 13 0m-5 0a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0M11 7a3 3 0 1 1-6 0a3 3 0 0 1 6 0" clipRule="evenodd" />
                </svg>
              }
              href="/account/addresses"
            />
            
            <UserButton.Action
              label="Cerrar Sesión"
              labelIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <path className="text-foreground" fill="currentColor" fillRule="evenodd" d="M14.78 7.47a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06l1.22-1.22H4.75a.75.75 0 0 1 0-1.5h7.69l-1.22-1.22a.75.75 0 0 1 1.06-1.06zM9.5 4.25a.75.75 0 0 1-1.5 0V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v8A1.5 1.5 0 0 0 4 13.5h2.5A1.5 1.5 0 0 0 8 12v-.25a.75.75 0 0 1 1.5 0V12a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h2.5a3 3 0 0 1 3 3z" clipRule="evenodd" />
                </svg>
              }
              onClick={() => signOut({ redirectUrl: "/" })}
            />
          </UserButton.MenuItems>
        </UserButton>
        <ThemeModal
          isOpen={themeOpen}
          onClose={() => setThemeOpen(false)}
        />
        <LocaleModal
          isOpen={localeOpen}
          onClose={() => setLocaleOpen(false)}
        />
      </SignedIn>
    </>
  );
}
