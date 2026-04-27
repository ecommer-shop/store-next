'use server';
import { GetCollectionProductsQuery } from '@/lib/vendure/shared/queries';
import { query } from '@/lib/vendure/server/api';
import { ResultOf } from '@/graphql';

export type CollectionProductItem = ResultOf<typeof GetCollectionProductsQuery>['search']['items'][number];

interface FetchNextCollectionPageArgs {
  slug: string;
  collectionId: string;
  page: number;
  take: number;
}

export async function fetchNextCollectionProductPage({
  slug,
  collectionId,
  page,
  take,
}: FetchNextCollectionPageArgs): Promise<{
  items: CollectionProductItem[];
  totalItems: number;
  page: number;
}> {
  const skip = (page - 1) * take;

  const result = await query(GetCollectionProductsQuery, {
    slug,
    input: {
      take,
      skip,
      collectionId,
      groupByProduct: true,
    },
  });

  const search = result.data.search;
  return {
    items: search.items,
    totalItems: search.totalItems,
    page,
  };
}
