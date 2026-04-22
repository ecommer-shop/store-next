import { FacetFilters } from "./facet-filters/facet-filters";
import { RelatedProductsGrid } from './related-products-grid';

interface RelatedProductsProps {
    productDataPromise: Promise<any>;
    currentProductId: string;
    take: number;
}

export async function RelatedProducts({ productDataPromise, currentProductId, take }: RelatedProductsProps) {
    const result = await productDataPromise;
    const searchResult = result.data.search;
    const initialItems = searchResult.items.filter((item: any) => item.productId !== currentProductId).slice(0, take);
    const totalItems = searchResult.totalItems;

    if (!initialItems.length) return null;

    return (
        <div className="space-y-8">
            <div className="max-w-5xl mx-auto">
                <FacetFilters productDataPromise={productDataPromise} />
            </div>
            <RelatedProductsGrid
                initialItems={initialItems}
                initialTotalItems={totalItems}
                take={take}
                currentProductId={currentProductId}
            />
        </div>
    );
}
