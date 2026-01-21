import { Suspense } from 'react';
import CheckoutContent from './checkout-content';
import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import { noIndexRobots } from '@/lib/vendure/shared/metadata';

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
  const t = useTranslations('Checkout');
  return (
    <Suspense>
      <CheckoutContent
        params={props.params}
        searchParams={props.searchParams}
        t={t}
      />
    </Suspense>
  );
}