'use client';

import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';

export function CopyrightContent() {
    const t = useTranslations('Layout');
    return (
        <div>
            {t(I18N.Layout.footer.copyright, {year: new Date().getFullYear()})}
        </div>
    );
}

export function FooterCategoriesLabel() {
    const t = useTranslations('Layout');
    return <>{t(I18N.Layout.footer.sections.categories)}</>;
}

export function FooterGitHubLink() {
    const t = useTranslations('Layout');
    return <>{t(I18N.Layout.footer.links.github)}</>;
}
