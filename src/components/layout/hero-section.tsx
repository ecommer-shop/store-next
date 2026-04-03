'use client';

import { I18N } from "@/i18n/keys";
import {Button} from "@heroui/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
export function HeroSection() {
    const t = useTranslations("HeroSection");
    return (
        <section className="relative bg-muted overflow-hidden mt-4 ">
            {/* Fondo LIGHT */}
            <Image
                src="/bg-light.webp"
                className="absolute inset-0 w-full h-full object-cover block dark:hidden"
                alt=""
                aria-hidden
                width={500}
                height={500}
            />

            {/* Fondo DARK */}
            <Image
                src="/bg-dark.webp"
                className="absolute inset-0 w-full h-full object-cover hidden dark:block"
                alt=""
                aria-hidden
                width={500}
                height={500}
            />

            {/* Capa liquid blur */}
            <div
                className="
                absolute inset-0
                backdrop-blur-2xl
                bg-[#f1f1f1]/40
                dark:bg-[#12123f]/40
                pointer-events-none
                "
            />

            {/* Contenido */}
            <div className="relative z-10 container mx-auto px-4 py-6 md:py-10">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                <h1 className="flex justify-center" translate="no">
                    <Image
                        src="/logo-vendedores-dark.png"
                        alt="Ecommer!"
                        width={600}
                        height={150}
                        className="max-w-full h-auto"
                        priority
                    />
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                    {t(I18N.HeroSection.title)}
                    <br />
                    {t(I18N.HeroSection.description)}
                </p>

                <div className="flex justify-center">
                    <Link className="rounded-md" href="/search">
                        <Button
                            size="lg"
                            className="min-w-[200px] bg-[#6BB8FF] dark:bg-[#9969F8] rounded-md"
                        >
                            {t(I18N.HeroSection.shopButton)}
                        </Button>
                    </Link>
                </div>
                </div>
            </div>
        </section>
    );
}
