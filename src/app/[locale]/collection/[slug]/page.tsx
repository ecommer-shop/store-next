import type { Metadata } from 'next';
import { Suspense } from 'react';
import { query } from '@/lib/vendure/server/api';
import { SearchProductsQuery, GetCollectionProductsQuery } from '@/lib/vendure/shared/queries';
import { ProductGrid } from '@/components/commerce/product-grid';
import { FacetFilters } from '@/components/commerce/facet-filters/facet-filters';
import { ProductGridSkeleton } from '@/components/shared/product-grid-skeleton';
import { buildSearchInput, getCurrentPage } from '@/lib/vendure/shared/search-helpers';

import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/lib/vendure/shared/metadata';
import { getTranslations } from 'next-intl/server';

const serializeSearchParams = (searchParams: { [key: string]: string | string[] | undefined }) => {
    const entries: Array<[string, string]> = [];

    for (const [key, value] of Object.entries(searchParams)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
            for (const v of value) entries.push([key, v]);
        } else {
            entries.push([key, value]);
        }
    }

    // Sorting keeps the cache key stable regardless of param order
    entries.sort(([aKey, aVal], [bKey, bVal]) =>
        aKey === bKey ? aVal.localeCompare(bVal) : aKey.localeCompare(bKey)
    );

    return new URLSearchParams(entries).toString();
};

const getCollectionProducts = (
    slug: string,
    searchParams: { [key: string]: string | string[] | undefined },
    locale: string
) => {
    return query(
        SearchProductsQuery,
        {
            input: buildSearchInput({
                searchParams,
                collectionSlug: slug,
            }),
        },
        {
            languageCode: locale,
        }
    );
}


const getCollectionMetadata = (slug: string, locale: string) => {
    return query(GetCollectionProductsQuery, {
        slug,
        input: {
            take: 0,
            collectionSlug: slug,
            groupByProduct: true,
        },
    }, {
        languageCode: locale,
    });
}


type Props = {
    params: Promise<{ locale: string; slug: string }>;
    searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const result = await getCollectionMetadata(slug, locale);
    const collection = result.data.collection;

    if (!collection) {
        return {
            title: 'Collection Not Found',
        };
    }

    const description =
        truncateDescription(collection.description) ||
        `Browse our ${collection.name} collection at ${SITE_NAME}`;

    return {
        title: collection.name,
        description,
        alternates: {
            canonical: buildCanonicalUrl(`/collection/${collection.slug}`),
        },
        openGraph: {
            title: collection.name,
            description,
            type: 'website',
            url: buildCanonicalUrl(`/collection/${collection.slug}`),
            images: buildOgImages(collection.featuredAsset?.preview, collection.name),
        },
        twitter: {
            card: 'summary_large_image',
            title: collection.name,
            description,
            images: collection.featuredAsset?.preview
                ? [collection.featuredAsset.preview]
                : undefined,
        },
    };
}

export default async function CollectionPage({params, searchParams}: Props) {
    const { slug, locale } = await params;
    const searchParamsResolved = await searchParams;
    const page = getCurrentPage(searchParamsResolved);

    const productDataPromise = getCollectionProducts(slug, searchParamsResolved, locale);
    const t = await getTranslations();
    return (
        <Suspense fallback={
            <p></p>
        }>
            <div className="container mx-auto px-4 py-8 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
                            <FacetFilters productDataPromise={productDataPromise} />
                        </Suspense>
                    </aside>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        <Suspense fallback={<ProductGridSkeleton />}>
                            <ProductGrid productDataPromise={productDataPromise} currentPage={page} take={12} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
