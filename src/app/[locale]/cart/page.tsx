import type {Metadata} from 'next';
import {Cart} from "@/app/[locale]/cart/cart";
import {Suspense} from "react";
import {CartSkeleton} from "@/components/shared/skeletons/cart-skeleton";
import {noIndexRobots} from '@/lib/vendure/shared/metadata';
import { getTranslations } from 'next-intl/server';
import { I18N } from '@/i18n/keys';
import { CartProviders } from './cart-providers';

export const metadata: Metadata = {
    title: 'Shopping Cart',
    description: 'Review items in your shopping cart.',
    robots: noIndexRobots(),
};

interface PageProps<T> {
    params: {
        locale: string;
    };
    searchParams: Record<string, string | string[] | undefined>;
}

export default async function CartPage(_props: PageProps<'/cart'>) {
    const t = await getTranslations('Cart');
    
    return (
        <CartProviders>
            <div className="container mx-auto px-4 py-6 sm:py-20">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t(I18N.Cart.title)}</h1>
                <p className="text-sm text-muted-foreground mb-6">{t(I18N.Cart.subtitle)}</p>

                <Suspense fallback={<CartSkeleton />}>
                    <Cart />
                </Suspense>
            </div>
        </CartProviders>
    );
}
