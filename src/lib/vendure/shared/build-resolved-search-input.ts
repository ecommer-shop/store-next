import { getFacetsCatalog } from '@/lib/vendure/cached';
import {
    buildSearchInput,
    type SearchInputParams,
} from '@/lib/vendure/shared/search-helpers';
import {
    extractFacetTokens,
    resolveFacetTokensToIds,
} from '@/lib/vendure/shared/facet-url';

interface BuildResolvedSearchInputOptions {
    searchParams: { [key: string]: string | string[] | undefined };
    collectionSlug?: string;
}

/**
 * Resolves readable facet URL tokens to Vendure IDs, then builds SearchInput.
 */
export async function buildResolvedSearchInput(
    options: BuildResolvedSearchInputOptions
): Promise<SearchInputParams> {
    const tokens = extractFacetTokens(options.searchParams);
    if (tokens.length === 0) {
        return buildSearchInput(options);
    }

    const catalog = await getFacetsCatalog();
    const facetValueIds = resolveFacetTokensToIds(tokens, catalog);
    return buildSearchInput({ ...options, facetValueIds });
}
