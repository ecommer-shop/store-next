import type {Metadata} from 'next';
import {noIndexRobots} from '@/lib/vendure/shared/metadata';
import { Suspense } from 'react';
import CheckoutContent from './checkout-content';

export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Complete your purchase.',
    robots: noIndexRobots(),
};

interface PageProps<T> {
    params: {
        locale: string;
    };
    searchParams: Record<string, string | string[] | undefined>;
}

export default function CheckoutPage(_props: PageProps<'/checkout'>) {
    return(
        <Suspense>
            <CheckoutContent params={_props.params} searchParams={_props.searchParams}/>
        </Suspense>
    )
}
