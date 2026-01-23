import { I18N } from '@/i18n/keys';
import { AddressesClient } from './addresses-client';
import { query } from '@/lib/vendure/server/api';
import {
  GetAvailableCountriesQuery,
  GetCustomerAddressesQuery,
} from '@/lib/vendure/shared/queries';
import { getTranslations } from 'next-intl/server';
import { getAuthToken } from '@/lib/vendure/server/auth';


export default async function AddressesContent() {
  const authToken = await getAuthToken();
  const [addressesResult, countriesResult] = await Promise.all([
    query(GetCustomerAddressesQuery, {}, { token: authToken ,useAuthToken: true }),
    query(GetAvailableCountriesQuery, {}),
  ]);

  const addresses = addressesResult.data.activeCustomer?.addresses || [];
  const countries = countriesResult.data.availableCountries || [];
  const t = await getTranslations('Account.addresses');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t(I18N.Account.addresses.content.title)}</h1>
        <p className="text-foreground mt-2">
          {t(I18N.Account.addresses.content.description)}
        </p>
      </div>

      <AddressesClient addresses={addresses} countries={countries} />
    </div>
  );
}
