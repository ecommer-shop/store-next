'use client';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseInfiniteRelatedProductsOptions {
  collectionSlug: string;
  currentProductId: string;
  locale: string;
  facets: string[];
  take: number;
  initialData?: {
    items: any[];
    totalItems: number;
  };
}

interface PageData {
  items: any[];
  totalItems: number;
  page: number;
}

async function fetchRelatedProductsPage({
  collectionSlug,
  currentProductId,
  locale,
  facets,
  page,
  take,
}: {
  collectionSlug: string;
  currentProductId: string;
  locale: string;
  facets: string[];
  page: number;
  take: number;
}): Promise<PageData> {
  const params = new URLSearchParams({
    collectionSlug,
    currentProductId,
    locale,
    take: String(take),
    page: String(page),
    facets: facets.join(','),
  });
  const res = await fetch(`/api/related-products?${params.toString()}`);
  console.log('Fetching related products page', { collectionSlug, currentProductId, locale, facets, page, take });
  if (!res.ok) throw new Error('Failed to fetch related products');
  return res.json();
}

export function useInfiniteRelatedProducts({
  collectionSlug,
  currentProductId,
  locale,
  facets,
  take,
  initialData,
}: UseInfiniteRelatedProductsOptions) {
  return useInfiniteQuery<PageData>({
    queryKey: ['related-products', collectionSlug, currentProductId, locale, facets, take],
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) ?? 1;
      return fetchRelatedProductsPage({
        collectionSlug,
        currentProductId,
        locale,
        facets,
        page,
        take,
      });
    },
    initialPageParam: 2,
    getNextPageParam: (lastPage) => {
      const loadedTotal = lastPage.page * take;
      return loadedTotal < lastPage.totalItems ? lastPage.page + 1 : undefined;
    },
    initialData: initialData
      ? {
          pages: [{ items: initialData.items, totalItems: initialData.totalItems, page: 1 }],
          pageParams: [1],
        }
      : undefined,
    staleTime: 1000 * 60 * 5,
  });
}
