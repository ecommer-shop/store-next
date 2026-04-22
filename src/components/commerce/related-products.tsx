'use client';
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { FacetFilters } from "./facet-filters/facet-filters";
import { RelatedProductsGrid } from './related-products-grid';

interface RelatedProductsProps {
    collectionSlug: string;
    currentProductId: string;
    locale?: string;
}

export function RelatedProducts({ collectionSlug, currentProductId, locale: localeProp }: RelatedProductsProps) {
    const searchParams = useSearchParams();
    const [initial, setInitial] = useState<{ items: any[]; totalItems: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const locale = localeProp || 'es';

    // Leer los filtros activos de la URL
    const facets = useMemo(() => searchParams.getAll('facets'), [searchParams]);

    // Promise para FacetFilters (SSR-like, usando fetch seguro)
    const facetDataPromise = useMemo(() => {
        const params = new URLSearchParams({
            collectionSlug,
            take: '12',
            skip: '0',
            groupByProduct: 'true',
            facets: facets.join(','),
        });
        return fetch(`/api/related-products?${params.toString()}`).then(res => res.json());
    }, [collectionSlug, facets]);

    // Obtener la primera página para hidratar el infinite scroll
    useEffect(() => {
        let ignore = false;
        setLoading(true);
        const params = new URLSearchParams({
            collectionSlug,
            currentProductId,
            locale,
            take: '12',
            page: '1',
            facets: facets.join(','),
        });
        fetch(`/api/related-products?${params.toString()}`)
            .then(res => res.json())
            .then(data => { if (!ignore) setInitial({ items: data.items, totalItems: data.totalItems }); })
            .finally(() => { if (!ignore) setLoading(false); });
        return () => { ignore = true; };
    }, [collectionSlug, facets, locale, currentProductId]);

    if (loading || !initial) {
        return <div className="py-10 text-center text-muted-foreground">Cargando productos relacionados...</div>;
    }
    if (!initial.items.length) {
        return null;
    }

    return (
        <div className="space-y-8">
            <div className="max-w-5xl mx-auto">
                <FacetFilters productDataPromise={facetDataPromise} />
            </div>
            <RelatedProductsGrid
                collectionSlug={collectionSlug}
                currentProductId={currentProductId}
                locale={locale}
                facets={facets}
                take={12}
                initialItems={initial.items}
                initialTotalItems={initial.totalItems}
                title={"Productos relacionados"}
            />
        </div>
    );
}