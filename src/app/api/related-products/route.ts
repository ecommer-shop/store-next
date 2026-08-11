import { NextRequest, NextResponse } from 'next/server';
import { GetCollectionProductsQuery } from '@/lib/vendure/shared/queries';
import { query as vendureQuery } from '@/lib/vendure/server/api';
import { readFragment } from '@/graphql';
import { ProductCardFragment } from '@/lib/vendure/shared/fragments';
import { getFacetsCatalog } from '@/lib/vendure/cached';
import { resolveFacetTokensToIds } from '@/lib/vendure/shared/facet-url';

export async function GET(req: NextRequest) {
  const {
    collectionSlug,
    currentProductId,
    locale = 'es',
    take = '12',
    page = '1',
    facets = '',
  } = Object.fromEntries(req.nextUrl.searchParams.entries());

  const takeNum = parseInt(take as string, 10) || 12;
  const pageNum = parseInt(page as string, 10) || 1;
  const skip = (pageNum - 1) * takeNum;
  const facetArr = facets ? (Array.isArray(facets) ? facets : facets.split(',')) : [];

  const catalog = facetArr.length > 0 ? await getFacetsCatalog() : [];
  const facetValueIds = resolveFacetTokensToIds(facetArr, catalog);

  const input: Record<string, unknown> = {
    collectionSlug,
    take: takeNum + 1, // +1 para filtrar el actual y mantener el total
    skip,
    groupByProduct: true,
  };
  if (facetValueIds.length > 0) {
    input.facetValueFilters = facetValueIds.map((id) => ({ and: id }));
  }

  const result = await vendureQuery(GetCollectionProductsQuery, {
    slug: collectionSlug,
    input,
  }, { languageCode: locale });

  const items = result.data.search.items
    .filter(item => {
      const product = readFragment(ProductCardFragment, item);
      return product.productId !== currentProductId;
    })
    .slice(0, takeNum);

  return NextResponse.json({
    items,
    totalItems: result.data.search.totalItems,
    page: pageNum,
  });
}
