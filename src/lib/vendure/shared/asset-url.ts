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

/**
 * Cabeceras a ancho completo deben usar el archivo original de Vendure (`/source/`),
 * no la miniatura de preview (máx. ~1600px) que se ve borrosa con object-cover.
 */
export function ensureAssetSourceUrl(url: string | null | undefined): string | null {
    const normalized = normalizeVendureAssetUrl(url);
    if (!normalized) {
        return null;
    }
    return normalized.replace(/\/preview\//i, '/source/');
}

/** Srcset para banners: el navegador elige ancho según viewport y densidad de píxeles. */
export function buildWideBannerSrcSet(url: string | null | undefined): string | undefined {
    const sourceUrl = ensureAssetSourceUrl(url);
    if (!sourceUrl) {
        return undefined;
    }
    const widths = [1280, 1920, 2560, 3840];
    return widths.map(w => `${sourceUrl}?w=${w}&mode=resize&q=92 ${w}w`).join(', ');
}
