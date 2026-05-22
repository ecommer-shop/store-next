/**
 * URLs de assets de Vendure: a veces vienen relativas (`assets/...`) sin prefijo.
 * Debe coincidir con ASSET_URL_PREFIX del servidor shop.
 */
export function normalizeVendureAssetUrl(url: string | null | undefined): string | null {
    if (!url?.trim()) {
        return null;
    }
    const trimmed = url.trim();
    if (/^(https?:\/\/|data:|\/)/i.test(trimmed)) {
        return trimmed;
    }
    const prefix =
        process.env.NEXT_PUBLIC_VENDURE_ASSET_URL_PREFIX?.trim() ||
        process.env.VENDURE_ASSET_URL_PREFIX?.trim() ||
        '';
    if (!prefix) {
        return null;
    }
    return `${prefix.replace(/\/+$/, '')}/${trimmed.replace(/^\/+/, '')}`;
}

/** Para next/image: solo URLs que el optimizador acepta. */
export function isDisplayableImageUrl(url: string | null | undefined): boolean {
    const normalized = normalizeVendureAssetUrl(url);
    return Boolean(normalized && /^(https?:\/\/|\/)/i.test(normalized));
}
