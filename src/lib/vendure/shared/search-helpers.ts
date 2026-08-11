import {
    extractFacetTokens,
    resolveFacetTokensToIds,
    type FacetCatalogEntry,
} from './facet-url';

export interface SearchInputParams {
    term?: string;
    collectionSlug?: string;
    take: number;
    skip: number;
    groupByProduct: boolean;
    sort: { name?: 'ASC' | 'DESC'; price?: 'ASC' | 'DESC' };
    facetValueFilters?: Array<{ and: string }>;
    inStock?: boolean;
}

interface BuildSearchInputOptions {
    searchParams: { [key: string]: string | string[] | undefined };
    collectionSlug?: string;
    /** Pre-resolved Vendure facet value IDs. When omitted, raw `facets` tokens are used as IDs (legacy). */
    facetValueIds?: string[];
}

export function buildSearchInput({
    searchParams,
    collectionSlug,
    facetValueIds: resolvedFacetValueIds,
}: BuildSearchInputOptions): SearchInputParams {
    const page = Number(searchParams.page) || 1;
    const take = 12;
    const skip = (page - 1) * take;
    const sort = (searchParams.sort as string) || 'name-asc';
    const searchTerm = searchParams.q as string;

    // Get collection slug from searchParams if provided
    const collectionSlugFromParams = searchParams.collection as string;

    const facetValueIds =
        resolvedFacetValueIds ??
        extractFacetTokens(searchParams);

    // Map sort parameter to Vendure SearchResultSortParameter
    const sortMapping: Record<string, { name?: 'ASC' | 'DESC'; price?: 'ASC' | 'DESC' }> = {
        'name-asc': { name: 'ASC' },
        'name-desc': { name: 'DESC' },
        'price-asc': { price: 'ASC' },
        'price-desc': { price: 'DESC' },
    };

    return {
        ...(searchTerm && { term: searchTerm }),
        ...(collectionSlugFromParams && { collectionSlug: collectionSlugFromParams }),
        ...(collectionSlug && { collectionSlug }),
        take,
        skip,
        groupByProduct: true,
        sort: sortMapping[sort] || sortMapping['name-asc'],
        ...(facetValueIds.length > 0 && {
            facetValueFilters: facetValueIds.map(id => ({ and: id }))
        }),
        inStock: true,
    };
}

/**
 * Build search input resolving readable facet tokens (code/name) to Vendure IDs.
 */
export function buildSearchInputFromCatalog(
    options: BuildSearchInputOptions,
    catalog: FacetCatalogEntry[]
): SearchInputParams {
    const tokens = extractFacetTokens(options.searchParams);
    const facetValueIds = resolveFacetTokensToIds(tokens, catalog);
    return buildSearchInput({ ...options, facetValueIds });
}

export function getCurrentPage(searchParams: { [key: string]: string | string[] | undefined }): number {
    return Number(searchParams.page) || 1;
}
