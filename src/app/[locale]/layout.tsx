export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import type { Metadata, Viewport } from "next";
import { GoogleTagManager } from '@next/third-parties/google';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SITE_NAME, SITE_URL, buildCanonicalUrl } from "@/lib/vendure/shared/metadata";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
const clerkStorefrontFallbackUrl = buildCanonicalUrl(`/${routing.defaultLocale}`);
import { ReactNode } from "react";
import { enUS, esMX } from '@clerk/localizations'
import { getMessages } from "next-intl/server";
import { WompiScrollGuard } from "@/components/providers/wompi-scroll-guard";
import { Providers } from "@/components/providers/providers";
import Script from 'next/script';
import { ConsentBanner } from '@/components/providers/consent-banner';
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
    "Shop the best products at Ecommer. Quality products, competitive prices, and fast delivery.",
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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  return (
    <ClerkProvider
      dynamic
      afterSignOutUrl="/"
      localization={localClerk}
      signInFallbackRedirectUrl={clerkStorefrontFallbackUrl}
      signUpFallbackRedirectUrl={clerkStorefrontFallbackUrl}
    >
      <html lang={locale} suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
          <Script id="consent-default" strategy="beforeInteractive">
              {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('consent', 'default', {
                      ad_storage: 'denied',
                      ad_user_data: 'denied',
                      ad_personalization: 'denied',
                      analytics_storage: 'denied',
                      wait_for_update: 500
                  });
              `}
          </Script>
          {gtmId && <GoogleTagManager gtmId={gtmId} />}
          <Providers>
            <NextIntlClientProvider
                locale={locale}
                messages={messages}
              >
                <Toaster position="bottom-right" richColors />
                <WompiScrollGuard />
                <div className="flex flex-col min-h-screen overflow-x-hidden">
                  <Navbar />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                  <ChatWidget />
                </div>
                <ConsentBanner />
              </NextIntlClientProvider>
              <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}