'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchNextProductPage } from './fetch-next-product-page';
import { ResultOf } from '@/graphql';
import { SearchProductsQuery } from '@/lib/vendure/shared/queries';
import { buildSearchInput } from '@/lib/vendure/shared/search-helpers';
import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs';

export type ProductItem = ResultOf<typeof SearchProductsQuery>['search']['items'][number];

interface UseInfiniteProductsOptions {
  take: number;
  initialData?: {
    items: ProductItem[];
    totalItems: number;
    token?: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
  collectionSlug?: string;
}

interface PageData {
  items: ProductItem[];
  totalItems: number;
  token?: string;
  page: number;
}
export function useInfiniteProducts({ take, initialData, searchParams = {}, collectionSlug }: UseInfiniteProductsOptions) {
  // Create a search params key for the query cache
  const searchParamsKey = JSON.stringify({
    facets: searchParams.facets || [],
    q: searchParams.q || '',
    sort: searchParams.sort || 'name-asc',
    collection: searchParams.collection || collectionSlug || '',
  });

  dayjs.extend(duration);
  return useInfiniteQuery<PageData>({
    // Include search params in the query key so filters/search trigger new queries
    queryKey: ['products', take, searchParamsKey],
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) ?? 1;
      // Página 1 ya viene del servidor como initialData, no se re-fetcha
      const result = await fetchNextProductPage({
        page,
        take,
        token: undefined,
        searchParams, // Pass search params to the fetch function
        collectionSlug,
      });
      return { ...result, page };
    },
    initialPageParam: 2, // La página 1 viene del servidor
    getNextPageParam: (lastPage) => {
      const loadedTotal = lastPage.page * take;
      return loadedTotal < lastPage.totalItems ? lastPage.page + 1 : undefined;
    },
    // Hidrata los datos del servidor como primera página
    initialData: initialData
      ? {
          pages: [{ items: initialData.items, totalItems: initialData.totalItems, token: initialData.token, page: 1 }],
          pageParams: [1],
        }
      : undefined,
    staleTime: dayjs.duration(5, 'minutes').asMilliseconds(), // 5 minutos de caché para evitar refetch frecuente al volver a la página
  });
}
