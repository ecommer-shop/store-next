import { Suspense } from "react";
import { FacetFilters } from "@/components/commerce/facet-filters/facet-filters";
import { ProductGrid } from "@/components/commerce/product-grid";
import { getCurrentPage } from "@/lib/vendure/shared/search-helpers";
import { buildResolvedSearchInput } from "@/lib/vendure/shared/build-resolved-search-input";
import { query } from "@/lib/vendure/server/api";
import { SearchProductsQuery, GetProductsSellerNamesQuery } from "@/lib/vendure/shared/queries";
import { readFragment } from "@/graphql";
import { ProductCardFragment } from "@/lib/vendure/shared/fragments";
import { Spinner } from "@heroui/react";
import { redirect } from "@/i18n/navigation";
import { getCollectionsForRouting, getFacetsCatalog } from "@/lib/vendure/cached";
import {
    extractFacetTokens,
    findCategoryCollectionRedirect,
    getFacetUrlToken,
} from "@/lib/vendure/shared/facet-url";
import { getLocale } from "next-intl/server";

interface SearchResultsProps {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined
    }>
}

export async function SearchResults({ searchParams }: SearchResultsProps) {
    const searchParamsResolved = await searchParams;
    const page = getCurrentPage(searchParamsResolved);
    const locale = await getLocale();

    const [catalog, collections] = await Promise.all([
        getFacetsCatalog(),
        getCollectionsForRouting(),
    ]);

    // If a Categoría facet maps to a collection, use the canonical collection URL
    const facetTokens = extractFacetTokens(searchParamsResolved);
    const categoryRedirect = findCategoryCollectionRedirect(facetTokens, catalog, collections);
    if (categoryRedirect) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(searchParamsResolved)) {
            if (key === 'facets' || key === 'page' || value == null) continue;
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(key, v));
            } else {
                params.set(key, value);
            }
        }
        categoryRedirect.remainingFacetTokens.forEach((token) => params.append('facets', token));
        const qs = params.toString();
        redirect({
            href: qs
                ? `/collection/${categoryRedirect.collectionSlug}?${qs}`
                : `/collection/${categoryRedirect.collectionSlug}`,
            locale,
        });
    }

    // Normalize legacy numeric facet IDs in the URL to readable tokens when possible
    const normalizedTokens = facetTokens.map((token) => {
        const entry = catalog.find((e) => e.id === token);
        return entry ? getFacetUrlToken(entry) : token;
    });
    const needsNormalize =
        facetTokens.length > 0 &&
        normalizedTokens.some((token, i) => token !== facetTokens[i]);
    if (needsNormalize) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(searchParamsResolved)) {
            if (key === 'facets' || value == null) continue;
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(key, v));
            } else {
                params.set(key, value);
            }
        }
        normalizedTokens.forEach((token) => params.append('facets', token));
        const qs = params.toString();
        redirect({ href: qs ? `/search?${qs}` : '/search', locale });
    }

    const productDataPromise = query(SearchProductsQuery, {
        input: await buildResolvedSearchInput({ searchParams: searchParamsResolved })
    });

    // Fetch seller names for the first page server-side
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
        // degrade gracefully on older backends
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
                <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
                    <FacetFilters
                        productDataPromise={productDataPromise}
                        searchParams={searchParamsResolved}
                        collections={collections}
                    />
                </Suspense>
            </aside>

            {/* Product Grid */}
            <div className="lg:col-span-3">
                <Suspense fallback={
                    <div className="flex flex-col mt-17 items-center gap-2">
                        <Spinner color="current" />
                    </div>
                }>
                    <ProductGrid
                        productDataPromise={productDataPromise}
                        currentPage={page}
                        take={12}
                        searchParams={searchParamsResolved}
                        initialStoreNames={initialStoreNames}
                        trackAsSearch
                    />
                </Suspense>
            </div>
        </div>
    );
}
