'use client';

import { UseAboutText } from './UseAboutText';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Truck, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function AudienceSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">
            <UseAboutText path={['audience', 'title']} />
          </h2>
          <p className="text-muted-foreground text-lg">
            <UseAboutText path={['audience', 'description']} />
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto mb-10">
          <Card className="p-6 text-center space-y-3">
            <ShieldCheck className="size-10 mx-auto text-primary" />
            <p className="font-medium">
              <UseAboutText path={['audience', 'securePayments']} />
            </p>
          </Card>
          <Card className="p-6 text-center space-y-3">
            <Truck className="size-10 mx-auto text-primary" />
            <p className="font-medium">
              <UseAboutText path={['audience', 'localDelivery']} />
            </p>
          </Card>
          <Card className="p-6 text-center space-y-3">
            <Clock className="size-10 mx-auto text-primary" />
            <p className="font-medium">
              <UseAboutText path={['audience', 'alwaysOpen']} />
            </p>
          </Card>
        </div>

        <div className="text-center">
          <Link
            href="https://admin.ecommer.shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <UseAboutText path={['audience', 'cta']} />
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
