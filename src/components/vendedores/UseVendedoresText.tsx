'use client';

import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';

interface VendedoresTextProps {
  path: string[];
}

export function UseVendedoresText({ path }: VendedoresTextProps) {
  const t = useTranslations('Vendedores');

  const key = path.reduce(
    (acc: any, k) => acc?.[k],
    I18N.Vendedores
  );

  return <>{t(key)}</>;
}