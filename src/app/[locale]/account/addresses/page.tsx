export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import AddressesContent from './addresses-content';
import { I18N } from '@/i18n/keys';
import { useTranslations } from 'next-intl';

export default function AddressesPage() {
  const t = useTranslations("Account.addresses")
  return (
    <Suspense fallback={<p className="text-muted-foreground">{t(I18N.Account.addresses.loading.loading)}</p>}>
      <AddressesContent />
    </Suspense>
  );
}
