'use client';

import { Button, Card } from '@heroui/react';
import { CreditCard } from 'lucide-react';
import Script from 'next/script';
import { useCheckout } from '../checkout-provider';
import { getPaymentSignature } from '../actions';
import { useEffect, useState } from 'react';
import { placeOrder as placeOrderAction } from '../actions';
import { useSelectedItems } from '@/app/[locale]/cart/selected-items-context';
import { CurrencyCode, TransactionStatus } from '@/models/payment';

interface PaymentStepProps {
  onComplete: () => void;
  pb: string;
  uri: string;
}

export default function PaymentStep({ pb, uri, onComplete }: PaymentStepProps) {
  const { order, addresses, selectedPaymentMethodCode, setSelectedPaymentMethodCode } = useCheckout();
  const { selectedLineIds } = useSelectedItems();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculate total based on selected lines from context
  const getSelectedOrderTotal = () => {
    // Filter lines to only selected ones
    const selectedLines = order.lines.filter((line) => selectedLineIds.includes(line.id));

    // Calculate subtotal from selected lines
    const selectedSubtotal = selectedLines.reduce((sum, line) => sum + line.linePriceWithTax, 0);

    // Add shipping and discounts to get final total
    const discountTotal = order.discounts?.reduce((sum, d) => sum + d.amountWithTax, 0) ?? 0;
    const total = selectedSubtotal + order.shippingWithTax - discountTotal;

    return total;
  };

  const selectedShippingMethodIds = () => (
    order.shippingLines
      ?.map((line) => line.shippingMethod?.id)
      .filter((id): id is string => Boolean(id)) ?? []
  );

  const finalizeOrder = async (paymentMethodCode: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await placeOrderAction(
        paymentMethodCode,
        selectedLineIds,
        selectedShippingMethodIds(),
        order.shippingWithTax,
      );
      onComplete();
    } catch (error) {
      // Check if this is a Next.js redirect (which is expected)
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        // This is a redirect, not an error - let it propagate
        throw error;
      }
      console.error('Error finalizing order:', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'El pago fue aprobado, pero no se pudo finalizar el pedido. Intenta finalizarlo de nuevo.',
      );
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethodCode) return;
    await finalizeOrder(selectedPaymentMethodCode);
  };

  const openWompi = async () => {
    if (!pb) {
      console.error('[Wompi] PAYMENT_PUBLIC_KEY no está definida. Verifica las variables de entorno.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // Calculate the correct total based on selected items
      const correctTotal = getSelectedOrderTotal();
      const amountInCents = Math.round(correctTotal);

      // Generar una referencia única para cada intento de pago usando UUID
      const uniqueId = crypto.randomUUID().replace(/-/g, '');
      const uniqueReference = `${order.code}-${uniqueId}`;

      // Obtener la firma usando la referencia única
      const signature = await getPaymentSignature(amountInCents, uniqueReference);
      
      // @ts-ignore
      const checkout = new window.WidgetCheckout({
        currency: CurrencyCode.COP,
        amountInCents: amountInCents,
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

      checkout.open(async ({ transaction }: any) => {
        

        // Verificar si el pago fue exitoso
        if (transaction.status === TransactionStatus.APPROVED || transaction.status === TransactionStatus.APPROVED.toLowerCase()) {
          setSelectedPaymentMethodCode('wompi');
          setPaymentSuccess(true);
          await finalizeOrder('wompi');
        } else if (transaction.status === 'DECLINED' || transaction.status === 'declined') {
          console.error('Payment declined');
          setErrorMessage('El pago fue rechazado. Intenta con otro metodo de pago.');
          setLoading(false);
        } else if (transaction.status === 'PENDING' || transaction.status === 'pending') {
          setErrorMessage('El pago quedo pendiente. Revisa el estado antes de intentar nuevamente.');
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error opening Wompi checkout:', error);
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo abrir Wompi.');
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (paymentSuccess) {
      void finalizeOrder('wompi');
      return;
    }

    void openWompi();
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

      {errorMessage && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <Button
        onClick={handleButtonClick}
        isDisabled={loading}
        className="w-full sticky bottom-0"
      >
        {loading ? 'Cargando...' : paymentSuccess ? 'Finalizar pedido' : 'Pagar con Wompi'}
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
