'use client'
import { use } from 'react';
import { ResultOf } from '@/graphql';
import { ProductCard } from './product-card';
import { SortDropdownEntry } from './sort-dropdown/sort-dropdown-entry';
import { ProductGridNoProducts, ProductCount } from './product-grid-content';
import { SearchProductsQuery } from "@/lib/vendure/shared/queries";
import { useInfiniteProducts } from './use-infinite-products';
import InfiniteScroll from 'react-infinite-scroller';

interface ProductGridProps {
    productDataPromise: Promise<{
        data: ResultOf<typeof SearchProductsQuery>;
        token?: string;
    }>;
    currentPage: number;
    take: number;
}

// C: Vendure I: Infinite scroll with useInfiniteQuery + react-infinite-scroller
export function ProductGrid({ productDataPromise, currentPage, take }: ProductGridProps) {
    // Unwrap server data (initial page from SSR)
    const initialResult = use(productDataPromise);
    const initialSearch = initialResult.data.search;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts({
        take,
        initialData: {
            items: initialSearch.items,
            totalItems: initialSearch.totalItems,
            token: initialResult.token,
        },
    });

    const allItems = data?.pages.flatMap(p => p.items) ?? [];
    const totalItems = data?.pages[0]?.totalItems ?? 0;

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
