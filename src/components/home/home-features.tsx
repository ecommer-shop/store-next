'use client';

import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';

export function HomeFeatures() {
    const t = useTranslations('Home');

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-3">
                        <div
                            className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold">{t(I18N.Home.features.quality.title)}</h3>
                        <p className="text-muted-foreground">{t(I18N.Home.features.quality.description)}</p>
                    </div>
                    <div className="space-y-3">
                        <div
                            className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold">{t(I18N.Home.features.prices.title)}</h3>
                        <p className="text-muted-foreground">{t(I18N.Home.features.prices.description)}</p>
                    </div>
                    <div className="space-y-3">
                        <div
                            className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold">{t(I18N.Home.features.delivery.title)}</h3>
                        <p className="text-muted-foreground">{t(I18N.Home.features.delivery.description)}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
