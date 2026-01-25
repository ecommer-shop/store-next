'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { Loader2, MapPin, Truck, CreditCard, Edit } from 'lucide-react';
import { useCheckout } from '../checkout-provider';
import { placeOrder as placeOrderAction } from '../actions';
import { Price } from '@/components/commerce/price';
import { I18N } from '@/i18n/keys';

interface ReviewStepProps {
  onEditStep: (step: 'shipping' | 'delivery' | 'payment') => void;
  t: (key: string) => string;
}

export default function ReviewStep({ onEditStep, t }: ReviewStepProps) {
  const { order, paymentMethods, selectedPaymentMethodCode } = useCheckout();
  const [loading, setLoading] = useState(false);

  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.code === selectedPaymentMethodCode
  );

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethodCode) return;

    setLoading(true);
    try {
      await placeOrderAction(selectedPaymentMethodCode);
    } catch (error) {
      // Check if this is a Next.js redirect (which is expected)
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        // This is a redirect, not an error - let it propagate
        throw error;
      }
      console.error('Error placing order:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
      <h3 className="font-semibold text-lg">{t(I18N.Checkout.review.title)}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Address */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium">{t(I18N.Checkout.review.shippingAddress)}</h4>
          </div>
          {order.shippingAddress ? (
            <div className="text-sm space-y-3">
              <div>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.streetLine1}
                  {order.shippingAddress.streetLine2 && `, ${order.shippingAddress.streetLine2}`}
                </p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                <p className="text-muted-foreground">{order.shippingAddress.phoneNumber}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditStep('shipping')}
              >
                <Edit className="h-4 w-4 mr-1" />
                {t(I18N.Checkout.review.edit)}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t(I18N.Checkout.review.noAddressSet)}</p>
          )}
        </div>

        {/* Delivery Method */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium">{t(I18N.Checkout.review.deliveryMethod)}</h4>
          </div>
          {order.shippingLines && order.shippingLines.length > 0 ? (
            <div className="text-sm space-y-3">
              <div>
                <p className="font-medium">{order.shippingLines[0].shippingMethod.name}</p>
                <p className="text-muted-foreground">
                  {order.shippingLines[0].priceWithTax === 0
                    ? t(I18N.Checkout.delivery.free)
                    : <Price value={order.shippingLines[0].priceWithTax} currencyCode={order.currencyCode} />}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditStep('delivery')}
              >
                <Edit className="h-4 w-4 mr-1" />
                {t(I18N.Checkout.review.edit)}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t(I18N.Checkout.review.noMethodSet)}</p>
          )}
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium">{t(I18N.Checkout.review.paymentMethod)}</h4>
          </div>
          {selectedPaymentMethod ? (
            <div className="text-sm space-y-3">
              <div>
                <p className="font-medium">{selectedPaymentMethod.name}</p>
                {selectedPaymentMethod.description && (
                  <p className="text-muted-foreground mt-1">
                    {selectedPaymentMethod.description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditStep('payment')}
              >
                <Edit className="h-4 w-4 mr-1" />
                {t(I18N.Checkout.review.edit)}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t(I18N.Checkout.review.noPaymentSet)}</p>
          )}
        </div>
      </div>

      <Button
        onClick={handlePlaceOrder}
        isDisabled={loading || !order.shippingAddress || !order.shippingLines?.length || !selectedPaymentMethodCode}
        size="lg"
        className="w-full"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t(I18N.Checkout.review.placeOrder)}
      </Button>

      {(!order.shippingAddress || !order.shippingLines?.length || !selectedPaymentMethodCode) && (
        <p className="text-sm text-destructive text-center">
          {t(I18N.Checkout.review.completeSteps)}
        </p>
      )}
    </div>
    </>
  );
}
