import type {Metadata} from 'next';
import Link from 'next/link';
import {Package, User, MapPin} from 'lucide-react';
import {noIndexRobots} from '@/lib/vendure/shared/metadata';
import { Button } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { I18N } from '@/i18n/keys';

export const metadata: Metadata = {
    robots: noIndexRobots(),
};

const t = async () => {
    const tr = await getTranslations('UserBar')

    return{
        labelOrder: tr(I18N.UserBar.orders),
        labelAddresses: tr(I18N.UserBar.addresses),
        labelProfile: tr(I18N.UserBar.profile)
    }
}

const navItems = [
    {href: '/account/orders', label: (await t()).labelOrder, icon: Package},
    {href: '/account/addresses', label: (await t()).labelAddresses, icon: MapPin},
    {href: '/account/profile', label: (await t()).labelProfile, icon: User},
];
type LayoutProps<T> = {
    children: React.ReactNode;
};

export default async function AccountLayout({children}: LayoutProps<'/account'>) {
    return (
        <div className="container mx-auto px-4 py-30">
            <div className="flex gap-8">
                <aside className="w-64 shrink-0">
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Button key={item.href}>
                                <Link
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors"
                            >
                                <item.icon className="h-5 w-5"/>
                                {item.label}
                            </Link> 
                            </Button>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
