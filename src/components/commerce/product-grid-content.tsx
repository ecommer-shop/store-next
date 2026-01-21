'use client';

import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';

function ProductGridNoProducts() {
    const t = useTranslations('Commerce');
    return (
        <div className="text-center py-12">
            <p className="text-muted-foreground">{t(I18N.Commerce.productGrid.noProducts)}</p>
        </div>
    );
}

function ProductCount({ count }: { count: number }) {
    const t = useTranslations('Commerce');
    const label = count === 1 ? I18N.Commerce.productGrid.product : I18N.Commerce.productGrid.products;
    return <span>{count} {t(label)}</span>;
}

export { ProductGridNoProducts, ProductCount };
