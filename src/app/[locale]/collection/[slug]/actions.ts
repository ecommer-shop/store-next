import { query } from "@/lib/vendure/server/api";
import { GetCollectionProductsQuery, SearchProductsQuery } from "@/lib/vendure/shared/queries";
import { buildSearchInput } from "@/lib/vendure/shared/search-helpers";

export const getCollectionProducts = (
    slug: string,
    searchParams: { [key: string]: string | string[] | undefined },
    locale: string
) => {
    return query(
        SearchProductsQuery,
        {
            input: buildSearchInput({
                searchParams,
                collectionSlug: slug,
            }),
        },
        {
            languageCode: locale,
        }
    );
}

export const getCollectionMetadata = (slug: string, locale: string) => {
    return query(GetCollectionProductsQuery, {
        slug,
        input: {
            take: 0,
            collectionSlug: slug,
            groupByProduct: true,
        },
    }, {
        languageCode: locale,
    });
}