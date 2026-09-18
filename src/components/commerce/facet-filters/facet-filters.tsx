'use client';

import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { ResultOf } from '@/graphql';
import { SearchProductsQuery } from "@/lib/vendure/shared/queries";
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import { FacetsAccordionContent } from './facet-filters-responsive';
import { FacetFiltersMobile } from './facet-filters-mobile';
import {
    getFacetUrlToken,
    isCategoryFacetName,
    matchCollectionSlug,
} from '@/lib/vendure/shared/facet-url';


interface FacetFiltersProps {
    productDataPromise: Promise<{
        data: ResultOf<typeof SearchProductsQuery>;
        token?: string;
    }>;
    searchParams?: { [key: string]: string | string[] | undefined };
    activeCollectionSlug?: string;
    activeCollectionName?: string;
    /** All site collections — used to map Categoría facets to /collection/{slug}. */
    collections?: Array<{ slug: string; name: string }>;
}

const COLLECTION_SENTINEL = '__collection__';

interface FacetValueEntry {
    id: string;
    name: string;
    count: number;
    urlToken: string;
    collectionSlug?: string;
}

interface FacetGroup {
    id: string;
    name: string;
    values: FacetValueEntry[];
}

function buildQueryString(params: URLSearchParams): string {
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}

export function FacetFilters({
    productDataPromise,
    activeCollectionSlug,
    activeCollectionName,
    collections = [],
}: FacetFiltersProps) {
    const result = use(productDataPromise);
    const searchResult = result.data.search;
    const pathname = usePathname();
    const urlSearchParams = useSearchParams();
    const router = useRouter();
    const t = useTranslations('Commerce');

    const routingCollections =
        collections.length > 0
            ? collections
            : (searchResult.collections ?? []).map((item) => ({
                  slug: item.collection.slug,
                  name: item.collection.name,
              }));

    const facetGroups = searchResult.facetValues.reduce((acc: Record<string, FacetGroup>, item) => {
        const facetName = item.facetValue.facet.name;
        if (!acc[facetName]) {
            acc[facetName] = {
                id: item.facetValue.facet.id,
                name: facetName,
                values: []
            };
        }

        const urlToken = getFacetUrlToken(item.facetValue);
        const collectionSlug = isCategoryFacetName(facetName)
            ? matchCollectionSlug(item.facetValue, routingCollections)
            : undefined;

        acc[facetName].values.push({
            id: item.facetValue.id,
            name: item.facetValue.name,
            count: item.count,
            urlToken,
            collectionSlug,
        });
        return acc;
    }, {});

    const selectedFacets = urlSearchParams.getAll('facets');

    // Build all groups, merging collection into existing Categoría if present
    const allGroups: Record<string, FacetGroup> = {};

    Object.entries(facetGroups).forEach(([key, group]) => {
        allGroups[key] = group;
    });

    if (activeCollectionSlug) {
        const categoriaGroup = Object.values(allGroups).find(
            g => g.name.localeCompare('Categoría', 'es', { sensitivity: 'base' }) === 0
        );

        const collectionName = activeCollectionName || activeCollectionSlug;

        const collectionEntry: FacetValueEntry = {
            id: COLLECTION_SENTINEL,
            name: collectionName,
            count: searchResult.totalItems,
            urlToken: COLLECTION_SENTINEL,
            collectionSlug: activeCollectionSlug,
        };

        if (categoriaGroup) {
            // Cuando hay una colección activa, solo mostrar esa categoría
            categoriaGroup.values = [collectionEntry];
        } else {
            allGroups[COLLECTION_SENTINEL] = {
                id: COLLECTION_SENTINEL,
                name: 'Categoría',
                values: [collectionEntry],
            };
        }
    }

    const selectedTokens = new Set(selectedFacets);

    // Selection keys used by UI components (urlToken / sentinel)
    const selectedKeys = [
        ...selectedFacets,
        ...(activeCollectionSlug ? [COLLECTION_SENTINEL] : []),
    ];

    const toggleFacet = (facetKey: string) => {
        const params = new URLSearchParams(urlSearchParams.toString());
        params.delete('page');

        // Leaving the active collection → return to search with remaining filters
        if (facetKey === COLLECTION_SENTINEL) {
            params.delete('facets');
            const remaining = urlSearchParams.getAll('facets');
            remaining.forEach((token) => params.append('facets', token));
            router.push(`/search${buildQueryString(params)}`);
            return;
        }

        // Locate the facet value metadata from current groups
        const allValues = Object.values(allGroups).flatMap((g) => g.values);
        const value = allValues.find(
            (v) => v.urlToken === facetKey || v.id === facetKey || v.collectionSlug === facetKey
        );

        // Category with a matching collection → canonical collection route
        if (value?.collectionSlug) {
            const isActiveCollection = activeCollectionSlug === value.collectionSlug;
            if (isActiveCollection) {
                const remaining = urlSearchParams.getAll('facets');
                params.delete('facets');
                remaining.forEach((token) => params.append('facets', token));
                router.push(`/search${buildQueryString(params)}`);
                return;
            }

            // Preserve non-category facet tokens
            const current = params.getAll('facets');
            params.delete('facets');
            current
                .filter((token) => {
                    const other = allValues.find((v) => v.urlToken === token || v.id === token);
                    return !other?.collectionSlug;
                })
                .forEach((token) => {
                    const other = allValues.find((v) => v.urlToken === token || v.id === token);
                    params.append('facets', other?.urlToken ?? token);
                });

            router.push(`/collection/${value.collectionSlug}${buildQueryString(params)}`);
            return;
        }

        const urlToken = value?.urlToken ?? facetKey;
        const current = params.getAll('facets');
        const isSelected =
            current.includes(urlToken) ||
            current.includes(facetKey) ||
            (value ? current.includes(value.id) : false);

        params.delete('facets');
        if (isSelected) {
            current
                .filter((token) => token !== urlToken && token !== facetKey && token !== value?.id)
                .forEach((token) => {
                    const other = allValues.find((v) => v.urlToken === token || v.id === token);
                    params.append('facets', other?.urlToken ?? token);
                });
        } else {
            current.forEach((token) => {
                const other = allValues.find((v) => v.urlToken === token || v.id === token);
                params.append('facets', other?.urlToken ?? token);
            });
            params.append('facets', urlToken);
        }

        router.push(`${pathname}${buildQueryString(params)}`);
    };

    const clearFilters = () => {
        const params = new URLSearchParams(urlSearchParams.toString());
        params.delete('facets');
        params.delete('page');

        if (activeCollectionSlug) {
            router.push(`/search${buildQueryString(params)}`);
            return;
        }

        router.push(`${pathname}${buildQueryString(params)}`);
    };

    const hasActiveFilters = selectedTokens.size > 0 || Boolean(activeCollectionSlug);

    if (Object.keys(allGroups).length === 0) {
        return null;
    }

    // Map groups so UI compares against urlToken (readable) instead of raw IDs
    const uiGroups: Record<string, FacetGroup> = {};
    for (const [key, group] of Object.entries(allGroups)) {
        uiGroups[key] = {
            ...group,
            values: group.values.map((v) => ({
                ...v,
                id: v.urlToken,
            })),
        };
    }

    return (
        <div className="flex flex-col space-y-6">
            {/* Desktop header */}
            <div className="hidden md:flex items-center text-foreground justify-between">
                <h2 className="font-semibold text-lg text-foreground">
                    {t(I18N.Commerce.facetFilters.filters)}
                </h2>
            </div>

            {/* Desktop filtros */}
            <div className="hidden md:block">
                <FacetsAccordionContent
                    facetGroups={uiGroups}
                    selectedFacets={selectedKeys}
                    toggleFacet={toggleFacet}
                />
            </div>

            {/* Mobile: Tabs con overflow + TagGroup variants */}
            <div className="md:hidden space-y-2">
                <h2 className="font-semibold text-lg text-foreground">
                    {t(I18N.Commerce.facetFilters.filters)}
                </h2>
                <FacetFiltersMobile
                    facetGroups={uiGroups}
                    selectedFacets={selectedKeys}
                    toggleFacet={toggleFacet}
                />
            </div>

            {/* Botón limpiar filtros — siempre al fondo, visible solo si hay filtros activos */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold
                               border border-red-300 dark:border-red-500/40
                               text-red-500 dark:text-red-400
                               hover:bg-red-50 dark:hover:bg-red-500/10
                               transition-colors duration-200 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                    {t(I18N.Commerce.facetFilters.clearFilters)}
                </button>
            )}
        </div>
    );
}
