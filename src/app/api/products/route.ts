import { NextRequest, NextResponse } from 'next/server';
import { SearchProductsQuery } from '@/lib/vendure/shared/queries';
import { query } from '@/lib/vendure/server/api';
import { buildResolvedSearchInput } from '@/lib/vendure/shared/build-resolved-search-input';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // Convierte los searchParams a un objeto plano compatible con buildSearchInput
  const inputParams: Record<string, string | string[]> = {};
  searchParams.forEach((value, key) => {
    if (inputParams[key]) {
      if (Array.isArray(inputParams[key])) {
        (inputParams[key] as string[]).push(value);
      } else {
        inputParams[key] = [inputParams[key] as string, value];
      }
    } else {
      inputParams[key] = value;
    }
  });

  // Usa la misma lógica que el SSR
  const input = await buildResolvedSearchInput({ searchParams: inputParams });
  const result = await query(SearchProductsQuery, { input });
  return NextResponse.json({
    items: result.data.search.items,
    totalItems: result.data.search.totalItems,
    token: result.token ?? null,
  });
}
