/** Sufijo que usa el onboarding del seller (`${channel.code}-token`). */
export const SELLER_SHOP_CHANNEL_TOKEN_SUFFIX = '-token';

/**
 * Rutas públicas `/store/{slug}` con `slug === Channel.code` (`normalizeString(nombreTienda)`).
 * En Shop API la cabecera debe ser `vendure-token: channelTokenFromStoreSlug(slug)`.
 */
export function channelTokenFromStoreSlug(slug: string): string {
    return slug.endsWith(SELLER_SHOP_CHANNEL_TOKEN_SUFFIX) ? slug : `${slug}${SELLER_SHOP_CHANNEL_TOKEN_SUFFIX}`;
}

/** Si la URL usara el token completo como segmento, lo recorta a `code` (no recomendado). */
export function storePathSlugToChannelCode(slug: string): string {
    return slug.endsWith(SELLER_SHOP_CHANNEL_TOKEN_SUFFIX)
        ? slug.slice(0, -SELLER_SHOP_CHANNEL_TOKEN_SUFFIX.length)
        : slug;
}

export function channelCodeMatchesStoreSlug(slug: string, activeChannelCode: string | undefined | null): boolean {
    return !!activeChannelCode && activeChannelCode === storePathSlugToChannelCode(slug);
}
