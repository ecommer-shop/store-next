'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { CreditCard, Shield, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Script from 'next/script';
import { useCheckout } from '../checkout-provider';
import { trackAddPaymentInfo } from '@/lib/analytics/events';
import { getPaymentSignature, placeOrder as placeOrderAction } from '../actions';
import { useSelectedItems } from '@/app/[locale]/cart/selected-items-context';
import { CurrencyCode, TransactionStatus } from '@/models/payment';
import { Price } from '@/components/commerce/price';

interface PaymentStepProps {
  onComplete: () => void;
  pb: string;
  uri: string;
}

export default function PaymentStep({ pb, uri, onComplete }: PaymentStepProps) {
  const { order, selectedPaymentMethodCode, setSelectedPaymentMethodCode } = useCheckout();
  const { selectedLineIds } = useSelectedItems();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getSelectedOrderTotal = () => {
    const selectedLines = order.lines.filter((line) => selectedLineIds.includes(line.id));
    const subtotal = selectedLines.reduce((sum, line) => sum + line.linePriceWithTax, 0);
    const discountTotal = order.discounts?.reduce((sum, d) => sum + d.amountWithTax, 0) ?? 0;
    return subtotal + order.shippingWithTax - discountTotal;
  };

  const selectedShippingMethodIds = () =>
    order.shippingLines
      ?.map((line) => line.shippingMethod?.id)
      .filter((id): id is string => Boolean(id)) ?? [];

  const finalizeOrder = async (paymentMethodCode: string) => {
    trackAddPaymentInfo({ payment_type: paymentMethodCode });
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
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) throw error;
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'El pago fue aprobado, pero no se pudo finalizar el pedido. Intenta de nuevo.',
      );
      setLoading(false);
    }
  };

  const openWompi = async () => {
    if (!pb) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const amountInCents = Math.round(getSelectedOrderTotal());
      const uniqueReference = `${order.code}-${crypto.randomUUID().replace(/-/g, '')}`;
      const signature = await getPaymentSignature(amountInCents, uniqueReference);

      // @ts-ignore
      const checkout = new window.WidgetCheckout({
        currency: CurrencyCode.COP,
        amountInCents,
        reference: uniqueReference,
        publicKey: pb,
        redirectUrl: `https://ecommer.shop/order-confirmation/${order.code}`,
        signature: { integrity: signature },
        customerData: {
          email: order.customer?.emailAddress,
          fullName: order.customer?.firstName,
        },
      });

      checkout.open(async ({ transaction }: any) => {
        const status = transaction.status?.toUpperCase();
        if (status === TransactionStatus.APPROVED || status === 'APPROVED') {
          setSelectedPaymentMethodCode('wompi');
          setPaymentSuccess(true);
          await finalizeOrder('wompi');
        } else if (status === 'DECLINED') {
          setErrorMessage('El pago fue rechazado. Intenta con otro método de pago.');
          setLoading(false);
        } else if (status === 'PENDING') {
          setErrorMessage('El pago quedó pendiente. Revisa el estado antes de intentar nuevamente.');
          setLoading(false);
        }
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo abrir Wompi.');
      setLoading(false);
    }
  };

  const totalAmount = getSelectedOrderTotal();

  const handleTestPayment = () => {
    setSelectedPaymentMethodCode('wompi');
    setPaymentSuccess(true);
    void finalizeOrder('wompi');
  };

  return (
    <div className="space-y-5 pt-2">

      {/* Payment method card */}
      <div className={`
        rounded-xl border-2 p-4 transition-all
        ${paymentSuccess
          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
          : 'border-[#9969F8]/40 bg-[#9969F8]/5'}
      `}>
        <div className="flex items-center gap-4">
          <div className={`
            flex items-center justify-center w-11 h-11 rounded-full
            ${paymentSuccess ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600' : 'bg-[#9969F8]/15 text-[#9969F8]'}
          `}>
            {paymentSuccess
              ? <CheckCircle2 className="w-5 h-5" />
              : <CreditCard className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">
              {paymentSuccess ? 'Pago completado' : 'Pagar con Wompi'}
            </p>
            <p className="text-sm text-muted-foreground">
              {paymentSuccess
                ? 'Tu pago fue procesado exitosamente'
                : 'Tarjeta de crédito/débito, PSE, Nequi, Bancolombia'}
            </p>
          </div>
          {!paymentSuccess && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-bold text-foreground">
                <Price value={totalAmount} currencyCode={order.currencyCode} />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Security note */}
      {!paymentSuccess && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Pago 100% seguro procesado por Wompi. Tu información está protegida con encriptación SSL.</span>
        </div>
      )}

      {/* Error */}
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      <Button
        onClick={paymentSuccess ? () => finalizeOrder('wompi') : openWompi}
        isDisabled={loading}
        className="w-full rounded-xl bg-[#9969F8] text-white hover:opacity-90 transition font-semibold h-12 text-base"
      >
        {loading
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando…</>
          : paymentSuccess
          ? 'Finalizar pedido'
          : 'Pagar con Wompi'}
      </Button>

      <Button
        onClick={handleTestPayment}
        isDisabled={loading}
        variant="outline"
        className="w-full"
      >
        Prueba: finalizar sin Wompi
      </Button>

      <Script
        src="https://checkout.wompi.co/widget.js"
        strategy="afterInteractive"
        onChange={() => setSelectedPaymentMethodCode('wompi')}
      />
    </div>
  );
}
