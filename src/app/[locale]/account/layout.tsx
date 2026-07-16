import type { Metadata } from 'next';
import { noIndexRobots } from '@/lib/vendure/shared/metadata';
import { getTranslations } from 'next-intl/server';
import { I18N } from '@/i18n/keys';
import AccountSidebar, { NavItem } from './account-sidebar';
import { getSellersLandingUrl } from '@/lib/sellers-landing-url';

export const metadata: Metadata = {
    robots: noIndexRobots(),
};

type LayoutProps<T> = {
    children: React.ReactNode;
};

export default async function AccountLayout({ children }: LayoutProps<'/account'>) {
  const tr = await getTranslations('UserBar');
  const sellersUrl = getSellersLandingUrl();

  const navItems: NavItem[] = [
    { href: '/account/orders', label: tr(I18N.UserBar.orders), icon: 'package' },
    { href: '/account/addresses', label: tr(I18N.UserBar.addresses), icon: 'mapPin' },
    { href: '/account/profile', label: tr(I18N.UserBar.profile), icon: 'user' },
  ];

  return (
    <div className={[
      "min-h-screen",
      // light: soft lavender-white gradient
      "bg-gradient-to-br from-[#f3f0ff] via-[#eef2ff] to-[#f8f7ff]",
      // dark: deep navy gradient
      "dark:from-[#07070f] dark:via-[#0f0f2e] dark:to-[#160830]",
    ].join(" ")}>

      {/* decorative blobs — lighter in light mode, vivid in dark */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-30 dark:opacity-20"
          style={{ background: 'radial-gradient(circle, #9969F8, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -right-24 w-[320px] h-[320px] rounded-full blur-3xl opacity-20 dark:opacity-10"
          style={{ background: 'radial-gradient(circle, #6BB8FF, transparent 70%)' }}
        />
      </div>

      <div className="relative container mx-auto px-4 pt-20 pb-16">

        {/* page header */}
        <div className="mb-6">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-1 text-[#9969F8]">
            PANEL DE USUARIO
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#12123F] dark:text-white">
            Mi cuenta
          </h1>
        </div>

        {/* Mobile: nav tabs strip (visible only on mobile) */}
        <div className="sm:hidden flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          <AccountSidebar navItems={navItems} sellersUrl={sellersUrl} />
        </div>

        {/* layout: sidebar + content */}
        <div className="flex gap-6 items-start">
          {/* Desktop sidebar only */}
          <div className="hidden sm:block">
            <AccountSidebar navItems={navItems} sellersUrl={sellersUrl} />
          </div>

          {/* main content card */}
          <main className="flex-1 min-w-0">
            <div className="relative rounded-2xl overflow-hidden">
              {/* glow border overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#9969F8]/20 via-transparent to-[#6BB8FF]/10 pointer-events-none" />
              {/* card surface: white in light, translucent dark in dark */}
              <div className="relative bg-white/90 dark:bg-white/[0.03] backdrop-blur-md border border-[#9969F8]/20 dark:border-white/10 rounded-2xl shadow-xl shadow-[#9969F8]/5 dark:shadow-none">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
