'use client';

import { useMemo, useState } from 'react';
import { FragmentOf, readFragment } from '@/graphql';
import { ProductCard } from '@/components/commerce/product-card';
import { ProductCardFragment } from '@/lib/vendure/shared/fragments';
import { Slider } from '@/components/ui/slider';

type StoreProductCard = FragmentOf<typeof ProductCardFragment>;

const PRODUCT_GRID_CLASS = 'grid gap-4 grid-cols-2 lg:grid-cols-3';

function getProductPrice(product: StoreProductCard): number {
    const p = readFragment(ProductCardFragment, product);
    if (p.priceWithTax.__typename === 'SinglePrice') {
        return p.priceWithTax.value;
    }
    return p.priceWithTax.min;
}

function formatPriceLabel(value: number): string {
    if (value >= 100_000) return '$100k+';
    if (value >= 1_000) return `$${Math.round(value / 1_000)}k`;
    return `$${Math.round(value / 100)}`;
}

export function StoreProductCatalog({
    featuredProducts = [],
    products,
}: {
    featuredProducts?: StoreProductCard[];
    products: StoreProductCard[];
}) {
    const priceBounds = useMemo(() => {
        if (!products.length) {
            return { min: 0, max: 100_000 };
        }
        const prices = products.map(getProductPrice);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return { min, max: min === max ? max + 1 : max };
    }, [products]);

    const [priceRange, setPriceRange] = useState<[number, number]>([priceBounds.min, priceBounds.max]);

    const effectiveRange = useMemo((): [number, number] => {
        const [lo, hi] = priceRange;
        if (lo < priceBounds.min || hi > priceBounds.max) {
            return [priceBounds.min, priceBounds.max];
        }
        return priceRange;
    }, [priceBounds.max, priceBounds.min, priceRange]);

    const filteredProducts = useMemo(() => {
        const [min, max] = effectiveRange;
        return products.filter(product => {
            const price = getProductPrice(product);
            return price >= min && price <= max;
        });
    }, [effectiveRange, products]);

    const hasFeatured = featuredProducts.length > 0;
    const hasCatalog = products.length > 0;

    if (!hasFeatured && !hasCatalog) {
        return (
            <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                Aún no hay productos publicados para esta tienda.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {hasCatalog ? (
                <aside className="w-full shrink-0 lg:w-56">
                    <div className="rounded-xl border bg-card p-5 space-y-4 lg:sticky lg:top-24">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Rango de precio
                        </h3>
                        <Slider
                            minValue={priceBounds.min}
                            maxValue={priceBounds.max}
                            step={Math.max(1, Math.round((priceBounds.max - priceBounds.min) / 100))}
                            value={effectiveRange}
                            onChange={value => {
                                if (Array.isArray(value) && value.length === 2) {
                                    setPriceRange([value[0], value[1]]);
                                }
                            }}
                            className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{formatPriceLabel(effectiveRange[0])}</span>
                            <span>{formatPriceLabel(effectiveRange[1])}</span>
                        </div>
                    </div>
                </aside>
            ) : (
                <div className="hidden lg:block lg:w-56 shrink-0" aria-hidden />
            )}

            <div className="min-w-0 flex-1 space-y-10">
                {hasFeatured && (
                    <section className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-semibold">Productos destacados</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Nuestra mejor selección para ti
                            </p>
                        </div>
                        <div className={PRODUCT_GRID_CLASS}>
                            {featuredProducts.map((product, index) => (
                                <ProductCard key={`featured-product-${index}`} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {hasCatalog ? (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-2xl font-semibold">Todos los productos</h2>
                            <p className="text-sm text-muted-foreground shrink-0">
                                {filteredProducts.length} producto
                                {filteredProducts.length === 1 ? '' : 's'}
                            </p>
                        </div>

                        {filteredProducts.length ? (
                            <div className={PRODUCT_GRID_CLASS}>
                                {filteredProducts.map((product, index) => (
                                    <ProductCard key={`store-product-${index}`} product={product} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No hay productos en este rango de precio.
                            </p>
                        )}
                    </section>
                ) : hasFeatured ? (
                    <p className="text-sm text-muted-foreground">No hay más productos en esta tienda.</p>
                ) : null}
            </div>
        </div>
    );
}
