import type {Metadata} from 'next';
import {query} from '@/lib/vendure/server/api';
import {
    GetActiveOrderForCheckoutQuery,
    GetCustomerAddressesQuery,
    GetEligiblePaymentMethodsQuery,
    GetEligibleShippingMethodsQuery,
} from '@/lib/vendure/shared/queries';
import {redirect} from 'next/navigation';
import CheckoutFlow from './checkout-flow';
import {CheckoutProvider} from './checkout-provider';
import {noIndexRobots} from '@/lib/vendure/shared/metadata';
import {getActiveCustomer} from '@/lib/vendure/server/actions';
import {getAvailableCountriesCached} from '@/lib/vendure/cached';
import { useAuth } from '@/components/shared/useAuth';
import { Suspense } from 'react';
import CheckoutContent from './checkout-content';

export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Complete your purchase.',
    robots: noIndexRobots(),
};

export default function CheckoutPage(_props: PageProps<'/checkout'>) {
    return(
        <CheckoutContent params={_props.params} searchParams={_props.searchParams}/>
    )
}
