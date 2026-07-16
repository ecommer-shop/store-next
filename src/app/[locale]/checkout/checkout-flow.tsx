'use client';

import { useEffect, useState } from 'react';
import { Surface } from '@heroui/react';
import { Check, CreditCard, MapPin, Package, Truck } from 'lucide-react';
import { trackBeginCheckout } from '@/lib/analytics/events';
import ShippingAddressStep from './steps/shipping-address-step';
import DeliveryStep from './steps/delivery-step';
import PaymentStep from './steps/payment-step';
import ReviewStep from './steps/review-step';
import OrderSummary from './order-summary';
import { useCheckout } from './checkout-provider';
import { I18N } from '@/i18n/keys';
import { useTranslations } from 'next-intl';

const showDeliveryStep = true;

type CheckoutStep = 'shipping' | 'delivery' | 'review' | 'payment';

interface CheckoutFlowProps {
  onSetShippingMethod: (id: string) => Promise<void>;
  pb: string;
  uri: string;
}

const stepMeta: Record<CheckoutStep, { icon: React.ElementType; labelKey: string }> = {
  shipping: { icon: MapPin, labelKey: I18N.Checkout.flow.shippingAddress },
  delivery: { icon: Truck, labelKey: I18N.Checkout.flow.deliveryMethod },
  review:   { icon: Package, labelKey: I18N.Checkout.flow.reviewPlaceOrder },
  payment:  { icon: CreditCard, labelKey: I18N.Checkout.flow.paymentMethod },
};

export default function CheckoutFlow({ onSetShippingMethod, pb, uri }: CheckoutFlowProps) {
  const t = useTranslations('Checkout');
  const { order } = useCheckout();

  useEffect(() => {
    trackBeginCheckout({
      value: order.lines.reduce((sum: number, line: any) => sum + line.linePriceWithTax, 0),
      items: order.lines.map((line: any) => ({
        item_id: line.productVariant?.id ?? line.id,
        item_name: line.productVariant?.name ?? '',
        price: line.linePriceWithTax / (line.quantity || 1),
        quantity: line.quantity,
      })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stepOrder: CheckoutStep[] = ['shipping'];
  if (showDeliveryStep) stepOrder.push('delivery');
  stepOrder.push('review', 'payment');

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(new Set());

  const handleStepComplete = (step: CheckoutStep) => {
    setCompletedSteps(prev => new Set([...prev, step]));
    const idx = stepOrder.indexOf(step);
    if (idx < stepOrder.length - 1) setCurrentStep(stepOrder[idx + 1]);
  };

  const canAccessStep = (step: CheckoutStep): boolean => {
    const idx = stepOrder.indexOf(step);
    if (idx === 0) return true;
    return completedSteps.has(stepOrder[idx - 1]);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-full relative">
      {/* Left column: step flow */}
      <div className="lg:col-span-2 space-y-4">

        {/* Progress bar */}
        <div className="flex items-center gap-0 mb-6">
          {stepOrder.map((step, idx) => {
            const { icon: Icon, labelKey } = stepMeta[step];
            const done = completedSteps.has(step);
            const active = currentStep === step;
            const accessible = canAccessStep(step);
            const isLast = idx === stepOrder.length - 1;

            return (
              <div key={step} className="flex items-center flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => accessible && setCurrentStep(step)}
                  disabled={!accessible}
                  className="flex flex-col items-center gap-1 min-w-0 flex-shrink-0 group disabled:cursor-not-allowed"
                >
                  <div className={`
                    flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-200
                    ${done
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : active
                      ? 'bg-[#9969F8] border-[#9969F8] text-white shadow-md shadow-[#9969F8]/40'
                      : accessible
                      ? 'bg-background border-border text-muted-foreground group-hover:border-[#9969F8]/60'
                      : 'bg-muted border-muted text-muted-foreground/40'}
                  `}>
                    {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[11px] font-medium hidden sm:block truncate max-w-[70px] text-center leading-tight
                    ${active ? 'text-[#9969F8]' : done ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}
                  `}>
                    {t(labelKey)}
                  </span>
                </button>
                {!isLast && (
                  <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-300 ${done ? 'bg-emerald-400' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step cards */}
        {stepOrder.map((step) => {
          const { icon: Icon, labelKey } = stepMeta[step];
          const done = completedSteps.has(step);
          const active = currentStep === step;
          const accessible = canAccessStep(step);

          if (!accessible && !done) return null;

          return (
            <Surface
              key={step}
              className={`
                rounded-2xl border transition-all duration-200 overflow-hidden
                ${active
                  ? 'border-[#9969F8]/40 shadow-lg shadow-[#9969F8]/10 dark:bg-primary-foreground/80'
                  : done
                  ? 'border-emerald-200 dark:border-emerald-800/40 opacity-70 dark:bg-primary-foreground/40'
                  : 'border-border dark:bg-primary-foreground/40 opacity-50'}
              `}
            >
              {/* Step header */}
              <button
                type="button"
                onClick={() => (done || active) && setCurrentStep(step)}
                disabled={!done && !active}
                className="w-full flex items-center justify-between px-6 py-4 text-left disabled:cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors
                    ${done ? 'bg-emerald-500 text-white' : active ? 'bg-[#9969F8] text-white' : 'bg-muted text-muted-foreground'}
                  `}>
                    {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-base font-semibold ${active ? 'text-foreground' : done ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                    {t(labelKey)}
                  </span>
                </div>
                {done && !active && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                    Completado
                  </span>
                )}
              </button>

              {/* Step body — only shown when active */}
              {active && (
                <div className="px-6 pb-6 pt-2 border-t border-border/50">
                  {step === 'shipping' && (
                    <ShippingAddressStep onComplete={() => handleStepComplete('shipping')} t={t} />
                  )}
                  {step === 'delivery' && (
                    <DeliveryStep onComplete={() => handleStepComplete('delivery')} t={t} />
                  )}
                  {step === 'review' && (
                    <ReviewStep onEditStep={setCurrentStep} onComplete={() => handleStepComplete('review')} t={t} />
                  )}
                  {step === 'payment' && (
                    <PaymentStep onComplete={() => handleStepComplete('payment')} pb={pb} uri={uri} />
                  )}
                </div>
              )}
            </Surface>
          );
        })}
      </div>

      {/* Right column: order summary */}
      <div className="lg:col-span-1">
        <OrderSummary t={t} />
      </div>
    </div>
  );
}
