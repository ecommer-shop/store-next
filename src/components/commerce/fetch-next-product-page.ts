'use server';
import { SearchProductsQuery } from '@/lib/vendure/shared/queries';
import { query } from '@/lib/vendure/server/api';
import { ResultOf } from '@/graphql';
import { buildSearchInput } from '@/lib/vendure/shared/search-helpers';

interface FetchNextPageArgs {
  page: number;
  take: number;
  token?: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function fetchNextProductPage({ page, take, token, searchParams = {} }: FetchNextPageArgs): Promise<{
  items: ResultOf<typeof SearchProductsQuery>["search"]["items"];
  totalItems: number;
  token?: string;
}> {
  // Limit token usage for security
  if (token && token.length > 128) throw new Error('Token too long');

  // Build the search input from params
  const input = buildSearchInput({ 
    searchParams: {
      ...searchParams,
      page: String(page),
    }
  });

  // Realiza la consulta real
  const result = await query(
    SearchProductsQuery,
    { input },
    { token }
  );

  const search = result.data.search;
  return {
    items: search.items,
    totalItems: search.totalItems,
    token: result.token,
  };
}
