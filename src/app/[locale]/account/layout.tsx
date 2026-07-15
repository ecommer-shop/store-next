
import type { Metadata } from 'next';
import { noIndexRobots } from '@/lib/vendure/shared/metadata';
import { getTranslations } from 'next-intl/server';
import { I18N } from '@/i18n/keys';
import AccountSidebar, { NavItem } from './account-sidebar';

export const metadata: Metadata = {
    robots: noIndexRobots(),
};

type LayoutProps<T> = {
    children: React.ReactNode;
};

export default async function AccountLayout({ children }: LayoutProps<'/account'>) {
  const tr = await getTranslations('UserBar');

  const navItems: NavItem[] = [
    { href: '/account/orders', label: tr(I18N.UserBar.orders), icon: 'package' },
    { href: '/account/addresses', label: tr(I18N.UserBar.addresses), icon: 'mapPin' },
    { href: '/account/profile', label: tr(I18N.UserBar.profile), icon: 'user' },
  ];

  return (
    <div className="container mx-auto px-4 py-30">
      <div className="flex gap-8">
        <AccountSidebar navItems={navItems} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

