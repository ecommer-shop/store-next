'use client';

import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';

export function RelatedProductsTitle() {
    const t = useTranslations('Commerce');
    return t(I18N.Commerce.relatedProducts.title);
}
