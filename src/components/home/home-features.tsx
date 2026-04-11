'use client';

import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import Image from 'next/image';

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
            </div>
        </section>
    );
}
