import type {Metadata} from 'next';
import {Suspense} from 'react';
import {OrderConfirmation} from './order-confirmation';
import {noIndexRobots} from '@/lib/vendure/shared/metadata';
import { useAuth } from '@/components/shared/useAuth';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Order Confirmation',
    description: 'Your order has been placed successfully.',
    robots: noIndexRobots(),
};
interface PageProps {
    params: {
        code: string;
        locale: string;
    };
    searchParams: Record<string, string | string[] | undefined>;
}

export default async function OrderConfirmationPage(props: PageProps) {
    useAuth();
    const t = await getTranslations('OrderConfirmation');    
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Loading...</div>}>
            <OrderConfirmation {...props} t={t} />
        </Suspense>
    );
}
