'use client';

import { Button, Card } from '@heroui/react';
import { CreditCard } from 'lucide-react';
import Script from 'next/script';
import { useCheckout } from '../checkout-provider';
import { getPaymentSignature } from '../actions';
import { useEffect } from 'react';

interface PaymentStepProps {
  onComplete: () => void;
  t: (key: string) => string;
  pb: string
}

export function WompiScrollFix() {
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        typeof event.data === 'object' &&
        event.data?.type === 'WOMPI_WIDGET_CLOSED'
      ) {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []); 
  return null;
}
export default function PaymentStep({ pb }: PaymentStepProps) {
  const { order } = useCheckout();
  const openWompi = async () => {
    document.body.classList.add('wompi-open');
    const signature = await getPaymentSignature(1)

    // @ts-ignore
    const checkout = new window.WidgetCheckout({
      currency: 'COP',
      amountInCents: order.totalWithTax * 100,
      reference: order.code,
      publicKey: pb,
      signature: {
        integrity: signature,
      },
      customerData: {
        email: order.customer?.emailAddress,
        fullName: order.customer?.firstName,
      },
    });

    checkout.open(({ transaction }: any) => {
      console.log('Wompi status:', transaction.status);
      document.body.classList.remove('wompi-open');
      // ⚠️ NO confirmes pago aquí
      // solo muestra feedback visual
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 flex items-center gap-4">
        <CreditCard className="h-6 w-6 text-muted-foreground" />
        <div>
          <p className="font-medium text-foreground">Pago con Wompi</p>
          <p className="text-sm text-muted-foreground">
            Tarjeta, PSE, Nequi, Bancolombia
          </p>
        </div>
      </Card>

      <Button onClick={openWompi}
        className="w-full sticky bottom-0 z-10">
        Pagar con Wompi
      </Button>

      <Script
        src="https://checkout.wompi.co/widget.js"
        strategy="afterInteractive"
        className='sticky top-11'
      />
    </div>
  );
}
