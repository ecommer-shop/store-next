'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { Loader2, MapPin, Truck, Pencil } from 'lucide-react';
import { useCheckout } from '../checkout-provider';
import { Price } from '@/components/commerce/price';
import { I18N } from '@/i18n/keys';

interface ReviewStepProps {
  onComplete: () => void;
  onEditStep: (step: 'shipping' | 'delivery') => void;
  t: (key: string) => string;
}

export default function ReviewStep({ onEditStep, t, onComplete }: ReviewStepProps) {
  const { order } = useCheckout();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!order.shippingAddress || !order.shippingLines?.length) return;
    setLoading(true);
    onComplete();
    setLoading(false);
  };

  const canProceed = !!(order.shippingAddress && order.shippingLines?.length);

  return (
    <div className="space-y-5 pt-2">
      <p className="text-sm text-muted-foreground">{t(I18N.Checkout.review.title)}</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Shipping address card */}
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#9969F8]/10 text-[#9969F8]">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              {t(I18N.Checkout.review.shippingAddress)}
            </div>
            <button
              type="button"
              onClick={() => onEditStep('shipping')}
              className="inline-flex items-center gap-1 text-xs text-[#9969F8] hover:opacity-80 transition font-medium"
            >
              <Pencil className="w-3 h-3" />
              {t(I18N.Checkout.review.edit)}
            </button>
          </div>

          {order.shippingAddress ? (
            <div className="text-sm space-y-0.5 text-muted-foreground">
              <p className="font-semibold text-foreground">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.streetLine1}{order.shippingAddress.streetLine2 && `, ${order.shippingAddress.streetLine2}`}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phoneNumber}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t(I18N.Checkout.review.noAddressSet)}</p>
          )}
        </div>

        {/* Delivery method card */}
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#9969F8]/10 text-[#9969F8]">
                <Truck className="w-3.5 h-3.5" />
              </div>
              {t(I18N.Checkout.review.deliveryMethod)}
            </div>
            <button
              type="button"
              onClick={() => onEditStep('delivery')}
              className="inline-flex items-center gap-1 text-xs text-[#9969F8] hover:opacity-80 transition font-medium"
            >
              <Pencil className="w-3 h-3" />
              {t(I18N.Checkout.review.edit)}
            </button>
          </div>

          {order.shippingLines?.length ? (
            <div className="text-sm space-y-0.5">
              <p className="font-semibold text-foreground">{order.shippingLines[0].shippingMethod.name}</p>
              <p className="text-muted-foreground">
                {order.shippingLines[0].priceWithTax === 0
                  ? t(I18N.Checkout.delivery.free)
                  : <Price value={order.shippingLines[0].priceWithTax} currencyCode={order.currencyCode} />}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t(I18N.Checkout.review.noMethodSet)}</p>
          )}
        </div>
      </div>

      {/* Completion warning */}
      {!canProceed && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          {t(I18N.Checkout.review.completeSteps)}
        </div>
      )}

      <Button
        onClick={handlePlaceOrder}
        isDisabled={!canProceed || loading}
        className="w-full rounded-xl bg-[#9969F8] text-white hover:opacity-90 transition font-semibold h-11"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t(I18N.Checkout.review.placeOrder)}
      </Button>
    </div>
  );
}
