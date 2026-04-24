'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchNextCollectionProductPage,
  type CollectionProductItem,
} from './fetch-next-collection-product-page';
import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs';
interface UseInfiniteCollectionProductsOptions {
  slug: string;
  collectionId: string;
  take: number;
  initialData?: {
    items: CollectionProductItem[];
    totalItems: number;
  };
}

interface PageData {
  items: CollectionProductItem[];
  totalItems: number;
  page: number;
}

export function useInfiniteCollectionProducts({
  slug,
  collectionId,
  take,
  initialData,
}: UseInfiniteCollectionProductsOptions) {
  dayjs.extend(duration);
  return useInfiniteQuery<PageData>({
    queryKey: ['collection-products', slug, collectionId, take],
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) ?? 1;
      return fetchNextCollectionProductPage({ slug, collectionId, page, take });
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
    staleTime: dayjs.duration(5, 'minutes').asMilliseconds(),
  });
}
