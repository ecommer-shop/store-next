import {Button} from "@heroui/react";
import Link from "next/link";
export function HeroSection() {
    return (
        <section className="relative bg-muted overflow-hidden mt-10 ">
            {/* Fondo LIGHT */}
            <img
                src="/bg-light.webp"
                className="absolute inset-0 w-full h-full object-cover block dark:hidden"
                alt=""
                aria-hidden
            />

            {/* Fondo DARK */}
            <img
                src="/bg-dark2.webp"
                className="absolute inset-0 w-full h-full object-cover hidden dark:block"
                alt=""
                aria-hidden
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
            <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                    Ecommer!
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis maiores
                </p>

                <div className="flex justify-center pt-4">
                    <Button
                    asChild
                    size="lg"
                    className="min-w-[200px] bg-[#6BB8FF] dark:bg-[#9969F8]"
                    >
                    <Link href="/search">Shop Now</Link>
                    </Button>
                </div>
                </div>
            </div>
        </section>
    );
}
