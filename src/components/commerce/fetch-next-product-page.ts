'use server';
import { SearchProductsQuery } from '@/lib/vendure/shared/queries';
import { query } from '@/lib/vendure/server/api';
import { ResultOf } from '@/graphql';

interface FetchNextPageArgs {
  page: number;
  take: number;
  token?: string;
}

export async function fetchNextProductPage({ page, take, token }: FetchNextPageArgs): Promise<{
  items: ResultOf<typeof SearchProductsQuery>["search"]["items"];
  totalItems: number;
  token?: string;
}> {
  // Limit token usage for security
  if (token && token.length > 128) throw new Error('Token too long');

  // Calcula el skip para la página
  const skip = (page - 1) * take;

  // Realiza la consulta real
  const result = await query(
    SearchProductsQuery,
    { input: { take, skip, groupByProduct: true } },
    { token }
  );

  const search = result.data.search;
  return {
    items: search.items,
    totalItems: search.totalItems,
    token: result.token,
  };
}
