'use client'
import { use, useEffect, useState, useRef } from 'react';
import { trackSearchResults, trackViewItemList } from '@/lib/analytics/events';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from './product-card';
import { SortDropdownEntry } from './sort-dropdown/sort-dropdown-entry';
import { ProductGridNoProducts, ProductCount } from './product-grid-content';
import { SearchProductsQuery } from "@/lib/vendure/shared/queries";
import { useInfiniteProducts } from './use-infinite-products';
import InfiniteScroll from 'react-infinite-scroller';
import { ResultOf, readFragment } from '@/graphql';
import { ProductCardFragment } from '@/lib/vendure/shared/fragments';

interface ProductGridProps {
    productDataPromise: Promise<{
        data: ResultOf<typeof SearchProductsQuery>;
        token?: string;
    }>;
    currentPage: number;
    take: number;
    searchParams?: { [key: string]: string | string[] | undefined };
    collectionSlug?: string;
    trackAsSearch?: boolean;
    /** Server-side resolved map of productId → store name for page 1 */
    initialStoreNames?: Record<string, string>;
}

export function ProductGrid({ productDataPromise, currentPage, take, searchParams: serverSearchParams, collectionSlug, trackAsSearch, initialStoreNames = {} }: ProductGridProps) {
    const initialResult = use(productDataPromise);
    const initialSearch = initialResult.data.search;
    const clientSearchParams = useSearchParams();

    const currentSearchParamsObj = Object.fromEntries(clientSearchParams);
    const [prevSearchParamsObj, setPrevSearchParamsObj] = useState(serverSearchParams || currentSearchParamsObj);

    useEffect(() => {
        const paramsChanged = JSON.stringify(prevSearchParamsObj) !== JSON.stringify(currentSearchParamsObj);
        if (paramsChanged) {
            setPrevSearchParamsObj(currentSearchParamsObj);
        }
    }, [clientSearchParams, prevSearchParamsObj, currentSearchParamsObj]);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts({
        take,
        initialData: {
            items: initialSearch.items,
            totalItems: initialSearch.totalItems,
            token: initialResult.token,
        },
        searchParams: currentSearchParamsObj,
        collectionSlug,
    });

    const allItems = data?.pages.flatMap(p => p.items) ?? [];
    const totalItems = data?.pages[0]?.totalItems ?? 0;
    const hasTrackedListRef = useRef(false);

    // Merge store names: server-resolved page-1 names + lazy-loaded page names
    const allStoreNames: Record<string, string> = {
        ...initialStoreNames,
        ...(data?.pages ?? []).reduce<Record<string, string>>(
            (acc, page) => ({ ...acc, ...(page.storeNames ?? {}) }),
            {}
        ),
    };

    useEffect(() => {
        if (hasTrackedListRef.current) return;
        if (!allItems.length) return;
        hasTrackedListRef.current = true;
        const listName = trackAsSearch ? 'search' : (collectionSlug ? 'collection' : 'product_grid');
        trackViewItemList({
            list_name: listName,
            items: allItems.slice(0, 12).map((p: any) => ({
                item_id: p.productId,
                item_name: p.productName ?? p.name,
                price: p.priceWithTax?.__typename === 'SinglePrice' ? p.priceWithTax.value : p.priceWithTax?.min ?? 0,
            })),
        });
    }, [allItems, trackAsSearch, collectionSlug]);

    useEffect(() => {
        if (!trackAsSearch) return;
        const term = (clientSearchParams.get("q") ?? "").trim();
        if (!term) return;
        trackSearchResults({ search_term: term, results_count: totalItems });
    }, [trackAsSearch, clientSearchParams, totalItems]);

    if (!allItems.length) {
        return <ProductGridNoProducts />;
    }

    const skeletons = Array.from({ length: take }).map((_, i) => (
        <div key={'skeleton-' + i} className="bg-card rounded-lg overflow-hidden border border-border animate-pulse">
            <div className="aspect-square bg-muted" />
            <div className="p-4 space-y-2">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/2" />
            </div>
        </div>
    ));

    return (
        <div className="space-y-2 md:space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground md:text-sm">
                    <ProductCount count={totalItems} />
                </p>
                <SortDropdownEntry />
            </div>

            <InfiniteScroll
                pageStart={1}
                loadMore={() => { if (!isFetchingNextPage) fetchNextPage(); }}
                hasMore={!!hasNextPage}
                threshold={4000}
                useWindow={true}
                loader={
                    <div key="loader" className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-4">
                        {skeletons}
                    </div>
                }
            >
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {allItems.map((product, i) => {
                        const p = readFragment(ProductCardFragment, product);
                        const storeName = allStoreNames[p.productId];
                        return (
                            <ProductCard
                                key={'product-grid-item-' + i}
                                product={product}
                                storeName={storeName}
                            />
                        );
                    })}
                </div>
            </InfiniteScroll>
        </div>
    );
}
