'use client';

import { Button, Card } from '@heroui/react';
import { CreditCard } from 'lucide-react';
import Script from 'next/script';
import { useCheckout } from '../checkout-provider';
import { getPaymentSignature } from '../actions';
import { useEffect, useState } from 'react';
import { v7 as uuid } from 'uuid'

//t: (key: string) => string;
interface PaymentStepProps {
  onComplete: () => void;
  
  pb: string;
  uri: string;
}


export default function PaymentStep({ pb, uri }: PaymentStepProps) {
  const { order, addresses } = useCheckout();
  const [loading, setLoading] = useState(false);
  
  const openWompi = async () => {
    setLoading(true)
    
    // Generar una referencia única para cada intento de pago usando UUID
    // Formato: ORDER_CODE-UUID (sin guiones del UUID para mayor compatibilidad)
    const uuid = crypto.randomUUID().replace(/-/g, '');
    const uniqueReference = `${order.code}-${uuid}`;
    
    // Obtener la firma usando la referencia única
    const signature = await getPaymentSignature(order.totalWithTax, uniqueReference);
    
    // @ts-ignore
    const checkout = new window.WidgetCheckout({
      currency: 'COP',
      amountInCents: order.totalWithTax,
<<<<<<< HEAD
      reference: uuid(),
=======
      reference: uniqueReference,
>>>>>>> 924eb8ef3eb688ddef6a4d901c367e28be3a8ef1
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
