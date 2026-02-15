import { ProductCarousel } from "@/components/commerce/product-carousel";
import { unstable_cache } from "next/cache";
import { query } from "@/lib/vendure/server/api";
import { GetCollectionProductsQuery } from "@/lib/vendure/shared/queries";
import { readFragment } from "@/graphql";
import { ProductCardFragment } from "@/lib/vendure/shared/fragments";
import { RelatedProductsTitle, RelatedProductsTitleAsync } from './related-products-title';
import { getTranslations } from "next-intl/server";

interface RelatedProductsProps {
    collectionSlug: string;
    currentProductId: string;
}

/* const getRelatedProducts = (collectionSlug: string, currentProductId: string) =>
    unstable_cache(
    async () => {
        const result = await query(GetCollectionProductsQuery, {
            slug: collectionSlug,
            input: {
                collectionSlug: collectionSlug,
                take: 13, // Fetch extra to account for filtering out current product
                skip: 0,
                groupByProduct: true
            }
        });

        // Filter out the current product and limit to 12
        return result.data.search.items
            .filter(item => {
                const product = readFragment(ProductCardFragment, item);
                return product.productId !== currentProductId;
            })
            .slice(0, 12);
    },
    [`related-products-${collectionSlug}`],
    {
        revalidate: 120 * 60
    }
)()
*/

const getRelatedProducts = async (collectionSlug: string, currentProductId: string) => {
    const result = await query(GetCollectionProductsQuery, {
            slug: collectionSlug,
            input: {
                collectionSlug: collectionSlug,
                take: 13, // Fetch extra to account for filtering out current product
                skip: 0,
                groupByProduct: true
            }
        });

        // Filter out the current product and limit to 12
        return result.data.search.items
            .filter(item => {
                const product = readFragment(ProductCardFragment, item);
                return product.productId !== currentProductId;
            })
            .slice(0, 12);
}

export async function RelatedProducts({ collectionSlug, currentProductId }: RelatedProductsProps) {
    const products = await getRelatedProducts(collectionSlug, currentProductId);
    if (products.length === 0) {
        return null;
    }

    return (
        <ProductCarousel
            title={(await RelatedProductsTitleAsync()).toString()}
            products={products}
        />
    );
}
