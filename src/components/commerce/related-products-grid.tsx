'use client';
import InfiniteScroll from 'react-infinite-scroller';
import { ProductCard } from './product-card';
import { useInfiniteRelatedProducts } from './use-infinite-related-products';

interface RelatedProductsGridProps {
  productDataPromise?: Promise<any>;
  currentProductId: string;
  take: number;
  // Opcionales para fallback/compatibilidad
  collectionSlug?: string;
  locale?: string;
  facets?: string[];
  initialItems?: any[];
  initialTotalItems?: number;
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

export function RelatedProductsGrid({
  productDataPromise,
  currentProductId,
  take,
  collectionSlug,
  locale,
  facets,
  initialItems,
  initialTotalItems,
  title,
}: RelatedProductsGridProps) {
  // Si viene productDataPromise (SSR pattern), hidratar con esos datos
  let ssrItems: any[] | undefined = undefined;
  let ssrTotal: number | undefined = undefined;
  if (productDataPromise) {
    // Solo en server, use() está disponible
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const result = typeof window === 'undefined' ? require('react').use(productDataPromise) : undefined;
    if (result) {
      const searchResult = result.data.search;
      ssrItems = searchResult.items.filter((item: any) => item.productId !== currentProductId).slice(0, take);
      ssrTotal = searchResult.totalItems;
    }
  }
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteRelatedProducts({
    collectionSlug: collectionSlug || '',
    currentProductId,
    locale: locale || 'es',
    facets: facets || [],
    take,
    initialData: ssrItems && ssrTotal ? { items: ssrItems, totalItems: ssrTotal } : initialItems && initialTotalItems ? { items: initialItems, totalItems: initialTotalItems } : undefined,
  });

  const allItems = data?.pages.flatMap(p => p.items) ?? [];

  const skeletons = Array.from({ length: SKELETON_TAKE }).map((_, i) => (
    <ProductSkeleton key={i} i={i} />
  ));

  return (
    <section className="space-y-6">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <InfiniteScroll
        pageStart={1}
        loadMore={() => { if (!isFetchingNextPage) fetchNextPage(); }}
        hasMore={!!hasNextPage}
        threshold={400}
        useWindow={true}
        loader={
          <div key="loader" className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-4">
            {skeletons}
          </div>
        }
      >
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {allItems.map((product, i) => (
            <ProductCard key={'related-product-' + i} product={product} />
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
}
