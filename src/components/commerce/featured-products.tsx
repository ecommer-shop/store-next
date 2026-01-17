import {ProductCarousel} from "@/components/commerce/product-carousel";
import {cacheLife, unstable_cache} from "next/cache";
import {query} from "@/lib/vendure/server/api";
import {GetCollectionProductsQuery} from "@/lib/vendure/shared/queries";
import { Suspense } from "react";
import { FeaturedProductsLoading } from './featured-products-loading';
import { getTranslations } from "next-intl/server";
import { I18N } from "@/i18n/keys";

const getFeaturedCollectionProducts = () =>
  unstable_cache(
    async () => {
      const result = await query(GetCollectionProductsQuery, {
        slug: 'home-garden',
        input: {
          take: 12,
          skip: 0,
          collectionId: "5",
          groupByProduct: true,
        },
      });

      return result.data.search.items;
    },
    ['collection-products', 'electronics', 'featured'],
    {
      revalidate: 72 * 3600,
    }
  )();

export async function FeaturedProducts() {
    const products = await getFeaturedCollectionProducts();

    const t = await getTranslations("HeroSection"); 
    
    return (
        <Suspense fallback={<FeaturedProductsLoading />}>
            <ProductCarousel
                title={t(I18N.HeroSection.featuredProducts)}
                products={products}
            />
        </Suspense>
    )
}