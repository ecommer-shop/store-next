import {cache} from 'react';
import {query} from './server/api';
import {
    GetActiveChannelQuery,
    GetAvailableCountriesQuery,
    GetCollectionsForRoutingQuery,
    GetFacetsCatalogQuery,
    GetTopCollectionsQuery,
} from './shared/queries';
import { getVendureLanguageCode } from './server/locale';
import type { FacetCatalogEntry } from './shared/facet-url';


/**
 * Get top-level collections.
 */
export const getTopCollections = async () => {
    const locale = await getVendureLanguageCode();
    const result = await query(GetTopCollectionsQuery, undefined, { languageCode: locale });
    return result.data.collections.items;
}

export const getCollectionsForRouting = cache(async (): Promise<Array<{ id: string; name: string; slug: string }>> => {
    const locale = await getVendureLanguageCode();
    const items: Array<{ id: string; name: string; slug: string }> = [];
    let skip = 0;
    const take = 100;
    let hasMore = true;

    while (hasMore) {
        const result = await query(
            GetCollectionsForRoutingQuery,
            { options: { take, skip, filter: { slug: { notEq: '' } } } },
            { languageCode: locale }
        );
        const page = result.data.collections.items ?? [];
        items.push(...page);
        skip += take;
        hasMore = page.length === take;
    }

    return items;
});

/**
 * Facet value catalog for resolving readable URL tokens to Vendure IDs.
 */
export const getFacetsCatalog = cache(async (): Promise<FacetCatalogEntry[]> => {
    const locale = await getVendureLanguageCode();
    const result = await query(GetFacetsCatalogQuery, undefined, { languageCode: locale });
    const facets = result.data.facets.items ?? [];

    return facets.flatMap((facet) =>
        (facet.values ?? []).map((value) => ({
            id: value.id,
            code: value.code,
            name: value.name,
            facetId: facet.id,
            facetCode: facet.code,
            facetName: facet.name,
        }))
    );
});

export const getActiveChannelCached = async () => {
    const result = await query(GetActiveChannelQuery);
    return result.data.activeChannel;
}

export const getAvailableCountriesCached = async () => {
    const result = await query(GetAvailableCountriesQuery);
    return result.data.availableCountries || [];
}
