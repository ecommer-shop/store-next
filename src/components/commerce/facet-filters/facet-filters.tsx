'use client';

import { use } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ResultOf } from '@/graphql';
import { Button } from '@heroui/react';
import { SearchProductsQuery } from "@/lib/vendure/shared/queries";
import { Accordion } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import { FacetsAccordionContent } from './facet-filters-responsive';


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

        const matchingValue = categoriaGroup?.values.find(
            v => v.name.localeCompare(collectionName, 'es', { sensitivity: 'base' }) === 0
        );

        const collectionEntry = {
            id: COLLECTION_SENTINEL,
            name: collectionName,
            count: searchResult.totalItems,
        };

        if (matchingValue) {
            const idx = categoriaGroup!.values.indexOf(matchingValue);
            categoriaGroup!.values[idx] = collectionEntry;
        } else if (categoriaGroup) {
            categoriaGroup.values.unshift(collectionEntry);
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
        <div className="space-y-6">
            {/* Desktop header con botón */}
            <div className="hidden md:flex items-center text-foreground justify-between">
                <div className="flex items-center justify-between w-full gap-2">
                    <h2 className="font-semibold text-lg text-foreground">
                        {t(I18N.Commerce.facetFilters.filters)}
                    </h2>
                    {hasActiveFilters && (
                        <Button
                            className="bg-accent text-accent-foreground rounded-md"
                            onClick={(e) => {
                                e.stopPropagation();
                                clearFilters();
                            }}
                        >
                            {t(I18N.Commerce.facetFilters.clearFilters)}
                        </Button>
                    )}
                </div>
            </div>

            {/* Desktop filtros */}
            <div className="hidden md:block">
                <FacetsAccordionContent
                    facetGroups={allGroups}
                    selectedFacets={selectedFacets}
                    toggleFacet={toggleFacet}
                />
            </div>

            {/* Mobile: botón limpiar fuera del trigger */}
            <div className="md:hidden space-y-2">
                {hasActiveFilters && (
                    <Button
                        className="bg-accent text-accent-foreground rounded-md w-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            clearFilters();
                        }}
                    >
                        {t(I18N.Commerce.facetFilters.clearFilters)}
                    </Button>
                )}
                <Accordion>
                    <Accordion.Item key="filters">
                        <Accordion.Heading>
                            <Accordion.Trigger className="w-full gap-3">
                                <Accordion.Indicator>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                        <path
                                            className="text-foreground"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Accordion.Indicator>
                                <h2 className="font-semibold text-lg text-foreground">
                                    {t(I18N.Commerce.facetFilters.filters)}
                                </h2>
                            </Accordion.Trigger>
                        </Accordion.Heading>

                        <Accordion.Panel>
                            <FacetsAccordionContent
                                facetGroups={allGroups}
                                selectedFacets={selectedFacets}
                                toggleFacet={toggleFacet}
                            />
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </div>
        </div>
    );
}
