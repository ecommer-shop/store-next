import type {Metadata} from "next";
import {HeroSection} from "@/components/layout/hero-section";
import {FeaturedProducts} from "@/components/commerce/featured-products";
import {SITE_NAME, SITE_URL, buildCanonicalUrl} from "@/lib/vendure/shared/metadata";
import { Suspense } from "react";
import { HomeFeatures } from "@/components/home/home-features";

export const metadata: Metadata = {
    title: {
        absolute: `${SITE_NAME}`,
    },
    description:
        "Discover high-quality products at competitive prices. Shop now for the best deals on electronics, fashion, home goods, and more.",
    alternates: {
        canonical: buildCanonicalUrl("/"),
    },
    openGraph: {
        title: `${SITE_NAME} - Your One-Stop Shop`,
        description:
            "Discover high-quality products at competitive prices. Shop now for the best deals.",
        type: "website",
        url: SITE_URL,
    },
    icons: {
         icon: [
            {
                url: "/logo-dark.webp",
                media: "(prefers-color-scheme: light)",
            },
            {
                url: "/logo-light.webp",
                media: "(prefers-color-scheme: dark)",
            },
            ],
    }
};

export default async function Home(_props: PageProps<'/[locale]'>) {
    return (
        <Suspense>
            <div className="">
                <HeroSection/>
                <FeaturedProducts/>
                <HomeFeatures />
            </div>
        </Suspense>
    );
}
