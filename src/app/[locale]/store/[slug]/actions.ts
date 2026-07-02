import { readFragment, type FragmentOf } from '@/graphql';
import type { VendureRequestOptions } from '@/lib/vendure/core';
import { isLegacyShopStoreSchemaError } from '@/lib/vendure/graphql-validation-fallback';
import { query } from '@/lib/vendure/server/api';
import { mapCatalogProductToProductCard } from '@/lib/vendure/shared/catalog-product-card';
import { ProductCardFragment } from '@/lib/vendure/shared/fragments';
import {
    GetActiveChannelQuery,
    GetProductsFallbackQuery,
    GetSellerStoreFeaturedProductIdsQuery,
    GetSellerStoreProfileQuery,
    SearchProductsQuery,
} from '@/lib/vendure/shared/queries';
import { channelTokenFromStoreSlug, storePathSlugToChannelCode } from '@/lib/vendure/shared/seller-store-channel';
import { buildSearchInput } from '@/lib/vendure/shared/search-helpers';

export type StoreProductCard = FragmentOf<typeof ProductCardFragment>;

function vendureMessage(error: unknown): string {
    if (typeof error === 'string') {
        return error;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return '';
}

/** Perfilar tienda cuando el servidor no expone bien storePageProfile (API vieja o proceso sin reiniciar). */
function fallbackStoreProfileFromSlug(slug: string): StoreProfileData {
    const code = storePathSlugToChannelCode(slug);
    const storeName =
        code
            .split(/[-_]+/)
            .filter(Boolean)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ') || code;
    return {
        storeName,
        storeDescription: null,
        storeBannerUrl: null,
    };
}

/** Errores que indican resolver/schema antiguo: no repetir queries legacy que disparan SQL roto en el servidor. */
function storeProfileUnavailableFromApiError(error: unknown): boolean {
    const msg = vendureMessage(error);
    return (
        isLegacyShopStoreSchemaError(error) ||
        msg.includes('collection.slug') ||
        msg.includes('column collection.slug')
    );
}

function storeFeaturedUnavailableFromApiError(error: unknown): boolean {
    const msg = vendureMessage(error);
    return (
        isLegacyShopStoreSchemaError(error) ||
        msg.includes('collection.slug') ||
        msg.includes('column collection.slug') ||
        msg.includes('Relation with property path collections') ||
        msg.includes('collections in entity was not found')
    );
}

const vendureStoreFetch = { cache: 'no-store' as const };

function sellerStoreRequestOptions(slug: string, locale: string): VendureRequestOptions & { languageCode: string } {
    return {
        languageCode: locale,
        channelToken: channelTokenFromStoreSlug(slug),
        fetch: vendureStoreFetch,
    };
}

export { channelCodeMatchesStoreSlug, storePathSlugToChannelCode } from '@/lib/vendure/shared/seller-store-channel';

export const getStoreMetadata = (slug: string, locale: string) => {
    return query(
        GetActiveChannelQuery,
        {},
        {
            ...sellerStoreRequestOptions(slug, locale),
        },
    );
};

async function fetchStoreCatalogProducts(
    slug: string,
    locale: string,
    options?: { productIds?: string[]; take?: number },
): Promise<StoreProductCard[]> {
    const take = options?.take ?? 100;
    const { data } = await query(
        GetProductsFallbackQuery,
        {
            options: {
                take,
                skip: 0,
                filter: {
                    enabled: { eq: true },
                    ...(options?.productIds?.length ? { id: { in: options.productIds } } : {}),
                },
                sort: { updatedAt: 'DESC' },
            },
        },
        sellerStoreRequestOptions(slug, locale),
    );

    return (data.products.items ?? [])
        .filter(p => p.variants && p.variants.length > 0)
        .map(p => mapCatalogProductToProductCard(p));
}

/** Catálogo del canal; el índice `search` suele devolver 0 en tiendas de vendedor. */
export async function getStoreProducts(
    slug: string,
    locale: string,
    searchParams: { [key: string]: string | string[] | undefined } = {},
): Promise<StoreProductCard[]> {
    const opts = sellerStoreRequestOptions(slug, locale);

    try {
        const { data } = await query(
            SearchProductsQuery,
            {
                input: {
                    ...buildSearchInput({ searchParams }),
                    take: 100,
                    skip: 0,
                },
            },
            opts,
        );
        const searchItems = data.search.items ?? [];
        if (searchItems.length > 0) {
            return searchItems as StoreProductCard[];
        }
    } catch (e) {
        console.warn('[store] search vacío o falló, usando catálogo:', vendureMessage(e).slice(0, 200));
    }

    return fetchStoreCatalogProducts(slug, locale);
}

/** Destacados por IDs del plugin store-page (no depende del índice de búsqueda). */
export async function getStoreFeaturedProducts(slug: string, locale: string): Promise<StoreProductCard[]> {
    const ids = (await getStoreFeaturedProductIds(slug, locale)).slice(0, 3);
    if (!ids.length) {
        return [];
    }
    const cards = await fetchStoreCatalogProducts(slug, locale, { productIds: ids, take: ids.length });
    const byProductId = new Map(
        cards.map(card => [String(readFragment(ProductCardFragment, card).productId), card]),
    );
    return ids.map(id => byProductId.get(String(id))).filter((c): c is StoreProductCard => !!c);
}

export interface StoreProfileData {
    storeName: string;
    storeDescription: string | null;
    storeBannerUrl: string | null;
}

export async function getStoreProfile(slug: string, locale: string): Promise<StoreProfileData | null> {
    try {
        const { data } = await query(GetSellerStoreProfileQuery, {}, sellerStoreRequestOptions(slug, locale));
        return (data.storePageProfile ?? null) as StoreProfileData | null;
    } catch (e1) {
        if (storeProfileUnavailableFromApiError(e1)) {
            console.warn(
                '[store] storePageProfile no disponible con este backend; usando nombre derivado del slug. Reinicia el servidor `shop` con el código actual (StorePagePlugin).',
                vendureMessage(e1).slice(0, 300),
            );
            return fallbackStoreProfileFromSlug(slug);
        }
        throw e1;
    }
}

export async function getStoreFeaturedProductIds(slug: string, locale: string): Promise<string[]> {
    try {
        const { data } = await query(
            GetSellerStoreFeaturedProductIdsQuery,
            {},
            sellerStoreRequestOptions(slug, locale),
        );
        return (data.storeFeaturedProductIds ?? []) as string[];
    } catch (e1) {
        if (storeFeaturedUnavailableFromApiError(e1)) {
            console.warn(
                '[store] storeFeaturedProductIds omitido — actualiza/reinicia el servidor `shop` (StorePagePlugin).',
                vendureMessage(e1).slice(0, 300),
            );
            return [];
        }
        console.warn('[store] storeFeaturedProductIds:', vendureMessage(e1));
        return [];
    }
}
