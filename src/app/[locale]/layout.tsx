export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import type { Metadata, Viewport } from "next";
import { GoogleTagManager } from '@next/third-parties/google';
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
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

const poppins = localFont({
  src: [
    { path: "../../../public/fonts/Poppins-Regular.ttf", weight: "400" },
    { path: "../../../public/fonts/Poppins-SemiBold.ttf", weight: "600" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const gilroy = localFont({
  src: [
    { path: "../../../public/fonts/Gilroy-Light.otf", weight: "300" },
    { path: "../../../public/fonts/Gilroy-ExtraBold.otf", weight: "800" },
  ],
  variable: "--font-gilroy",
  display: "swap",
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
      appearance={{
        layout: {
          logoImageUrl: `${SITE_URL}/logo-vendedores-dark.png`,
          logoLinkUrl: SITE_URL,
        },
        variables: {
          colorPrimary: '#9969F8',
          colorText: '#12123F',
          colorTextSecondary: '#6b7280',
          colorBackground: '#ffffff',
          colorInputBackground: '#f9f8ff',
          colorInputText: '#12123F',
          borderRadius: '0.75rem',
          fontFamily: 'var(--font-poppins, system-ui)',
        },
        elements: {
          card: {
            boxShadow: '0 8px 40px rgba(153,105,248,0.18)',
            border: '1px solid rgba(153,105,248,0.25)',
            borderRadius: '1.25rem',
          },
          headerTitle: {
            color: '#12123F',
            fontSize: '1.35rem',
            fontWeight: '800',
          },
          headerSubtitle: {
            color: '#6b7280',
          },
          socialButtonsBlockButton: {
            border: '1.5px solid rgba(153,105,248,0.3)',
            borderRadius: '0.75rem',
            color: '#12123F',
            '&:hover': {
              borderColor: '#9969F8',
              background: 'rgba(153,105,248,0.06)',
            },
          },
          dividerLine: { background: 'rgba(153,105,248,0.2)' },
          dividerText: { color: '#9ca3af' },
          formFieldLabel: {
            color: '#12123F',
            fontWeight: '600',
            fontSize: '0.8rem',
          },
          formFieldInput: {
            borderRadius: '0.625rem',
            border: '1.5px solid rgba(153,105,248,0.25)',
            background: '#f9f8ff',
            color: '#12123F',
            '&:focus': { borderColor: '#9969F8', boxShadow: '0 0 0 2px rgba(153,105,248,0.15)' },
          },
          formButtonPrimary: {
            background: 'linear-gradient(90deg, #6BB8FF 0%, #9969F8 100%)',
            borderRadius: '0.75rem',
            fontWeight: '700',
            fontSize: '0.95rem',
            boxShadow: '0 2px 12px rgba(153,105,248,0.3)',
            '&:hover': { opacity: '0.92', boxShadow: '0 4px 16px rgba(153,105,248,0.4)' },
          },
          footerActionLink: {
            color: '#9969F8',
            fontWeight: '600',
            '&:hover': { color: '#6BB8FF' },
          },
          identityPreviewText: { color: '#12123F' },
          identityPreviewEditButton: { color: '#9969F8' },
          logoBox: {
            justifyContent: 'center',
            height: '64px',
            marginBottom: '4px',
          },
          logoImage: {
            height: '64px',
            width: 'auto',
            maxWidth: '200px',
            objectFit: 'contain',
          },
        },
      }}
    >
      <html lang={locale} suppressHydrationWarning className="bg-[#121414]">
        <body className={`${gilroy.variable} ${poppins.variable} antialiased overflow-x-hidden`}>
          <Script id="consent-default" strategy="beforeInteractive">
              {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}

                  var isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

                  var storedConsent = null;
                  try {
                      storedConsent = localStorage.getItem('ecommer_cookie_consent');
                  } catch (e) {}

                  gtag('consent', 'default', {
                      ad_storage: isLocalhost ? 'granted' : 'denied',
                      ad_user_data: isLocalhost ? 'granted' : 'denied',
                      ad_personalization: isLocalhost ? 'granted' : 'denied',
                      analytics_storage: isLocalhost ? 'granted' : 'denied',
                      wait_for_update: 500
                  });

                  if (storedConsent === 'granted') {
                      gtag('consent', 'update', {
                          ad_storage: 'granted',
                          ad_user_data: 'granted',
                          ad_personalization: 'granted',
                          analytics_storage: 'granted'
                      });
                  }
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