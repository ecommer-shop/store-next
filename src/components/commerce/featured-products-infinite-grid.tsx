'use client';

import InfiniteScroll from 'react-infinite-scroller';
import { ProductCard } from './product-card';
import { useInfiniteProducts, type ProductItem } from './use-infinite-products';
import Link from 'next/link';
import { readFragment } from '@/graphql';
import { ProductCardFragment } from '@/lib/vendure/shared/fragments';

interface FeaturedProductsInfiniteGridProps {
  initialItems: ProductItem[];
  initialTotalItems: number;
  title: string;
  take: number;
  /** Map of productId → store name, resolved server-side */
  storeNames?: Record<string, string>;
}

export function FeaturedProductsInfiniteGrid({
  initialItems,
  initialTotalItems,
  title,
  take,
  storeNames = {},
}: FeaturedProductsInfiniteGridProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts({
    take,
    initialData: { items: initialItems, totalItems: initialTotalItems },
  });

  const allItems = data?.pages.flatMap(p => p.items) ?? [];
  const maxItems = 20;
  const displayedItems = allItems.slice(0, maxItems);

  // Merge store names from all fetched pages (lazy pages return their own storeNames)
  const allStoreNames: Record<string, string> = {
    ...storeNames,
    ...(data?.pages ?? []).reduce((acc, page) => ({ ...acc, ...(page.storeNames ?? {}) }), {}),
  };

  const skeletons = Array.from({ length: take }).map((_, i) => (
    <div key={'skeleton-' + i} className="bg-white dark:bg-[#1a1a3e] rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 animate-pulse">
      <div className="aspect-square bg-gray-100 dark:bg-white/10" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
        <div className="h-5 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
      </div>
    </div>
  ));

  return (
    <section className="py-8 md:py-12 bg-gray-50 dark:bg-[#12123F]/30">
      <div className="container mx-auto px-4">
        {/* Header: título izquierda + link derecha */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {title}
          </h2>
          <Link
            href="/search"
            className="text-sm font-semibold transition-colors hover:underline flex items-center gap-1"
            style={{ color: "#6BB8FF" }}
          >
            Explorar todo
            <span className="text-base">›</span>
          </Link>
        </div>

        <InfiniteScroll
          pageStart={1}
          loadMore={() => {
            if (!isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          hasMore={!!hasNextPage && allItems.length < maxItems}
          threshold={1000}
          useWindow={true}
          loader={
            <div key="loader" className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6">
              {skeletons}
            </div>
          }
        >
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {displayedItems.map((product, i) => {
              const p = readFragment(ProductCardFragment, product);
              const storeName = allStoreNames[p.productId];
              return (
                <ProductCard
                  key={'featured-product-' + i}
                  product={product}
                  storeName={storeName}
                />
              );
            })}
          </div>
        </InfiniteScroll>
      </div>
    </section>
  );
}

