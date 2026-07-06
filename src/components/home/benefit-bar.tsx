'use client';

import { Truck, ShieldCheck, CreditCard, Store, Star, Headphones } from 'lucide-react';
import { useRef } from 'react';

const benefits = [
    {
        icon: Truck,
        title: 'Envío Gratis',
        subtitle: 'En miles de productos',
        color: '#6BB8FF',
    },
    {
        icon: ShieldCheck,
        title: 'Compra Segura',
        subtitle: 'Tus datos protegidos',
        color: '#9969F8',
    },
    {
        icon: CreditCard,
        title: 'Medios de Pago',
        subtitle: 'Hasta 12 cuotas fijas',
        color: '#6BB8FF',
    },
    {
        icon: Store,
        title: 'Vende Aquí',
        subtitle: 'Llega a todo el país',
        color: '#9969F8',
    },
    {
        icon: Star,
        title: 'Puntos Ecommer',
        subtitle: 'Acumula y canjea',
        color: '#6BB8FF',
    },
    {
        icon: Headphones,
        title: 'Ayuda 24/7',
        subtitle: 'Soporte personalizado',
        color: '#9969F8',
    },
];

export function BenefitBar() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <section className="bg-white dark:bg-[#1a1a3e] border-b border-gray-100 dark:border-white/10 shadow-sm">
            {/* Mobile: horizontal scroll carousel */}
            <div
                ref={scrollRef}
                className="flex lg:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory px-3 py-3 gap-3"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                        <div
                            key={index}
                            className="flex-none snap-start flex flex-row items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 min-w-[160px]"
                        >
                            <div
                                className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                                style={{ background: `${benefit.color}22` }}
                            >
                                <Icon size={22} style={{ color: benefit.color }} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight whitespace-nowrap">
                                    {benefit.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight whitespace-nowrap">
                                    {benefit.subtitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop: grid layout */}
            <div className="hidden lg:block container mx-auto px-4">
                <div className="grid grid-cols-6 divide-x divide-gray-100 dark:divide-white/10">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={index}
                                className="flex flex-row items-center gap-3 px-4 py-5 group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
                            >
                                <div
                                    className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                                    style={{ background: `${benefit.color}22` }}
                                >
                                    <Icon
                                        size={22}
                                        style={{ color: benefit.color }}
                                        className="transition-transform duration-200 group-hover:scale-110"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">
                                        {benefit.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                        {benefit.subtitle}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
