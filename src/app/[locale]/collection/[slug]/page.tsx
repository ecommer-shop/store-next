import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductGrid } from '@/components/commerce/product-grid';
import { FacetFilters } from '@/components/commerce/facet-filters/facet-filters';
import { ProductGridSkeleton } from '@/components/shared/product-grid-skeleton';
import { getCurrentPage } from '@/lib/vendure/shared/search-helpers';
import { query } from '@/lib/vendure/server/api';
import { GetProductsSellerNamesQuery } from '@/lib/vendure/shared/queries';
import { readFragment } from '@/graphql';
import { ProductCardFragment } from '@/lib/vendure/shared/fragments';

import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/lib/vendure/shared/metadata';
import { getCollectionMetadata, getCollectionProducts } from './actions';

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
    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            <Suspense fallback={<p></p>}>
                <CollectionContent params={params} searchParams={searchParams} />
            </Suspense>
        </div>
    );
}

async function CollectionContent({params, searchParams}: Props) {
    const { slug, locale } = await params;
    const searchParamsResolved = await searchParams;
    const page = getCurrentPage(searchParamsResolved);

    const productDataPromise = getCollectionProducts(slug, searchParamsResolved, locale);
    const collectionMeta = await getCollectionMetadata(slug, locale);
    const collectionName = collectionMeta.data.collection?.name || slug;

    // Fetch seller names for page 1 server-side
    let initialStoreNames: Record<string, string> = {};
    try {
        const productData = await productDataPromise;
        const productIds = (productData.data.search.items ?? []).map(
            (item) => readFragment(ProductCardFragment, item).productId
        );
        if (productIds.length > 0) {
            const sellerResult = await query(GetProductsSellerNamesQuery, {
                options: { filter: { id: { in: productIds } }, take: productIds.length },
            });
            for (const p of sellerResult.data.products.items ?? []) {
                const shop = (p as any).sellerShop as { sellerName?: string } | null | undefined;
                if (shop?.sellerName) {
                    initialStoreNames[p.id] = shop.sellerName;
                }
            }
        }
    } catch {
        // degrade gracefully
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
                <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
                    <FacetFilters productDataPromise={productDataPromise} activeCollectionSlug={slug} activeCollectionName={collectionName} />
                </Suspense>
            </aside>

            {/* Product Grid */}
            <div className="lg:col-span-3">
                <Suspense fallback={<ProductGridSkeleton />}>
                    <ProductGrid
                        productDataPromise={productDataPromise}
                        currentPage={page}
                        take={12}
                        searchParams={searchParamsResolved}
                        collectionSlug={slug}
                        initialStoreNames={initialStoreNames}
                    />
                </Suspense>
            </div>
        </div>
    );
}
