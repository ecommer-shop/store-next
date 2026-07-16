'use server';
import { GetProductsSellerNamesQuery, SearchProductsQuery } from '@/lib/vendure/shared/queries';
import { query } from '@/lib/vendure/server/api';
import { ResultOf, readFragment } from '@/graphql';
import { buildSearchInput } from '@/lib/vendure/shared/search-helpers';
import { ProductCardFragment } from '@/lib/vendure/shared/fragments';

interface FetchNextPageArgs {
  page: number;
  take: number;
  token?: string;
  searchParams?: { [key: string]: string | string[] | undefined };
  collectionSlug?: string;
}

export async function fetchNextProductPage({ page, take, token, searchParams = {}, collectionSlug }: FetchNextPageArgs): Promise<{
  items: ResultOf<typeof SearchProductsQuery>["search"]["items"];
  totalItems: number;
  token?: string;
  storeNames?: Record<string, string>;
  storeChannelCodes?: Record<string, string>;
}> {
  // Limit token usage for security
  if (token && token.length > 128) throw new Error('Token too long');

  // Build the search input from params
  const input = buildSearchInput({ 
    searchParams: {
      ...searchParams,
      page: String(page),
    },
    collectionSlug,
  });

  // Realiza la consulta real
  const result = await query(
    SearchProductsQuery,
    { input },
    { token }
  );

  const search = result.data.search;
  const items = search.items;

  // Fetch seller names and channel codes for this page's products
  let storeNames: Record<string, string> = {};
  let storeChannelCodes: Record<string, string> = {};
  try {
    const productIds = items.map((item) => readFragment(ProductCardFragment, item).productId);
    if (productIds.length > 0) {
      const sellerResult = await query(GetProductsSellerNamesQuery, {
        options: { filter: { id: { in: productIds } }, take: productIds.length },
      });
      for (const p of sellerResult.data.products.items ?? []) {
        const shop = (p as any).sellerShop as { sellerName?: string; channelCode?: string } | null | undefined;
        if (shop?.sellerName) {
          storeNames[p.id] = shop.sellerName;
        }
        if (shop?.channelCode) {
          storeChannelCodes[p.id] = shop.channelCode;
        }
      }
    }
  } catch {
    // sellerShop not available on older backends — degrade gracefully
  }

  return {
    items,
    totalItems: search.totalItems,
    token: result.token,
    storeNames,
    storeChannelCodes,
  };
}
