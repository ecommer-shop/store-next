import type { Metadata } from 'next';
import { query } from '@/lib/vendure/server/api';
import {
    GetActiveOrderForCheckoutQuery,
    GetAvailableCountriesQuery,
    GetCustomerAddressesQuery,
    GetEligiblePaymentMethodsQuery,
    GetEligibleShippingMethodsQuery,
} from '@/lib/vendure/shared/queries';
import { redirect } from '@/i18n/navigation';
import CheckoutFlow from './checkout-flow';
import { CheckoutProvider } from './checkout-provider';
import { noIndexRobots } from '@/lib/vendure/shared/metadata';
import { getAvailableCountriesCached } from '@/lib/vendure/cached';
import { Suspense } from 'react';
import { I18N } from '@/i18n/keys';
import { getTranslations } from 'next-intl/server';
import { setShippingMethod } from './actions';
import { getAuthToken } from '@/lib/vendure/server/auth';
import { Spinner } from '@heroui/react';

const MESSENGER_DOMIS_SHIPPING_METHOD_CODE = 'messenger-domis-shipping';


export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Complete your purchase.',
    robots: noIndexRobots(),
};
interface CheckoutContentProps {
    params: {
        locale: string;
    };
    searchParams: Record<string, string | string[] | undefined>;
    pb: string;
    uri: string;
}

export default async function CheckoutContent({ pb, uri, params }: CheckoutContentProps) {
    const { locale } = params;
    const ts = await getTranslations('Checkout');
    const tsa = await getTranslations('Account')
    const token = await getAuthToken();
    const [orderRes, addressesRes, shippingMethodsRes, paymentMethodsRes] =
        await Promise.all([
            query(GetActiveOrderForCheckoutQuery, {}, { token, useAuthToken: true }),
            query(GetCustomerAddressesQuery, {}, { token, useAuthToken: true }),
            query(GetEligibleShippingMethodsQuery, {}, { token, useAuthToken: true }),
            query(GetEligiblePaymentMethodsQuery, {}, { token, useAuthToken: true }),
        ]);

    const [countriesResult] = await Promise.all([
        query(GetAvailableCountriesQuery, {}),
    ]);

    const countries = countriesResult.data.availableCountries;
    const activeOrder = orderRes.data.activeOrder;

    if (!activeOrder || activeOrder.lines.length === 0) {
        return redirect({ href: '/cart', locale });
    }

    // If the order is no longer in AddingItems state, it's been completed
    // Redirect to the order confirmation page
    if (activeOrder.state !== 'AddingItems' && activeOrder.state !== 'ArrangingPayment') {
        return redirect({ href: `/order-confirmation/${activeOrder.code}`, locale });
    }

    const addresses = addressesRes.data.activeCustomer?.addresses || [];
    const shippingMethods = (shippingMethodsRes.data.eligibleShippingMethods || [])
        .filter(method => method.code === MESSENGER_DOMIS_SHIPPING_METHOD_CODE)
        .slice(0, 1);
    const paymentMethods =
        paymentMethodsRes.data.eligiblePaymentMethods?.filter((m) => m.isEligible) || [];
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    return (
        <Suspense fallback={
            <div className="flex flex-col items-center gap-2">
                <Spinner color="current" />
                <p>{tsa(I18N.Account.common.loading)}</p>
            </div>

        }>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 mt-10">{ts(I18N.Checkout.title)}</h1>
                <CheckoutProvider
                    order={activeOrder}
                    addresses={addresses}
                    countries={countries}
                    shippingMethods={shippingMethods}
                    paymentMethods={paymentMethods}
                    googleMapsApiKey={googleMapsApiKey}
                >
                    <CheckoutFlow onSetShippingMethod={setShippingMethod} pb={pb} uri={uri}/>
                </CheckoutProvider>
            </div>
        </Suspense>
    );
}
