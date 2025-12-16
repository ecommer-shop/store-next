'use client';

import { use } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ResultOf } from '@/graphql';
import { Label } from '@/components/ui/label';
import { Button } from '@heroui/react';
import {SearchProductsQuery} from "@/lib/vendure/queries";
import { Accordion, Checkbox } from '@heroui/react';
import { Icon } from "@iconify/react";

interface FacetFiltersProps {
    productDataPromise: Promise<{
        data: ResultOf<typeof SearchProductsQuery>;
        token?: string;
    }>;
}

export  function FacetFilters({ productDataPromise }: FacetFiltersProps) {
    const result = use(productDataPromise);
    const searchResult = result.data.search;
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Filters</h2>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear all
                    </Button>
                )}
            </div>

            <Accordion allowsMultipleExpanded className="space-y-1">
                {Object.entries(facetGroups).map(([facetName, facet]) => (
                <Accordion.Item key={facet.id} className="space-y-1">
                    <Accordion.Heading>
                        <Accordion.Trigger>
                            {facet.name}
                            <Accordion.Indicator >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                    <path className='text-foreground' fill="currentColor" fill-rule="evenodd" d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06" clip-rule="evenodd" />
                                </svg>
                            </Accordion.Indicator>
                        </Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel className="space-y-2">
                        {facet.values.map((value) => {
                            const isChecked = selectedFacets.includes(value.id);
                            return (
                                <Accordion.Body key={value.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={value.id}
                                        isSelected={isChecked}
                                        onChange={() => toggleFacet(value.id)}
                                    >
                                        <Checkbox.Control>
                                            <Checkbox.Indicator/>
                                        </Checkbox.Control>
                                        <Checkbox.Content>
                                            <Label
                                                htmlFor={value.id}
                                                className="text-sm font-normal cursor-pointer flex items-center gap-2"
                                            >
                                                {value.name}
                                                <span className="text-xs text-muted-foreground">
                                                    ({value.count})
                                                </span>
                                            </Label>
                                        </Checkbox.Content>
                                    </Checkbox>
                                </Accordion.Body>
                            );
                        })}
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
            </Accordion>
        </div>
    );
}
