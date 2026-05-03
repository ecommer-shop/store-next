import { query } from '@/lib/vendure/server/api';
import { VENDURE_API_URL, VENDURE_CHANNEL_TOKEN, VENDURE_CHANNEL_TOKEN_HEADER, VENDURE_LANGUAGE_CODE_HEADER } from '@/lib/vendure/core';
import { GetCollectionProductsQuery, SearchProductsQuery } from '@/lib/vendure/shared/queries';
import { buildSearchInput } from '@/lib/vendure/shared/search-helpers';

export const getStoreMetadata = (slug: string, locale: string) => {
    return query(
        GetCollectionProductsQuery,
        {
            slug,
            input: {
                take: 0,
                collectionSlug: slug,
                groupByProduct: true,
            },
        },
        {
            languageCode: locale,
        },
    );
};

export const getStoreProducts = (slug: string, locale: string) => {
    return query(
        SearchProductsQuery,
        {
            input: buildSearchInput({
                searchParams: {},
                collectionSlug: slug,
            }),
        },
        {
            languageCode: locale,
        },
    );
};

export interface StoreProfileData {
    storeName: string;
    storeDescription: string | null;
    storeBannerUrl: string | null;
}

export async function getStoreProfile(slug: string, locale: string): Promise<StoreProfileData | null> {
    const response = await fetch(VENDURE_API_URL!, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [VENDURE_CHANNEL_TOKEN_HEADER]: VENDURE_CHANNEL_TOKEN,
            [VENDURE_LANGUAGE_CODE_HEADER]: locale,
        },
        body: JSON.stringify({
            query: `
                query GetStoreProfile($collectionSlug: String!) {
                    storePageProfile(collectionSlug: $collectionSlug) {
                        storeName
                        storeDescription
                        storeBannerUrl
                    }
                }
            `,
            variables: { collectionSlug: slug },
        }),
        cache: 'no-store',
    });

    if (!response.ok) {
        return null;
    }
    const payload = (await response.json()) as {
        data?: { storePageProfile?: StoreProfileData | null };
        errors?: Array<{ message: string }>;
    };
    if (payload.errors?.length) {
        return null;
    }
    return payload.data?.storePageProfile ?? null;
}

export async function getStoreFeaturedProductIds(slug: string, locale: string): Promise<string[]> {
    const response = await fetch(VENDURE_API_URL!, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [VENDURE_CHANNEL_TOKEN_HEADER]: VENDURE_CHANNEL_TOKEN,
            [VENDURE_LANGUAGE_CODE_HEADER]: locale,
        },
        body: JSON.stringify({
            query: `
                query GetStoreFeaturedProductIds($collectionSlug: String!) {
                    storeFeaturedProductIds(collectionSlug: $collectionSlug)
                }
            `,
            variables: { collectionSlug: slug },
        }),
        cache: 'no-store',
    });

    if (!response.ok) {
        return [];
    }
    const payload = (await response.json()) as {
        data?: { storeFeaturedProductIds?: string[] };
        errors?: Array<{ message: string }>;
    };
    if (payload.errors?.length) {
        return [];
    }
    return payload.data?.storeFeaturedProductIds ?? [];
}
