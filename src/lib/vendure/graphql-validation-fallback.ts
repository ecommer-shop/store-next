/**
 * Mensajes típic cuando el backend Shop ejecuta otro merge de GraphQL que el frontend.
 */

/** El cuerpo HTTP suele tener `\"collectionSlug\"` escapado, no el literal `"collectionSlug"`. */
export function isLegacyShopStoreSchemaError(error: unknown): boolean {
    const msg = normalizeMessage(error);
    const mentionsField =
        msg.includes('storePageProfile') || msg.includes('storeFeaturedProductIds');
    const mentionsArg = msg.includes('collectionSlug');
    const missingArg =
        msg.includes('required') ||
        msg.includes('not provided') ||
        msg.includes('was not provided');
    return mentionsField && mentionsArg && missingArg;
}

export function isLegacyProductDetailWithoutSellerShopError(error: unknown): boolean {
    const msg = normalizeMessage(error);
    return msg.includes('sellerShop') && msg.includes('Cannot query field');
}

function normalizeMessage(error: unknown): string {
    if (typeof error === 'string') {
        return error;
    }
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return '';
}
