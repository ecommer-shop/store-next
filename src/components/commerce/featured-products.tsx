import { FeaturedProductsInfiniteGrid } from "@/components/commerce/featured-products-infinite-grid";
import { query } from "@/lib/vendure/server/api";
import { GetProductsFallbackQuery, GetProductsSellerNamesQuery, SearchProductsQuery } from "@/lib/vendure/shared/queries";
import { Suspense } from "react";
import { FeaturedProductsLoading } from './featured-products-loading';
import { getTranslations } from "next-intl/server";
import { I18N } from "@/i18n/keys";
import { CurrencyCode } from "@/graphql/generated";
import { readFragment } from "@/graphql";
import { ProductCardFragment } from "@/lib/vendure/shared/fragments";

const getFeaturedCollectionProducts = async (): Promise<{
  items: any[];
  totalItems: number;
  storeNames: Record<string, string>;
}> => {
  const result = await query(SearchProductsQuery, {
    input: {
      take: 12,
      skip: 0,
      groupByProduct: true,
    },
  });

  const searchItems = result.data.search.items ?? [];
  const totalItems = result.data.search.totalItems ?? 0;

  if (searchItems.length > 0) {
    // Fetch seller names in parallel using the product IDs from search results
    const productIds = searchItems.map((item) => {
      const p = readFragment(ProductCardFragment, item);
      return p.productId;
    });

    let storeNames: Record<string, string> = {};
    try {
      const sellerResult = await query(GetProductsSellerNamesQuery, {
        options: {
          filter: { id: { in: productIds } },
          take: productIds.length,
        },
      });
      for (const p of sellerResult.data.products.items ?? []) {
        const shop = (p as any).sellerShop as { sellerName?: string } | null | undefined;
        if (shop?.sellerName) {
          storeNames[p.id] = shop.sellerName;
        }
      }
    } catch {
      // sellerShop may not be available on older backends — degrade gracefully
    }

    return { items: searchItems, totalItems, storeNames };
  }

  // Fallback: use products query (already has sellerShop)
  const fallback = await query(GetProductsFallbackQuery, {
    options: {
      take: 12,
      skip: 0,
      filter: { enabled: { eq: true } },
      sort: { createdAt: "DESC" },
    },
  });

  const filteredProducts = (fallback.data.products.items ?? []).filter(
    (product) => product.variants && product.variants.length > 0
  );

  const storeNames: Record<string, string> = {};
  const mapped = filteredProducts.map((product) => {
    const firstVariant = product.variants?.[0];
    const shop = (product as any).sellerShop as { sellerName?: string } | null | undefined;
    if (shop?.sellerName) {
      storeNames[product.id] = shop.sellerName;
    }
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

  return { items: mapped, totalItems: mapped.length, storeNames };
};

export async function FeaturedProducts() {
  const { items, totalItems, storeNames } = await getFeaturedCollectionProducts();
  const t = await getTranslations("HeroSection");

  return (
    <Suspense fallback={<FeaturedProductsLoading />}>
      <FeaturedProductsInfiniteGrid
        title={t(I18N.HeroSection.featuredProducts)}
        initialItems={items}
        initialTotalItems={totalItems}
        storeNames={storeNames}
        take={12}
      />
    </Suspense>
  );
}
