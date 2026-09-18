import { query } from "@/lib/vendure/server/api";
import { GetCollectionProductsQuery, SearchProductsQuery } from "@/lib/vendure/shared/queries";
import { buildResolvedSearchInput } from "@/lib/vendure/shared/build-resolved-search-input";

export const getCollectionProducts = async (
    slug: string,
    searchParams: { [key: string]: string | string[] | undefined },
    locale: string
) => {
    return query(
        SearchProductsQuery,
        {
            input: await buildResolvedSearchInput({
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