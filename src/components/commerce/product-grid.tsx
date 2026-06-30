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
import { buildSearchInput } from '@/lib/vendure/shared/search-helpers';
import { ResultOf } from '@/graphql';

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
}

// C: Vendure I: Infinite scroll with useInfiniteQuery + react-infinite-scroller
export function ProductGrid({ productDataPromise, currentPage, take, searchParams: serverSearchParams, collectionSlug, trackAsSearch }: ProductGridProps) {
    // Unwrap server data (initial page from SSR)
    const initialResult = use(productDataPromise);
    const initialSearch = initialResult.data.search;
    const clientSearchParams = useSearchParams();
    
    // Convert client search params to object for comparison
    const currentSearchParamsObj = Object.fromEntries(clientSearchParams);
    const [prevSearchParamsObj, setPrevSearchParamsObj] = useState(serverSearchParams || currentSearchParamsObj);

    // Detect when search params change (filters, sort, etc.)
    useEffect(() => {
        const paramsChanged = JSON.stringify(prevSearchParamsObj) !== JSON.stringify(currentSearchParamsObj);
        if (paramsChanged) {
            setPrevSearchParamsObj(currentSearchParamsObj);
        }
    }, [clientSearchParams, prevSearchParamsObj, currentSearchParamsObj]);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching } = useInfiniteProducts({
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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
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
                    {allItems.map((product, i) => (
                        <ProductCard key={'product-grid-item-' + i} product={product} />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
}
