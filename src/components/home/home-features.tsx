'use client';

import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, FileText, ShieldCheck } from 'lucide-react';

const trustBadges = [
    {
        icon: BadgeCheck,
        title: 'Legalmente Avalado',
        description: 'Empresas verificadas ante la CCB.',
        color: '#6BB8FF',
    },
    {
        icon: FileText,
        title: 'Facturación Electrónica',
        description: 'Transparencia en cada transacción.',
        color: '#9969F8',
    },
    {
        icon: ShieldCheck,
        title: 'Pagos Protegidos',
        description: 'Wompi y pasarelas de alta seguridad.',
        color: '#6BB8FF',
    },
];

export function HomeFeatures() {
    const t = useTranslations('Home');

    return (
        <section className="pb-16 pt-10 bg-white dark:bg-[#12123F]/20">
            <div className="container mx-auto px-4">

                {/* Trust Badges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {trustBadges.map((badge, index) => {
                        const Icon = badge.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a3e] hover:shadow-md transition-shadow duration-200"
                            >
                                <div
                                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ background: `${badge.color}22` }}
                                >
                                    <Icon size={22} style={{ color: badge.color }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                        {badge.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                        {badge.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Logos institucionales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
                    <div className="space-y-3">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                            <Image src="/Icono-CyC.png" width={80} height={80} alt="Cámara de Comercio" className="object-contain" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">{t(I18N.Home.features.cyc.title)}</h3>
                        <p className="text-muted-foreground text-xs">{t(I18N.Home.features.cyc.description)}</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                            <Image src="/Icono-Dian.png" width={80} height={80} alt="DIAN" className="object-contain" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">{t(I18N.Home.features.dian.title)}</h3>
                        <p className="text-muted-foreground text-xs">{t(I18N.Home.features.dian.description)}</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                            <Image src="/Icono-Wompi.png" width={80} height={80} alt="Wompi" className="object-contain scale-125" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">{t(I18N.Home.features.wompi.title)}</h3>
                        <p className="text-muted-foreground text-xs">{t(I18N.Home.features.wompi.description)}</p>
                    </div>
                </div>

                {/* CTA Vendedores */}
                <div
                    className="rounded-2xl p-8 md:p-10 text-center relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #12123F 0%, #1e1b6e 50%, #4c1d95 100%)"
                    }}
                >
                    <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white opacity-5" />
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-purple-400 opacity-10" />
                    <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-2">
                            Para Vendedores
                        </p>
                        <p className="text-xl md:text-2xl font-black text-white mb-3">
                            {t(I18N.Home.sellersCta.title)}
                        </p>
                        <p className="text-sm text-white/70 max-w-2xl mx-auto mb-6">
                            {t(I18N.Home.sellersCta.description)}
                        </p>
                        <Link
                            href="/sellers"
                            className="inline-flex items-center justify-center rounded-xl px-8 py-3 font-bold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                            style={{ background: "linear-gradient(90deg, #6BB8FF, #9969F8)" }}
                        >
                            {t(I18N.Home.sellersCta.button)}
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
