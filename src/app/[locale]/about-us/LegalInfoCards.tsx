'use client';

import { UseAboutText } from './UseAboutText';
import { Card } from '@/components/ui/card';

export function LegalInfoCards() {
  return (
    <section className="container mx-auto px-4 py-16 grid gap-6 md:grid-cols-3">
      <Card className="p-6 space-y-2">
        <h2 className="text-lg font-semibold">
          <UseAboutText path={['legal', 'label']} />
        </h2>
        <p>
          <strong><UseAboutText path={['legal', 'rs']} /></strong> Ecommer SAS
        </p>
        <p><strong>NIT:</strong> 902008723</p>
        <p>
          <strong><UseAboutText path={['legal', 'address']} /></strong> Carrera 2a 3N 23, Antiguo Liceo Popayán Cauca, CO
        </p>
      </Card>

      <Card className="p-6 space-y-2">
        <h2 className="text-lg font-semibold">
          <UseAboutText path={['contact', 'label']} />
        </h2>
        <p>
          <strong><UseAboutText path={['contact', 'phone']} /></strong> 3223647362
        </p>
        <p><strong>WhatsApp:</strong> 3223647362</p>
        <p><strong>Email:</strong> legal@ecommer.shop</p>
      </Card>

      <Card className="p-6 space-y-2">
        <h2 className="text-lg font-semibold">
          <UseAboutText path={['hours', 'label']} />
        </h2>
        <p><UseAboutText path={['hours', 'days']} /></p>
        <p>8:00 – 12:00</p>
        <p>14:00 – 17:00</p>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="text-lg font-semibold">
          <UseAboutText path={['documents', 'label']} />
        </h2>

        <a
          href="https://ecommer-stg-product-images.s3.us-east-2.amazonaws.com/TemsAndConds.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-primary underline"
        >
          <UseAboutText path={['documents', 'terms']} />
        </a>
        <a
          href="https://ecommer-stg-product-images.s3.us-east-2.amazonaws.com/TemsAndConds.pdf#page=5"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-primary underline"
        >
          <UseAboutText path={['documents', 'warranty']} />
        </a>
        <a
          href="https://ecommer-stg-product-images.s3.us-east-2.amazonaws.com/TemsAndConds.pdf#page=9"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-primary underline"
        >
          <UseAboutText path={['documents', 'withdrawal']} />
        </a>
        <a
          href="https://ecommer-stg-product-images.s3.us-east-2.amazonaws.com/TemsAndConds.pdf#page=10"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-primary underline"
        >
          <UseAboutText path={['documents', 'paymentReversal']} />
        </a>
      </Card>
    </section>
  );
}
