
import { Suspense } from 'react';
import CheckoutContent from './checkout-content';
import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import { noIndexRobots } from '@/lib/vendure/shared/metadata';
import { Spinner } from '@heroui/react';
import { WompiScrollFix } from './steps/payment-step';
import React from 'react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your purchase.',
  robots: noIndexRobots(),
};

interface PageProps {
  params: {
    locale: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}

export default function CheckoutPage(props: PageProps) {
  const PUBLIC_KEY = process.env.PAYMENT_PUBLIC_KEY!
  
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center gap-2">
        <Spinner color="current" />
      </div>
    }>
      
        <WompiScrollFix />
        <CheckoutContent
          params={props.params}
          searchParams={props.searchParams}
          pb={PUBLIC_KEY}
        />
      
    </Suspense>
  );
}