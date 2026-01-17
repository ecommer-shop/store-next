

import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import { getTranslations } from 'next-intl/server';

export function RelatedProductsTitle() {
    const t = useTranslations('Commerce');
    return t(I18N.Commerce.relatedProducts.title);
}

export async function RelatedProductsTitleAsync() {
    const t = await getTranslations('Commerce');
    return t(I18N.Commerce.relatedProducts.title);
}
