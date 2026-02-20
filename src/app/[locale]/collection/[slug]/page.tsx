import type { Metadata } from 'next';
import { Suspense } from 'react';
import { query } from '@/lib/vendure/server/api';
import { SearchProductsQuery, GetCollectionProductsQuery } from '@/lib/vendure/shared/queries';
import { ProductGrid } from '@/components/commerce/product-grid';
import { FacetFilters } from '@/components/commerce/facet-filters/facet-filters';
import { ProductGridSkeleton } from '@/components/shared/product-grid-skeleton';
import { buildSearchInput, getCurrentPage } from '@/lib/vendure/shared/search-helpers';
import { unstable_cache } from 'next/cache';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/lib/vendure/shared/metadata';
import { getTranslations } from 'next-intl/server';

/* const getCollectionProducts = (slug: string, searchParams: { [key: string]: string | string[] | undefined }) => 
    unstable_cache(
    async () => {
        return query(SearchProductsQuery, {
        input: buildSearchInput({
            searchParams,
            collectionSlug: slug
        })
    });
    },
    [`collection-${slug}`],
    {
        revalidate: 60 * 120
    } 
)()    
    
const getCollectionMetadata = (slug: string) =>
  unstable_cache(
    async () => {
      return query(GetCollectionProductsQuery, {
        slug,
        input: {
          take: 0,
          collectionSlug: slug,
          groupByProduct: true,
        },
      });
    },
    [`collection-meta-${slug}`],
    { revalidate: 60 * 120 }
  );*/

const getCollectionProducts = async (slug: string, searchParams: { [key: string]: string | string[] | undefined }) => {
    return await query(SearchProductsQuery, {
        input: buildSearchInput({
            searchParams,
            collectionSlug: slug
        })
    })
}

const getCollectionMetadata = async (slug: string) => {
    return await query(GetCollectionProductsQuery, {
        slug,
        input: {
            take: 0,
            collectionSlug: slug,
            groupByProduct: true,
        },
    });
}

type Props = {
    params: Promise<{ locale: string; slug: string }>;
    searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const { slug } = await params;
    const result = await getCollectionMetadata(slug);
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

export default async function CollectionPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const searchParamsResolved = await searchParams;
    const page = getCurrentPage(searchParamsResolved);

    const productDataPromise = getCollectionProducts(slug, searchParamsResolved);
    const t = getTranslations()
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