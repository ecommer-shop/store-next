export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import AddressesContent from './addresses-content';
import { I18N } from '@/i18n/keys';

export default function AddressesPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">{I18N.Account.addresses.loading.loading}</p>}>
      <AddressesContent />
    </Suspense>
  );
}
