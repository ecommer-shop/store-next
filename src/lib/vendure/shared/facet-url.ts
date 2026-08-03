/**
 * URL architecture for facets & collections:
 * - Category ("Categoría") → canonical `/collection/{slug}` when a matching collection exists
 * - Other facets → `?facets={code|slugified-name}` (never raw Vendure IDs in new URLs)
 * - Vendure search still requires facet value IDs; resolve tokens before calling the API
 */

export const CATEGORY_FACET_NAMES = ['categoría', 'categoria', 'category', 'categories'];

export function slugifyFacetToken(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function isCategoryFacetName(name: string): boolean {
    const key = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    return CATEGORY_FACET_NAMES.includes(key);
}

export function getFacetUrlToken(facetValue: {
    id: string;
    code?: string | null;
    name: string;
}): string {
    const fromCode = facetValue.code?.trim();
    if (fromCode) {
        return slugifyFacetToken(fromCode);
    }
    const fromName = slugifyFacetToken(facetValue.name);
    return fromName || facetValue.id;
}

export function isNumericIdToken(token: string): boolean {
    return /^\d+$/.test(token);
}

export function extractFacetTokens(
    searchParams: { [key: string]: string | string[] | undefined }
): string[] {
    const raw = searchParams.facets;
    if (!raw) return [];
    return (Array.isArray(raw) ? raw : [raw]).map(String).filter(Boolean);
}

export function matchCollectionSlug(
    facetValue: { code?: string | null; name: string },
    collections: Array<{ slug: string; name: string }>
): string | undefined {
    const codeSlug = facetValue.code ? slugifyFacetToken(facetValue.code) : '';
    const nameSlug = slugifyFacetToken(facetValue.name);

    const bySlug = collections.find((c) => {
        const collectionSlug = slugifyFacetToken(c.slug);
        return (
            (codeSlug && collectionSlug === codeSlug) ||
            (nameSlug && collectionSlug === nameSlug)
        );
    });
    if (bySlug) return bySlug.slug;

    const byName = collections.find(
        (c) => c.name.localeCompare(facetValue.name, undefined, { sensitivity: 'base' }) === 0
    );
    return byName?.slug;
}

export type FacetCatalogEntry = {
    id: string;
    code: string;
    name: string;
    facetId: string;
    facetCode: string;
    facetName: string;
};

export function buildFacetTokenIndex(entries: FacetCatalogEntry[]): Map<string, FacetCatalogEntry> {
    const index = new Map<string, FacetCatalogEntry>();

    for (const entry of entries) {
        index.set(entry.id, entry);
        index.set(slugifyFacetToken(entry.code), entry);
        index.set(slugifyFacetToken(entry.name), entry);

        // Prefixed tokens help disambiguate values that share a name across facets
        const facetKey = slugifyFacetToken(entry.facetCode || entry.facetName);
        if (facetKey) {
            index.set(`${facetKey}:${slugifyFacetToken(entry.code)}`, entry);
            index.set(`${facetKey}:${slugifyFacetToken(entry.name)}`, entry);
        }
    }

    return index;
}

export function resolveFacetTokensToIds(
    tokens: string[],
    catalog: FacetCatalogEntry[]
): string[] {
    if (tokens.length === 0) return [];
    const index = buildFacetTokenIndex(catalog);
    const ids: string[] = [];

    for (const token of tokens) {
        const normalized = slugifyFacetToken(token);
        const entry =
            index.get(token) ||
            index.get(normalized) ||
            (isNumericIdToken(token) ? index.get(token) : undefined);

        if (entry) {
            ids.push(entry.id);
        } else if (isNumericIdToken(token)) {
            // Legacy URLs that still carry Vendure IDs
            ids.push(token);
        }
    }

    return [...new Set(ids)];
}

export function findCategoryCollectionRedirect(
    tokens: string[],
    catalog: FacetCatalogEntry[],
    collections: Array<{ slug: string; name: string }>
): { collectionSlug: string; remainingFacetTokens: string[] } | null {
    if (tokens.length === 0 || collections.length === 0) return null;

    const index = buildFacetTokenIndex(catalog);
    const categoryEntries: FacetCatalogEntry[] = [];
    const remaining: string[] = [];

    for (const token of tokens) {
        const normalized = slugifyFacetToken(token);
        const entry = index.get(token) || index.get(normalized);

        if (entry && isCategoryFacetName(entry.facetName)) {
            categoryEntries.push(entry);
        } else {
            remaining.push(getFacetUrlToken(entry ?? { id: token, code: token, name: token }));
        }
    }

    if (categoryEntries.length !== 1) return null;

    const collectionSlug = matchCollectionSlug(categoryEntries[0], collections);
    if (!collectionSlug) return null;

    return {
        collectionSlug,
        remainingFacetTokens: remaining,
    };
}
