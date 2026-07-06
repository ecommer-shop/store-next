import { Suspense } from "react";
import { FacetFilters } from "@/components/commerce/facet-filters/facet-filters";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { ProductGrid } from "@/components/commerce/product-grid";
import { buildSearchInput, getCurrentPage } from "@/lib/vendure/shared/search-helpers";
import { query } from "@/lib/vendure/server/api";
import { SearchProductsQuery, GetProductsSellerNamesQuery } from "@/lib/vendure/shared/queries";
import { readFragment } from "@/graphql";
import { ProductCardFragment } from "@/lib/vendure/shared/fragments";
import { Spinner } from "@heroui/react";

interface SearchResultsProps {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined
    }>
}

export async function SearchResults({ searchParams }: SearchResultsProps) {
    const searchParamsResolved = await searchParams;
    const page = getCurrentPage(searchParamsResolved);

    const productDataPromise = query(SearchProductsQuery, {
        input: buildSearchInput({ searchParams: searchParamsResolved })
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
                <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
                    <FacetFilters productDataPromise={productDataPromise} searchParams={searchParamsResolved} />
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
