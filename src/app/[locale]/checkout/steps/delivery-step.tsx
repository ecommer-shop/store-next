'use client';

import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { Loader2, Truck, Clock, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '../checkout-provider';
import { I18N } from '@/i18n/keys';
import clsx from 'clsx';
import {
  calculateAndSetDeliveryCost,
  calculateDeliveryCostQuote,
  setShippingMethod as setShippingMethodAction,
} from '../actions';
import { Price } from '@/components/commerce/price';

interface DeliveryStepProps {
  onComplete: () => void;
  t: (key: string) => string;
}

export default function DeliveryStep({ onComplete, t }: DeliveryStepProps) {
  const router = useRouter();
  const { shippingMethods, order } = useCheckout();

  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(() => {
    if (order.shippingLines?.length) return order.shippingLines[0].shippingMethod.id;
    return shippingMethods.length === 1 ? shippingMethods[0].id : null;
  });

  const [submitting, setSubmitting] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [quotedPriceWithTax, setQuotedPriceWithTax] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeShippingLine = order.shippingLines?.find(
    (line) => line.shippingMethod.id === selectedMethodId,
  );

  useEffect(() => {
    if (!selectedMethodId || !order.shippingAddress) {
      setQuotedPriceWithTax(null);
      return;
    }
    let cancelled = false;
    setQuoting(true);
    setErrorMessage(null);
    calculateDeliveryCostQuote()
      .then((quote) => {
        if (!cancelled) setQuotedPriceWithTax(Math.round((quote.price?.value ?? 0) * 100));
      })
      .catch((error) => {
        if (!cancelled) {
          setQuotedPriceWithTax(null);
          setErrorMessage(error instanceof Error ? error.message : 'No se pudo calcular el envío');
        }
      })
      .finally(() => { if (!cancelled) setQuoting(false); });

    return () => { cancelled = true; };
  }, [selectedMethodId, order.shippingAddress]);

  const handleContinue = async () => {
    if (!selectedMethodId) return;
    setErrorMessage(null);
    setSubmitting(true);
    try {
      await setShippingMethodAction(selectedMethodId);
      await calculateAndSetDeliveryCost();
      router.refresh();
      onComplete();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo establecer el método de envío');
    } finally {
      setSubmitting(false);
    }
  };

  if (shippingMethods.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <Truck className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-muted-foreground">{t(I18N.Checkout.delivery.noMethods)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-2">
      <p className="text-sm text-muted-foreground">{t(I18N.Checkout.delivery.selectMethod)}</p>

      {errorMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      <div className="space-y-3">
        {shippingMethods.map((method) => {
          const isSelected = selectedMethodId === method.id;
          const methodPrice =
            isSelected && quotedPriceWithTax != null
              ? quotedPriceWithTax
              : activeShippingLine?.shippingMethod.id === method.id
              ? activeShippingLine.priceWithTax
              : method.priceWithTax;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethodId(method.id)}
              className={clsx(
                'w-full text-left rounded-xl border-2 p-4 transition-all duration-150 cursor-pointer',
                isSelected
                  ? 'border-[#9969F8] bg-[#9969F8]/5 shadow-sm'
                  : 'border-border bg-card hover:border-[#9969F8]/40 hover:bg-muted/30',
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Radio indicator */}
                  <div className={clsx(
                    'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    isSelected ? 'border-[#9969F8] bg-[#9969F8]' : 'border-muted-foreground/40',
                  )}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <div className={clsx(
                    'flex items-center justify-center w-9 h-9 rounded-full',
                    isSelected ? 'bg-[#9969F8]/15 text-[#9969F8]' : 'bg-muted text-muted-foreground',
                  )}>
                    <Truck className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="font-semibold text-sm text-foreground">{method.name}</p>
                    {method.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  {quoting && isSelected ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Calculando…
                    </span>
                  ) : methodPrice === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                      {t(I18N.Checkout.delivery.free)}
                    </span>
                  ) : (
                    <span className="font-semibold text-sm text-foreground">
                      <Price value={methodPrice} currencyCode={order.currencyCode} />
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleContinue}
        isDisabled={!selectedMethodId || submitting || quoting}
        className="w-full rounded-xl bg-[#9969F8] text-white hover:opacity-90 transition font-semibold h-11"
      >
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t(I18N.Checkout.delivery.continuePayment)}
      </Button>
    </div>
  );
}
