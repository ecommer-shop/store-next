import type {Metadata} from 'next';
import {Suspense} from 'react';
import {OrderConfirmation} from './order-confirmation';
import {noIndexRobots} from '@/lib/vendure/shared/metadata';
import { useAuth } from '@/components/shared/useAuth';

export const metadata: Metadata = {
    title: 'Order Confirmation',
    description: 'Your order has been placed successfully.',
    robots: noIndexRobots(),
};

export default async function OrderConfirmationPage(props: PageProps<'/order-confirmation/[code]'>) {
    useAuth();
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Loading...</div>}>
            <OrderConfirmation {...props} />
        </Suspense>
    );
}
