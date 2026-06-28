'use client';

import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import Image from 'next/image';
import Link from 'next/link';

export function HomeFeatures() {
    const t = useTranslations('Home');

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-3">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center overflow-hidden">
                            <Image src="/Icono-CyC.png" width={80} height={80} alt="Cámara de Comercio" className="object-contain" />
                        </div>
                        <h3 className="text-xl font-semibold">{t(I18N.Home.features.cyc.title)}</h3>
                        <p className="text-muted-foreground text-sm">{t(I18N.Home.features.cyc.description)}</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center overflow-hidden">
                            <Image src="/Icono-Dian.png" width={80} height={80} alt="DIAN" className="object-contain" />
                        </div>
                        <h3 className="text-xl font-semibold">{t(I18N.Home.features.dian.title)}</h3>
                        <p className="text-muted-foreground text-sm">{t(I18N.Home.features.dian.description)}</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center">
                            <Image src="/Icono-Wompi.png" width={80} height={80} alt="Wompi" className="object-contain scale-125" />
                        </div>
                        <h3 className="text-xl font-semibold">{t(I18N.Home.features.wompi.title)}</h3>
                        <p className="text-muted-foreground text-sm">{t(I18N.Home.features.wompi.description)}</p>
                    </div>
                </div>

                <div className="mt-14 rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#12123F]/60 backdrop-blur-md p-6 md:p-8 text-center">
                    <p className="text-xl md:text-2xl font-semibold text-[#12123F] dark:text-[#F1F1F1] mb-3">
                        {t(I18N.Home.sellersCta.title)}
                    </p>
                    <p className="text-sm md:text-base text-[#12123F]/70 dark:text-[#F1F1F1]/70 max-w-2xl mx-auto mb-6">
                        {t(I18N.Home.sellersCta.description)}
                    </p>
                    <Link
                        href="/sellers"
                        className="inline-flex items-center justify-center rounded-md px-6 py-3 font-semibold text-white bg-linear-to-r from-[#6BB8FF] to-[#9969F8] hover:opacity-90 transition-all"
                    >
                        {t(I18N.Home.sellersCta.button)}
                    </Link>
                </div>
            </div>
        </section>
    );
}
