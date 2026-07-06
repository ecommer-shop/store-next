import { query } from '@/lib/vendure/server/api';
import { GetCollectionProductsQuery, GetProductsSellerNamesQuery } from '@/lib/vendure/shared/queries';
import { readFragment } from '@/graphql';
import { ProductCardFragment } from '@/lib/vendure/shared/fragments';
import { ProductCard } from '@/components/commerce/product-card';
import Link from 'next/link';

interface CategorySectionProps {
    collectionSlug: string;
    title: string;
    excludeIds?: string[];
    take?: number;
}

async function getCategoryProducts(
    collectionSlug: string,
    excludeIds: string[],
    take: number
) {
    try {
        const result = await query(GetCollectionProductsQuery, {
            slug: collectionSlug,
            input: {
                collectionSlug,
                groupByProduct: true,
                take: take + excludeIds.length,
                skip: 0,
            },
        });

        const allItems = result.data.search.items ?? [];
        const excludeSet = new Set(excludeIds);
        const filtered = allItems.filter(
            (item) => !excludeSet.has(readFragment(ProductCardFragment, item).productId)
        );
        const items = filtered.slice(0, take);

        const productIds = items.map((item) => readFragment(ProductCardFragment, item).productId);
        let storeNames: Record<string, string> = {};
        if (productIds.length > 0) {
            try {
                const sellerResult = await query(GetProductsSellerNamesQuery, {
                    options: { filter: { id: { in: productIds } }, take: productIds.length },
                });
                for (const p of sellerResult.data.products.items ?? []) {
                    const shop = (p as any).sellerShop as { sellerName?: string } | null | undefined;
                    if (shop?.sellerName) storeNames[p.id] = shop.sellerName;
                }
            } catch {
                // degrade gracefully
            }
        }

        return { items, storeNames };
    } catch {
        return { items: [], storeNames: {} };
    }
}

export async function CategorySection({
    collectionSlug,
    title,
    excludeIds = [],
    take = 6,
}: CategorySectionProps) {
    const { items, storeNames } = await getCategoryProducts(collectionSlug, excludeIds, take);

    if (items.length === 0) return null;

    return (
        <section className="py-8 bg-gray-50 dark:bg-[#12123F]/30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        {title}
                    </h2>
                    <Link
                        href={`/collection/${collectionSlug}`}
                        className="text-sm font-semibold flex items-center gap-1 hover:underline"
                        style={{ color: '#6BB8FF' }}
                    >
                        Ver todo <span className="text-base">›</span>
                    </Link>
                </div>

                <div
                    className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {items.map((product, i) => {
                        const p = readFragment(ProductCardFragment, product);
                        return (
                            <div key={i} className="flex-none w-[160px] sm:w-auto">
                                <ProductCard product={product} storeName={storeNames[p.productId]} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export function CategorySectionSkeleton({ title }: { title: string }) {
    return (
        <section className="py-8 bg-gray-50 dark:bg-[#12123F]/30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-5">
                    <div className="h-7 w-40 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 animate-pulse">
                            <div className="aspect-square bg-gray-200 dark:bg-white/10" />
                            <div className="p-3 space-y-2">
                                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
