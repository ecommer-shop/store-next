'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderLine } from './types';
import { useCheckout } from './checkout-provider';
import { Price } from '@/components/commerce/price';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import { I18N } from '@/i18n/keys';

interface OrderSummaryProps {
  t: (key: string) => string;
}
export default function OrderSummary({ t }: OrderSummaryProps) {
  const { order } = useCheckout();
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>{t(I18N.Checkout.summary.title)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {order.lines.map((line: OrderLine) => (
            <div key={line.id} className="flex gap-3">
              {line.productVariant.product.featuredAsset && (
                <div className="flex-shrink-0 w-15 h-15">
                  <Image
                    src={line.productVariant.product.featuredAsset.preview}
                    alt={line.productVariant.name}
                    width={60}
                    height={60}
                    className="rounded object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">
                  {line.productVariant.product.name}
                </p>
                {line.productVariant.name !== line.productVariant.product.name && (
                  <p className="text-xs text-muted-foreground">
                    {line.productVariant.name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t(I18N.Checkout.summary.quantity)}: {line.quantity}
                </p>
              </div>
              <div className="text-sm font-medium">
                <Price value={line.linePriceWithTax} currencyCode={order.currencyCode} />
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t(I18N.Checkout.summary.subtotal)}</span>
            <span>
              <Price value={order.subTotalWithTax} currencyCode={order.currencyCode} />
            </span>
          </div>

          {order.discounts && order.discounts.length > 0 && (
            <>
              {order.discounts.map((discount: { description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; amountWithTax: number; }, index: number) => (
                <div key={index} className="flex justify-between text-sm text-green-600">
                  <span>{discount.description}</span>
                  <span>
                    <Price value={discount.amountWithTax} currencyCode={order.currencyCode} />
                  </span>
                </div>
              ))}
            </>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t(I18N.Checkout.summary.shipping)}</span>
            <span>
              {order.shippingWithTax > 0
                ? <Price value={order.shippingWithTax} currencyCode={order.currencyCode} />
                : t(I18N.Checkout.summary.toCalculate)}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>{t(I18N.Checkout.summary.total)}</span>
          <span>
            <Price value={order.totalWithTax} currencyCode={order.currencyCode} />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
