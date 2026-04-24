'use client';
import InfiniteScroll from 'react-infinite-scroller';
import { ProductCard } from './product-card';
import { useInfiniteCollectionProducts, } from './use-infinite-collection-products';
import type { CollectionProductItem } from './fetch-next-collection-product-page';
import { Label } from '@heroui/react';

interface FeaturedProductsGridProps {
  slug: string;
  collectionId: string;
  take: number;
  initialItems: CollectionProductItem[];
  initialTotalItems: number;
  title?: string;
}

const SKELETON_TAKE = 4;

function ProductSkeleton({ i }: { i: number }) {
  return (
    <div key={'skeleton-' + i} className="bg-card rounded-lg overflow-hidden border border-border animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-6 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}

export function FeaturedProductsGrid({
  slug,
  collectionId,
  take,
  initialItems,
  initialTotalItems,
  title,
}: FeaturedProductsGridProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteCollectionProducts({
    slug,
    collectionId,
    take,
    initialData: { items: initialItems, totalItems: initialTotalItems },
  });

  const allItems = data?.pages.flatMap(p => p.items) ?? [];

  const skeletons = Array.from({ length: SKELETON_TAKE }).map((_, i) => (
    <ProductSkeleton key={i} i={i} />
  ));

  return (
    <section className="space-y-6 p-10">
      {title && <Label className="text-2xl pl-10 font-bold">{title}</Label>}
      <InfiniteScroll
        pageStart={1}
        loadMore={() => { if (!isFetchingNextPage) fetchNextPage(); }}
        hasMore={!!hasNextPage}
        threshold={2000}
        useWindow={true}
        loader={
          <div key="loader" className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-4">
            {skeletons}
          </div>
        }
      >
        <div className="grid gap-4 grid-cols-2 p-10 sm:grid-cols-3 lg:grid-cols-5">
          {allItems.map((product, i) => (
            <ProductCard key={'featured-product-' + i} product={product} />
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
}
