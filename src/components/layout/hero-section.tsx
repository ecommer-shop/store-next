'use client';

import { useTranslations } from "next-intl";
import { I18N } from "@/i18n/keys";
import Image from "next/image";
import Link from "next/link";
import { trackClickExplore } from "@/lib/analytics/events";

export function HeroSection() {
    const t = useTranslations("HeroSection");

    return (
        <section
            className="relative overflow-hidden mt-[64px]"
            style={{
                background: "linear-gradient(135deg, #12123F 0%, #1e1b6e 40%, #4c1d95 75%, #6d28d9 100%)",
                minHeight: "260px",
            }}
        >
            {/* Background image — visible on all screen sizes */}
            <div className="absolute inset-0">
                <Image
                    src="/Publicidad_Ecom.png"
                    alt="Publicidad Ecommer"
                    fill
                    className="object-cover object-center opacity-90"
                    priority
                    sizes="100vw"
                />
                {/* Gradient: on mobile covers only ~40% left, on desktop ~50% */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(90deg, #12123F 0%, #12123F 30%, rgba(18,18,63,0.75) 45%, rgba(18,18,63,0.2) 65%, transparent 100%)",
                    }}
                />
            </div>

            {/* Text content */}
            <div className="relative z-10 container mx-auto px-6 py-10 md:py-16 flex items-center min-h-[260px]">
                <div className="max-w-xs sm:max-w-sm md:max-w-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300 mb-3">
                        Ecommer · Marketplace Colombia
                    </p>
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5"
                        style={{ fontFamily: "var(--font-gilroy, system-ui)" }}
                    >
                        Lleva tu<br />
                        negocio al<br />
                        <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: "linear-gradient(90deg, #6BB8FF, #a78bfa)" }}
                        >
                            mundo digital.
                        </span>
                    </h1>
                    <Link href="/search" onClick={() => trackClickExplore()}>
                        <button
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-md font-bold text-base text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                            style={{
                                background: "linear-gradient(90deg, #6BB8FF, #9969F8)",
                            }}
                        >
                            {t(I18N.HeroSection.shopButton)}
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
