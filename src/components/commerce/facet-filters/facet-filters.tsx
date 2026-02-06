'use client';

import { use } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ResultOf } from '@/graphql';
import { Label } from '@/components/ui/label';
import { Button } from '@heroui/react';
import { SearchProductsQuery } from "@/lib/vendure/shared/queries";
import { Accordion, Checkbox } from '@heroui/react';
import { Icon, } from "@iconify/react";
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import { FacetsAccordionContent } from './facet-filters-responsive';

interface FacetFiltersProps {
    productDataPromise: Promise<{
        data: ResultOf<typeof SearchProductsQuery>;
        token?: string;
    }>;
}

export function FacetFilters({ productDataPromise }: FacetFiltersProps) {
    const result = use(productDataPromise);
    const searchResult = result.data.search;
    const pathname = usePathname();
    const searchParams = useSearchParams();
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



    const selectedFacets = searchParams.getAll('facets');

    const toggleFacet = (facetId: string) => {
        const params = new URLSearchParams(searchParams);
        const current = params.getAll('facets');

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
        const params = new URLSearchParams(searchParams);
        params.delete('facets');
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    const hasActiveFilters = selectedFacets.length > 0;

    if (Object.keys(facetGroups).length === 0) {
        return null;
    }

    const FiltersHeader = (
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
    );

    return (
        <div className="space-y-6">
            <div className="hidden md:flex items-center text-foreground justify-between">
                {FiltersHeader}
            </div>

            <div className="hidden md:block">
                <FacetsAccordionContent
                    facetGroups={facetGroups}
                    selectedFacets={selectedFacets}
                    toggleFacet={toggleFacet}
                />
            </div>

            {/* sm accordion contenedor */}
            <div className="md:hidden">
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
                                {FiltersHeader}
                            </Accordion.Trigger>
                        </Accordion.Heading>

                        <Accordion.Panel>
                            <FacetsAccordionContent
                                facetGroups={facetGroups}
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
