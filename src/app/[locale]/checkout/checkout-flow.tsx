'use client';

import { useEffect, useState } from 'react';
import { Accordion, Surface } from '@heroui/react';
import ShippingAddressStep from './steps/shipping-address-step';
import DeliveryStep from './steps/delivery-step';
import PaymentStep from './steps/payment-step';
import ReviewStep from './steps/review-step';
import OrderSummary from './order-summary';
import { useCheckout } from './checkout-provider';
import { I18N } from '@/i18n/keys';
import { useTranslations } from 'next-intl';
import React from 'react';

type CheckoutStep = 'shipping' | 'delivery' | 'payment' | 'review';

interface CheckoutFlowProps {
  onSetShippingMethod: (id: string) => Promise<void>;
  pb: string
}

export default function CheckoutFlow({ onSetShippingMethod, pb }: CheckoutFlowProps) {

  const t = useTranslations('Checkout')
  const { order } = useCheckout();

  // Determine initial step and completed steps based on order state
  const getInitialState = () => {
    const completed = new Set<CheckoutStep>();
    let current: CheckoutStep = 'shipping';

    // Check if shipping address has required fields, not just if the object exists

    

    return { completed, current };
  };
  const scrollRef = React.useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (scrollRef.current) {
        const element = scrollRef.current;
  
        // Forzar el foco en el contenedor scrollable
        element.focus();
  
        // Prevenir propagación de eventos de scroll
        const handleWheel = (e: WheelEvent) => {
          e.stopPropagation();
        };
  
        element.addEventListener('wheel', handleWheel, { passive: true });
  
        return () => {
          element.removeEventListener('wheel', handleWheel);
        };
      }
    }, [open]);
  const initialState = getInitialState();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(initialState.current);
  const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(initialState.completed);

  const handleStepComplete = (step: CheckoutStep) => {
    setCompletedSteps(prev => new Set([...prev, step]));

    const stepOrder: CheckoutStep[] = ['shipping', 'delivery', 'payment', 'review'];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const canAccessStep = (step: CheckoutStep): boolean => {
    const stepOrder: CheckoutStep[] = ['shipping', 'delivery', 'payment', 'review'];
    const stepIndex = stepOrder.indexOf(step);

    if (stepIndex === 0) return true;

    const previousStep = stepOrder[stepIndex - 1];
    return completedSteps.has(previousStep);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-full relative">
      <Surface className="lg:col-span-2 rounded-md dark:bg-primary-foreground/60 shadow-2xl shadow-[#12123F]/90
    dark:shadow-2xl dark:shadow-white/30">
        <Accordion
          allowsMultipleExpanded
          className="space-y-4"
        >
          <Accordion.Item key="shipping" className="border rounded-lg px-6">
            <Accordion.Heading>
              <Accordion.Trigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${completedSteps.has('shipping')
                    ? 'bg-green-500 text-white'
                    : currentStep === 'shipping'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                    }`}>
                    {completedSteps.has('shipping') ? '✓' : '1'}
                  </div>
                  <span className="text-lg font-semibold">{t(I18N.Checkout.flow.shippingAddress)}</span>
                </div>
                <Accordion.Indicator className='text-foreground' />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="pt-4">
                <ShippingAddressStep
                  onComplete={() => handleStepComplete('shipping')}
                  t={t}
                />
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item
            key="delivery"
            className="border rounded-lg px-6"
            isDisabled={!canAccessStep('delivery')}
          >
            <Accordion.Heading>
              <Accordion.Trigger
                className="hover:no-underline"
                isDisabled={!canAccessStep('delivery')}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-foreground flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${completedSteps.has('delivery')
                    ? 'bg-green-500 text-white'
                    : currentStep === 'delivery'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                    }`}>
                    {completedSteps.has('delivery') ? '✓' : '2'}
                  </div>
                  <span className="text-lg font-semibold text-foreground">{t(I18N.Checkout.flow.deliveryMethod)}</span>
                </div>
                <Accordion.Indicator className='text-foreground' />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="pt-4">
                <DeliveryStep
                  onComplete={() => handleStepComplete('delivery')}
                  onSetShippingMethod={onSetShippingMethod}
                  t={t}
                />
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item
            key="payment"
            className="border rounded-lg px-6"
            isDisabled={!canAccessStep('payment')}
          >
            <Accordion.Heading>
              <Accordion.Trigger
                className="hover:no-underline"
                isDisabled={!canAccessStep('payment')}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${completedSteps.has('payment')
                    ? 'bg-green-500 text-white'
                    : currentStep === 'payment'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                    }`}>
                    {completedSteps.has('payment') ? '✓' : '3'}
                  </div>
                  <span className="text-lg font-semibold">{t(I18N.Checkout.flow.paymentMethod)}</span>
                </div>
                <Accordion.Indicator className='text-foreground' />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="pt-4">
                <PaymentStep
                  onComplete={() => handleStepComplete('payment')}
                  t={t}
                  pb={pb}
                />
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item
            key="review"
            className="border rounded-lg px-6"
            isDisabled={!canAccessStep('review')}
          >
            <Accordion.Heading>
              <Accordion.Trigger
                className="hover:no-underline"
                isDisabled={!canAccessStep('review')}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${currentStep === 'review'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                    }`}>
                    4
                  </div>
                  <span className="text-lg font-semibold">{t(I18N.Checkout.flow.reviewPlaceOrder)}</span>
                </div>
                <Accordion.Indicator className='text-foreground' />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="pt-4">
                <ReviewStep
                  onEditStep={setCurrentStep}
                  t={t}
                />
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Surface>

      <div className="lg:col-span-1">
        <OrderSummary t={t} />
      </div>
    </div>
  );
}
