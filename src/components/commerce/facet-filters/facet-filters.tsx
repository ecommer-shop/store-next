'use client';

import { use } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ResultOf } from '@/graphql';
import { SearchProductsQuery } from "@/lib/vendure/shared/queries";
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import { FacetsAccordionContent } from './facet-filters-responsive';
import { FacetFiltersMobile } from './facet-filters-mobile';


interface FacetFiltersProps {
    productDataPromise: Promise<{
        data: ResultOf<typeof SearchProductsQuery>;
        token?: string;
    }>;
    searchParams?: { [key: string]: string | string[] | undefined };
    activeCollectionSlug?: string;
    activeCollectionName?: string;
}

const COLLECTION_SENTINEL = '__collection__';

export function FacetFilters({ productDataPromise, searchParams: serverSearchParams, activeCollectionSlug, activeCollectionName }: FacetFiltersProps) {
    const result = use(productDataPromise);
    const searchResult = result.data.search;
    const pathname = usePathname();
    const urlSearchParams = useSearchParams();
    const router = useRouter();
    const t = useTranslations('Commerce');

    // Group facet values by facet
    interface FacetGroup {
        id: string;
        name: string;
        values: Array<{ id: string; name: string; count: number }>;
    }

    const facetGroups = searchResult.facetValues.reduce((acc: Record<string, FacetGroup>, item) => {
        const facetName = item.facetValue.facet.name;
        if (!acc[facetName]) {
            acc[facetName] = {
                id: item.facetValue.facet.id,
                name: facetName,
                values: []
            };
        }
        acc[facetName].values.push({
            id: item.facetValue.id,
            name: item.facetValue.name,
            count: item.count
        });
        return acc;
    }, {});

    const selectedFacets = urlSearchParams.getAll('facets');
    if (activeCollectionSlug) {
        selectedFacets.push(COLLECTION_SENTINEL);
    }

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

        const collectionEntry = {
            id: COLLECTION_SENTINEL,
            name: collectionName,
            count: searchResult.totalItems,
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

    const toggleFacet = (facetId: string) => {
        const params = new URLSearchParams(urlSearchParams);
        const current = params.getAll('facets');

        if (facetId === COLLECTION_SENTINEL) {
            const hasOtherFacets = current.length > 0;
            params.delete('page');

            if (hasOtherFacets) {
                router.push(`${pathname}?${params.toString()}`);
            } else {
                router.push(pathname);
            }
            return;
        }

        if (current.includes(facetId)) {
            params.delete('facets');
            current.filter(id => id !== facetId).forEach(id => params.append('facets', id));
        } else {
            params.append('facets', facetId);
        }

        // Reset to page 1 when filters change
        params.delete('page');

        router.push(`${pathname}?${params.toString()}`);
    };

    const clearFilters = () => {
        const params = new URLSearchParams(urlSearchParams);
        params.delete('facets');
        params.delete('page');
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
    };

    const hasActiveFilters = selectedFacets.length > 0;

    if (Object.keys(allGroups).length === 0) {
        return null;
    }

    // Header solo con texto, sin botón
    const FiltersHeader = (
        <div className="flex items-center justify-between w-full gap-2">
            <h2 className="font-semibold text-lg text-foreground">
                {t(I18N.Commerce.facetFilters.filters)}
            </h2>
        </div>
    );

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
                    facetGroups={allGroups}
                    selectedFacets={selectedFacets}
                    toggleFacet={toggleFacet}
                />
            </div>

            {/* Mobile: Tabs con overflow + TagGroup variants */}
            <div className="md:hidden space-y-2">
                <h2 className="font-semibold text-lg text-foreground">
                    {t(I18N.Commerce.facetFilters.filters)}
                </h2>
                <FacetFiltersMobile
                    facetGroups={allGroups}
                    selectedFacets={selectedFacets}
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
                               transition-colors duration-200"
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
