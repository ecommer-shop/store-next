export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SITE_NAME, SITE_URL } from "@/lib/vendure/shared/metadata";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ReactNode } from "react";
import { enUS, esMX } from '@clerk/localizations'
import { getMessages } from "next-intl/server";
import { useTheme } from "next-themes";
import { ThemeVariables } from "@/components/providers/theme-variables";
import { WompiScrollGuard } from "@/components/providers/wompi-scroll-guard";
import { toast } from "sonner";
import { Providers } from "@/components/providers/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Shop the best products at Vendure Store. Quality products, competitive prices, and fast delivery.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/logo-dark.webp",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo-light.webp",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F1F1F1" },
    { media: "(prefers-color-scheme: dark)", color: "#12123F" },
  ],
};

type Props<T> = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const localClerk = locale === 'es' ? esMX : enUS;
  const messages = await getMessages();
  return (
    <ClerkProvider dynamic afterSignOutUrl="/" localization={localClerk}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Providers>
            <NextIntlClientProvider
                locale={locale}
                messages={messages}
              >
                <Toaster position="bottom-right" richColors />
                <WompiScrollGuard />
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </NextIntlClientProvider>
              <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
