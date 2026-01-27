'use client';

import { Button, Card, Label, Radio, RadioGroup } from '@heroui/react';
import { CreditCard } from 'lucide-react';
import { useCheckout } from '../checkout-provider';
import { I18N } from '@/i18n/keys';
import clsx from 'clsx';

interface PaymentStepProps {
  onComplete: () => void;
  t: (key: string) => string;
}

export default function PaymentStep({ onComplete, t }: PaymentStepProps) {
  const { paymentMethods, selectedPaymentMethodCode, setSelectedPaymentMethodCode } = useCheckout();

  const handleContinue = () => {
    if (!selectedPaymentMethodCode) return;
    onComplete();
  };
  console.log("Selected paaa", selectedPaymentMethodCode)
  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t(I18N.Checkout.payment.noMethods)}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col space-y-6">
    <h3 className="font-semibold text-foreground">{t(I18N.Checkout.payment.selectMethod)}</h3>

      <RadioGroup value={selectedPaymentMethodCode || ''} onChange={setSelectedPaymentMethodCode}>
        {paymentMethods.map((method) => (
          <Label key={method.code} htmlFor={method.code} className="cursor-pointer w-full">

            <Radio value={method.code} id={method.code} className={clsx(
              "group relative flex-col gap-3 rounded-xl border border-transparent bg-primary-foreground dark:bg-primary-foreground px-5 py-4 transition-all data-[selected=true]:border-accent data-[selected=true]:bg-accent/10",
              "data-[focus-visible=true]:border-accent data-[focus-visible=true]:bg-accent/10",
            )}>
              <Radio.Control className='absolute top-3 right-4 size-5'>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content>
                <Card className="p-4 bg-accent-soft-hover" variant='tertiary'>
                  <div className="flex gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{method.name}</p>
                      {method.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {method.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Radio.Content>
            </Radio>

          </Label>
        ))}
      </RadioGroup>

      <Button
        onClick={handleContinue}
        isDisabled={!selectedPaymentMethodCode}
        className="w-full"
      >
        {t(I18N.Checkout.payment.continueReview)}
      </Button>
    </div>
  );
}
