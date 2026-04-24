const LOCALE = process.env.NEXT_PUBLIC_STORE_LOCALE ?? 'es-CO';
const CURRENCY = process.env.NEXT_PUBLIC_STORE_CURRENCY ?? 'COP';

/**
 * Format a price value using the configured locale and currency
 * @param price Price in cents (smallest currency unit)
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency: CURRENCY,
    }).format(price / 100);
}

type DateFormat = 'short' | 'long';

/**
 * Format a date string
 * @param dateString ISO date string
 * @param format 'short' (15 ene 2024) or 'long' (15 de enero de 2024)
 */
export function formatDate(dateString: string, format: DateFormat = 'short'): string {
    const options: Intl.DateTimeFormatOptions = format === 'long'
        ? { year: 'numeric', month: 'long', day: 'numeric' }
        : { year: 'numeric', month: 'short', day: 'numeric' };

    return new Date(dateString).toLocaleDateString(LOCALE, options);
}
