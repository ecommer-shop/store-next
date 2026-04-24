import { ProductCarousel } from "@/components/commerce/product-carousel";
import { query } from "@/lib/vendure/server/api";
import { GetProductsFallbackQuery, SearchProductsQuery } from "@/lib/vendure/shared/queries";
import { Suspense } from "react";
import { FeaturedProductsLoading } from './featured-products-loading';
import { getTranslations } from "next-intl/server";
import { I18N } from "@/i18n/keys";
import { CurrencyCode } from "@/graphql/generated";

const getFeaturedCollectionProducts = async () => {
  const result = await query(SearchProductsQuery, {
    input: {
      take: 12,
      skip: 0,
      groupByProduct: true,
    },
  });

  const searchItems = result.data.search.items ?? [];
  if (searchItems.length > 0) {
    return searchItems;
  }

  const fallback = await query(GetProductsFallbackQuery, {
    options: {
      take: 12,
      skip: 0,
      filter: { enabled: { eq: true } },
      sort: { createdAt: "DESC" },
    },
  });

  return (fallback.data.products.items ?? []).map((product) => {
    const firstVariant = product.variants?.[0];
    return {
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      productAsset: product.featuredAsset
        ? {
            id: product.featuredAsset.id,
            preview: product.featuredAsset.preview,
          }
        : null,
      priceWithTax: {
        __typename: "SinglePrice",
        value: firstVariant?.priceWithTax ?? 0,
      },
      currencyCode: (firstVariant?.currencyCode ?? CurrencyCode.Cop) as CurrencyCode,
    };
  }) as any[];
}

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
