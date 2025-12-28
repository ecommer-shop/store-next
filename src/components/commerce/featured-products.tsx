import {ProductCarousel} from "@/components/commerce/product-carousel";
import {cacheLife, unstable_cache} from "next/cache";
import {query} from "@/lib/vendure/server/api";
import {GetCollectionProductsQuery} from "@/lib/vendure/shared/queries";
import { Suspense } from "react";

const getFeaturedCollectionProducts = () =>
    unstable_cache (
        async () => {
            const result = await query(GetCollectionProductsQuery, {
                slug: "electronics",
                input: {
                    collectionSlug: "electronics",
                    take: 12,
                    skip: 0,
                    groupByProduct: true
                }
            });

            return result.data.search.items;
        },
        ['collection-products', 'electronics', 'featured'],
        {
            revalidate: 48 * 3600,
        }
)()
    /*'use cache'
    cacheLife('days')*/

    // Fetch featured products from a specific collection
    // Replace 'featured' with your actual collection slug
    



export async function FeaturedProducts() {
    const products = await getFeaturedCollectionProducts();

    return (
        <Suspense fallback={
            <p>Cargando Productos...</p>
        }>
            <ProductCarousel
                title="Featured Products"
                products={products}
            />
        </Suspense>
    )
}