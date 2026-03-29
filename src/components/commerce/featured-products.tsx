import { ProductCarousel } from "@/components/commerce/product-carousel";
import { query } from "@/lib/vendure/server/api";
import { GetCollectionProductsQuery } from "@/lib/vendure/shared/queries";
import { Suspense } from "react";
import { FeaturedProductsLoading } from './featured-products-loading';
import { getTranslations, getLocale } from "next-intl/server";
import { I18N } from "@/i18n/keys";

const getFeaturedCollectionProducts = async (locale: string) => {
  const result = await query(GetCollectionProductsQuery, {
    slug: 'electronica',
    input: {
      take: 12,
      skip: 0,
      collectionId: "5",
      groupByProduct: true,
    },
  });

  return result.data.search.items;
}

export async function FeaturedProducts() {
  const locale = await getLocale();
  const products = await getFeaturedCollectionProducts(locale);
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
