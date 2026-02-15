'use client';

import { Button, Card } from '@heroui/react';
import { CreditCard } from 'lucide-react';
import Script from 'next/script';
import { useCheckout } from '../checkout-provider';
import { getPaymentSignature } from '../actions';
import { useEffect, useState } from 'react';
import { v7 as uuid } from 'uuid'
import { placeOrder as placeOrderAction } from '../actions';

interface PaymentStepProps {
  onComplete: () => void;
  pb: string;
  uri: string;
}

export default function PaymentStep({ pb, uri, onComplete }: PaymentStepProps) {
  const { order, addresses, selectedPaymentMethodCode, setSelectedPaymentMethodCode } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethodCode) return;

    setLoading(true);
    onComplete()
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

  const openWompi = async () => {
    setLoading(true);

    try {
      // Generar una referencia única para cada intento de pago usando UUID
      const uniqueId = crypto.randomUUID().replace(/-/g, '');
      const uniqueReference = `${order.code}-${uniqueId}`;

      // Obtener la firma usando la referencia única
      const signature = await getPaymentSignature(order.totalWithTax, uniqueReference);

      // @ts-ignore
      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents: order.totalWithTax,
        reference: uniqueReference,
        publicKey: pb,
        redirectUrl: `https://ecommer.shop/order-confirmation/${order.code}`,
        signature: {
          integrity: signature,
        },
        customerData: {
          email: order.customer?.emailAddress,
          fullName: order.customer?.firstName,
        },
      });

      checkout.open(({ transaction }: any) => {
        console.log('Wompi transaction status:', transaction.status);

        // Verificar si el pago fue exitoso
        if (transaction.status === 'APPROVED' || transaction.status === 'approved') {
          console.log('Payment successful!', transaction.status);
          handlePlaceOrder(); // Colocar la orden después de la aprobación del pago
          // Habilitar el método de pago seleccionado
          setSelectedPaymentMethodCode('wompi');
          setPaymentSuccess(true);
          console.log('Selected payment method set:', selectedPaymentMethodCode);
          // Llamar a onComplete para avanzar al siguiente paso
          if (onComplete) {
            setTimeout(() => {
              onComplete();
            }, 1500); // Pequeño delay para mostrar confirmación visual
          }
        } else if (transaction.status === 'DECLINED' || transaction.status === 'declined') {
          console.error('Payment declined');
          setLoading(false);
        } else if (transaction.status === 'PENDING' || transaction.status === 'pending') {
          console.log('Payment pending');
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error opening Wompi checkout:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={`p-6 flex items-center gap-4 ${paymentSuccess ? 'bg-green-50 border-green-200' : ''}`}>
        <CreditCard className="h-6 w-6 text-muted-foreground" />
        <div>
          <p className="font-medium text-foreground">
            {paymentSuccess ? '✓ Pago completado' : 'Pago con Wompi'}
          </p>
          <p className="text-sm text-muted-foreground">
            {paymentSuccess ? 'Tu pago fue procesado exitosamente' : 'Tarjeta, PSE, Nequi, Bancolombia'}
          </p>
        </div>
      </Card>

      <Button
        onClick={openWompi}
        isDisabled={loading || paymentSuccess}
        className="w-full sticky bottom-0"
      >
        {loading ? 'Cargando...' : paymentSuccess ? 'Pago completado' : 'Pagar con Wompi'}
      </Button>

      <Script
        onChange={() => setSelectedPaymentMethodCode('wompi')}
        src="https://checkout.wompi.co/widget.js"
        strategy="afterInteractive"
        className='sticky top-11'
      />
    </div>
  );
}