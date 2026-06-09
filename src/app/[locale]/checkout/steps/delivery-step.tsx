'use client';

import { useEffect, useState } from 'react';
import { Button, Card, Label, Radio, RadioGroup } from '@heroui/react';
import { Loader2, Truck } from 'lucide-react';
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
    // If order already has a shipping method selected, pre-select it
    if (order.shippingLines && order.shippingLines.length > 0) {
      return order.shippingLines[0].shippingMethod.id;
    }
    // Otherwise default to first method if there's only one
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
        if (cancelled) return;
        setQuotedPriceWithTax(Math.round((quote.price?.value ?? 0) * 100));
      })
      .catch((error) => {
        if (cancelled) return;
        setQuotedPriceWithTax(null);
        setErrorMessage(error instanceof Error ? error.message : 'No se pudo calcular el envio');
      })
      .finally(() => {
        if (!cancelled) {
          setQuoting(false);
        }
      });

    return () => {
      cancelled = true;
    };
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
      console.error('Error setting shipping method:', error);
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo calcular el envio');
    } finally {
      setSubmitting(false);
    }
  };


  if (shippingMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t(I18N.Checkout.delivery.noMethods)}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col space-y-6">
      <h3 className="font-semibold text-foreground">{t(I18N.Checkout.delivery.selectMethod)}</h3>
      {errorMessage && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <RadioGroup value={selectedMethodId || ''} onChange={setSelectedMethodId}>
        {shippingMethods.map((method) => {
          const methodPriceWithTax = selectedMethodId === method.id && quotedPriceWithTax != null
            ? quotedPriceWithTax
            : activeShippingLine?.shippingMethod.id === method.id
            ? activeShippingLine.priceWithTax
            : method.priceWithTax;

          return (
          <Label key={method.id} htmlFor={method.id} className="cursor-pointer">
            <Radio value={method.id} id={method.id} className={clsx(
              "group relative flex-col gap-3 rounded-xl border border-transparent bg-primary-foreground dark:bg-primary-foreground px-5 py-4 transition-all data-[selected=true]:border-accent data-[selected=true]:bg-accent/10",
              "data-[focus-visible=true]:border-accent data-[focus-visible=true]:bg-accent/10",
            )}>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content>
                <Card className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{method.name}</p>
                        {method.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {method.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-foreground">
                        {quoting && selectedMethodId === method.id
                          ? 'Calculando...'
                          : methodPriceWithTax === 0
                          ? t(I18N.Checkout.delivery.free)
                          : <Price value={methodPriceWithTax} currencyCode={order.currencyCode} />}
                      </p>
                    </div>
                  </div>
                </Card>
              </Radio.Content>
            </Radio>
          </Label>
          );
        })}
      </RadioGroup>

      <Button
        onClick={handleContinue}
        isDisabled={!selectedMethodId || submitting}
        className="w-full"
      >
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t(I18N.Checkout.delivery.continuePayment)}
      </Button>
    </div>
  );
}
