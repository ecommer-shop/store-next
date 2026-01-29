'use client';

import { Button, Card } from '@heroui/react';
import { CreditCard } from 'lucide-react';
import Script from 'next/script';
import { useCheckout } from '../checkout-provider';
import { getPaymentSignature } from '../actions';
import { useEffect, useState } from 'react';
//t: (key: string) => string;
interface PaymentStepProps {
  onComplete: () => void;
  
  pb: string;
  uri: string;
}


export default function PaymentStep({ pb, uri }: PaymentStepProps) {
  const { order } = useCheckout();
  const [loading, setLoading] = useState(false);
  const openWompi = async () => {
    //document.body.classList.add('wompi-open');
    const signature = await getPaymentSignature(1)
    setLoading(true)
    // @ts-ignore
    const checkout = new window.WidgetCheckout({
      currency: 'COP',
      amountInCents: order.totalWithTax,
      reference: order.code,
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
    console.log("SIGNAA",signature)
    console.log(checkout)
    checkout.open(({ transaction }: any) => {
      console.log('Wompi status:', transaction.status);
      //document.body.classList.remove('wompi-open');
      // ⚠️ NO confirmes pago aquíaa
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
        className="w-full sticky bottom-0">
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
