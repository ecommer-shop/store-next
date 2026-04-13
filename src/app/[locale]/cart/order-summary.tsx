import Link from 'next/link';
import { Button } from '@heroui/react';
import CheckoutButtonClient from './checkout-button-client';
import { Price } from '@/components/commerce/price';
import { I18N } from '@/i18n/keys';
import { getTranslations } from 'next-intl/server';
import { OrderSummaryClient } from './order-summary-client';
import { ThemeButton } from '@/components/commerce/theme-button';

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
    const totalLines = activeOrder.lines.length;
    return (
        <div className="border rounded-lg p-6 bg-card sticky top-10 z-9">
            <h2 className="text-xl font-bold mb-4">{t(I18N.Cart.summary.title)}</h2>

            <div className="space-y-2 mb-4">
                <OrderSummaryClient
                    lines={activeOrder.lines}
                    subTotalWithTax={activeOrder.subTotalWithTax}
                    shippingWithTax={activeOrder.shippingWithTax}
                    currencyCode={activeOrder.currencyCode}
                    discounts={activeOrder.discounts}
                />
            </div>

            <div className="border-t pt-4 mb-6">
                {/* This div is now handled by OrderSummaryClient - removing the duplicate total */}
            </div>
            
                <CheckoutButtonClient label={t(I18N.Cart.summary.checkout)} lines={activeOrder.lines} />
            
            <div className="mt-2 w-full text-foreground">
                <ThemeButton variant="accent" href="/" className="w-full rounded-md">
                    {t(I18N.Cart.summary.continueShopping)}
                </ThemeButton>
            </div>
        </div>
    );
}
