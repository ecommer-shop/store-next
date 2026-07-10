'use client';

import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { OrderLine } from './types';
import { useCheckout } from './checkout-provider';
import { useSelectedItems } from '@/app/[locale]/cart/selected-items-context';
import { Price } from '@/components/commerce/price';
import { I18N } from '@/i18n/keys';
import { ShoppingBag, Tag } from 'lucide-react';

interface OrderSummaryProps {
  t: (key: string) => string;
}

export default function OrderSummary({ t }: OrderSummaryProps) {
  const { order } = useCheckout();
  const { selectedLineIds } = useSelectedItems();

  const displayedLines = order.lines.filter((l: OrderLine) =>
    selectedLineIds.length === 0 ? true : selectedLineIds.includes(l.id),
  );

  const selectedSubtotal = displayedLines.reduce(
    (sum: number, line: OrderLine) => sum + (line.linePriceWithTax ?? 0),
    0,
  );
  
  const selectedLinesSubtotal = displayedLines.reduce((sum: number, line: OrderLine) => sum + (line.linePriceWithTax ?? 0), 0);
  const discountTotal = order.discounts?.reduce((sum: number, d: { amountWithTax: number }) => sum + (d.amountWithTax ?? 0), 0) ?? 0;
  
  const finalTotal = discountTotal < 0 ? selectedLinesSubtotal + (order.shippingWithTax ?? 0) + discountTotal : selectedLinesSubtotal + (order.shippingWithTax ?? 0) - discountTotal;
  
  return (
    <div className="sticky top-11 rounded-2xl border border-border bg-card shadow-xl shadow-[#12123F]/10 dark:shadow-white/5 overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border bg-muted/30">
        <ShoppingBag className="w-4 h-4 text-[#9969F8]" />
        <h2 className="font-semibold text-sm text-foreground">{t(I18N.Checkout.summary.title)}</h2>
        <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {displayedLines.length} {displayedLines.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      <div className="p-5 space-y-4">

        {/* Product list */}
        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
          {displayedLines.map((line: OrderLine) => (
            <div key={line.id} className="flex gap-3 items-start">
              {line.productVariant.product.featuredAsset ? (
                <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-border bg-muted">
                  <Image
                    src={line.productVariant.product.featuredAsset.preview}
                    alt={line.productVariant.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
                  {line.productVariant.product.name}
                </p>
                {line.productVariant.name !== line.productVariant.product.name && (
                  <p className="text-xs text-muted-foreground mt-0.5">{line.productVariant.name}</p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cant: {line.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-foreground flex-shrink-0">
                <Price value={line.linePriceWithTax} currencyCode={order.currencyCode} />
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t(I18N.Checkout.summary.subtotal)}</span>
            <span className="font-medium text-foreground">
              <Price value={selectedSubtotal} currencyCode={order.currencyCode} />
            </span>
          </div>

          {order.discounts?.map(
            (discount: { description: string; amountWithTax: number }, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Tag className="w-3 h-3" />
                  {discount.description}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  −<Price value={discount.amountWithTax} currencyCode={order.currencyCode} />
                </span>
              </div>
            ),
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t(I18N.Checkout.summary.shipping)}</span>
            <span className="font-medium text-foreground">
              {order.shippingWithTax > 0
                ? <Price value={order.shippingWithTax} currencyCode={order.currencyCode} />
                : <span className="text-muted-foreground italic text-xs">{t(I18N.Checkout.summary.toCalculate)}</span>}
            </span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-base text-foreground">{t(I18N.Checkout.summary.total)}</span>
          <span className="font-bold text-xl text-foreground">
            <Price value={finalTotal} currencyCode={order.currencyCode} />
          </span>
        </div>
      </div>
    </div>
  );
}
