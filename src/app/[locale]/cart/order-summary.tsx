import CheckoutButtonClient from './checkout-button-client';
import { I18N } from '@/i18n/keys';
import { getTranslations } from 'next-intl/server';
import { OrderSummaryClient } from './order-summary-client';
import { ThemeButton } from '@/components/commerce/theme-button';
import { ShoppingBag } from 'lucide-react';

type ActiveOrder = {
    id: string;
    currencyCode: string;
    subTotalWithTax: number;
    shippingWithTax: number;
    totalWithTax: number;
    discounts?: Array<{
        description: string;
        amountWithTax: number;
    }> | null;
    lines: Array<{
        id: string;
        linePriceWithTax: number;
    }>;
};

export async function OrderSummary({ activeOrder }: { activeOrder: ActiveOrder }) {
    const t = await getTranslations('Cart');

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm lg:sticky lg:top-10">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <ShoppingBag className="w-4 h-4 text-[#9969F8]" />
                <h2 className="font-semibold text-sm text-foreground">{t(I18N.Cart.summary.title)}</h2>
            </div>

            <div className="px-4 py-4 space-y-3">
                <OrderSummaryClient
                    lines={activeOrder.lines}
                    subTotalWithTax={activeOrder.subTotalWithTax}
                    shippingWithTax={activeOrder.shippingWithTax}
                    currencyCode={activeOrder.currencyCode}
                    discounts={activeOrder.discounts}
                />
            </div>

            {/* CTA buttons */}
            <div className="px-4 pb-4 space-y-2">
                <CheckoutButtonClient
                    label={t(I18N.Cart.summary.checkout)}
                    lines={activeOrder.lines}
                />
                <ThemeButton variant="accent" href="/search" className="w-full rounded-xl">
                    {t(I18N.Cart.summary.continueShopping)}
                </ThemeButton>
            </div>
        </div>
    );
}
