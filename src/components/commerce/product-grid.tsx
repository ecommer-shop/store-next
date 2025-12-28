import {ResultOf} from '@/graphql';
import {ProductCard} from './product-card';
import {Pagination} from '@/components/shared/pagination';
import {SearchProductsQuery} from "@/lib/vendure/shared/queries";
import {getActiveChannel} from '@/lib/vendure/server/actions';
import { SortDropdownEntry } from './sort-dropdown/sort-dropdown-entry';

interface ProductGridProps {
    productDataPromise: Promise<{
        data: ResultOf<typeof SearchProductsQuery>;
        token?: string;
    }>;
    currentPage: number;
    take: number;
}

export async function ProductGrid({productDataPromise, currentPage, take}: ProductGridProps) {
    const [result, channel] = await Promise.all([
        productDataPromise,
        getActiveChannel(),
    ]);

    const searchResult = result.data.search;
    const totalPages = Math.ceil(searchResult.totalItems / take);

    if (!searchResult.items.length) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 ">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {searchResult.totalItems} {searchResult.totalItems === 1 ? 'product' : 'products'}
                </p>
                <SortDropdownEntry/>
            </div>

            <div className="grid gap-4
                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-4">
                {searchResult.items.map((product, i) => (
                    <ProductCard key={'product-grid-item' + i} product={product}/>
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages}/>
            )}
        </div>
    );
}
