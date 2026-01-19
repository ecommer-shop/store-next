'use client';

import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';

export function FeaturedProductsLoading() {
    const t = useTranslations('Commerce');
    return <p>{t(I18N.Commerce.featuredProducts.loading)}</p>;
}
