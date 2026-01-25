'use client';

import { Button } from '@heroui/react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { useCheckout } from '../checkout-provider';
import { I18N } from '@/i18n/keys';

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

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t(I18N.Checkout.payment.noMethods)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold">{t(I18N.Checkout.payment.selectMethod)}</h3>

      <RadioGroup value={selectedPaymentMethodCode || ''} onValueChange={setSelectedPaymentMethodCode}>
        {paymentMethods.map((method) => (
          <Label key={method.code} htmlFor={method.code} className="cursor-pointer">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <RadioGroupItem value={method.code} id={method.code} />
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{method.name}</p>
                  {method.description+"aaa" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {method.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>
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
