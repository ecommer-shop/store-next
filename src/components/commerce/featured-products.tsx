import { query } from "@/lib/vendure/server/api";
import { GetCollectionProductsQuery } from "@/lib/vendure/shared/queries";
import { Suspense } from "react";
import { FeaturedProductsLoading } from './featured-products-loading';
import { getTranslations, getLocale } from "next-intl/server";
import { I18N } from "@/i18n/keys";
import { FeaturedProductsGrid } from "./featured-products-grid";

const COLLECTION_SLUG = 'electronica';
const COLLECTION_ID = '5';
const TAKE = 20;

const getFeaturedCollectionProducts = async (locale: string) => {
  const result = await query(GetCollectionProductsQuery, {
    slug: COLLECTION_SLUG,
    input: {
      take: TAKE,
      skip: 0,
      groupByProduct: true,
    },
  });

  return result.data.search;
}

export async function FeaturedProducts() {
  const locale = await getLocale();
  const search = await getFeaturedCollectionProducts(locale);
  const t = await getTranslations("HeroSection");

  return (
    <Suspense fallback={<FeaturedProductsLoading />}>
      <FeaturedProductsGrid
        slug={COLLECTION_SLUG}
        collectionId={COLLECTION_ID}
        take={TAKE}
        initialItems={search.items}
        initialTotalItems={search.totalItems}
        title={t(I18N.HeroSection.featuredProducts)}
      />
    </Suspense>
  );
}

