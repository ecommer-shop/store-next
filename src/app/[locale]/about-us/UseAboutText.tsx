'use client';

import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';

interface AboutTextProps {
  path: string[];
}

export function UseAboutText({ path }: AboutTextProps) {
  const t = useTranslations('About');

  const key = path.reduce(
    (acc: any, k) => acc?.[k],
    I18N.About
  );

  return <>{t(key)}</>;
}
