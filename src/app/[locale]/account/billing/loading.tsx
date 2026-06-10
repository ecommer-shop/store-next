import { I18N } from '@/i18n/keys';
import { useTranslations } from 'next-intl';
import { Spinner } from '@heroui/react';

export default function BillingLoading() {
  const t = useTranslations("Account.billing")
  return (
    <div className="flex flex-col items-center gap-2 py-20">
      <Spinner color="current" />
      <p className="text-muted-foreground">{t(I18N.Account.billing.loading.loading)}</p>
    </div>
  );
}
