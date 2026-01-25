export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import AddressesContent from './addresses-content';
import { I18N } from '@/i18n/keys';
import { useTranslations } from 'next-intl';
import { Spinner } from '@heroui/react';

export default function AddressesPage() {
  const t = useTranslations("Account.addresses")
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center gap-2">
        <Spinner color="current" />
        <p className="text-muted-foreground">{t(I18N.Account.addresses.loading.loading)}</p>
      </div>
    }>
      <AddressesContent />
    </Suspense>
  );
}
