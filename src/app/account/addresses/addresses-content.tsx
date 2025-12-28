import { AddressesClient } from './addresses-client';
import { query } from '@/lib/vendure/server/api';
import {
  GetAvailableCountriesQuery,
  GetCustomerAddressesQuery,
} from '@/lib/vendure/shared/queries';

export default async function AddressesContent() {
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
        <p className="text-foreground mt-2">
          Manage your saved shipping and billing addresses
        </p>
      </div>

      <AddressesClient addresses={addresses} countries={countries} />
    </div>
  );
}
