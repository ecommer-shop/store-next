import type {Metadata} from 'next';
import { query } from '@/lib/vendure/api';

export const metadata: Metadata = {
    title: 'Addresses',
};
import { GetCustomerAddressesQuery, GetAvailableCountriesQuery } from '@/lib/vendure/queries';
import { AddressesClient } from './addresses-client';
import { auth } from '@clerk/nextjs/server';
import { RedirectToSignIn, SignedOut } from '@clerk/nextjs';

export default async function AddressesPage(_props: PageProps<'/account/addresses'>) {
    const user = auth();

    if((await user).isAuthenticated) {
        return (
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>)
    }
    const [addressesResult, countriesResult] = await Promise.all([
        query(GetCustomerAddressesQuery, {}, { useAuthToken: true }),
        query(GetAvailableCountriesQuery, {}),
    ]);

    const addresses = addressesResult.data.activeCustomer?.addresses || [];
    const countries = countriesResult.data.availableCountries || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Addresses</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your saved shipping and billing addresses
                </p>
            </div>

            <AddressesClient addresses={addresses} countries={countries} />
        </div>
    );
}
