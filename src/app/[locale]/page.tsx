import type { Metadata } from "next";
import { HeroSection } from "@/components/layout/hero-section";
import { FeaturedProducts } from "@/components/commerce/featured-products";
import { SITE_NAME, SITE_URL, buildCanonicalUrl } from "@/lib/vendure/shared/metadata";
import { Suspense } from "react";
import { HomeFeatures } from "@/components/home/home-features";
import { BenefitBar } from "@/components/home/benefit-bar";
import { CategorySection, CategorySectionSkeleton } from "@/components/home/category-section";
import { query } from "@/lib/vendure/server/api";
import { SearchProductsQuery } from "@/lib/vendure/shared/queries";
import { readFragment } from "@/graphql";
import { ProductCardFragment } from "@/lib/vendure/shared/fragments";

export const metadata: Metadata = {
    title: {
        absolute: `${SITE_NAME}`,
    },
    description:
        "Descubre productos de alta calidad a precios competitivos. Compra en Ecommer: electrónica, moda, hogar y más.",
    alternates: {
        canonical: buildCanonicalUrl("/"),
    },
    openGraph: {
        title: `${SITE_NAME} - Marketplace Colombia`,
        description:
            "Descubre productos de alta calidad a precios competitivos. Compra en Ecommer.",
        type: "website",
        url: SITE_URL,
    },
};

async function getFeaturedProductIds(): Promise<string[]> {
    try {
        const result = await query(SearchProductsQuery, {
            input: { take: 12, skip: 0, groupByProduct: true },
        });
        return (result.data.search.items ?? []).map(
            (item) => readFragment(ProductCardFragment, item).productId
        );
    } catch {
        return [];
    }
}

export default async function Home(_props: PageProps<'/[locale]'>) {
    const featuredIds = await getFeaturedProductIds();

    return (
        <Suspense>
            <div className="min-h-screen bg-gray-50 dark:bg-[#0e0e2c]">
                <HeroSection />
                <BenefitBar />
                <FeaturedProducts />
                <HomeFeatures />

                <Suspense fallback={<CategorySectionSkeleton title="Electrónica" />}>
                    <CategorySection
                        collectionSlug="electronica"
                        title="Electrónica"
                        excludeIds={featuredIds}
                        take={6}
                    />
                </Suspense>

                <Suspense fallback={<CategorySectionSkeleton title="Casa y Jardín" />}>
                    <CategorySection
                        collectionSlug="casa-y-jardin"
                        title="Casa y Jardín"
                        excludeIds={featuredIds}
                        take={6}
                    />
                </Suspense>
            </div>
        </Suspense>
    );
}
