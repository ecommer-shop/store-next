import 'server-only';
import { getLocale } from 'next-intl/server';

/**
 * Obtiene el código de idioma actual y lo convierte al formato de Vendure
 * @returns El código de idioma en formato Vendure (e.g., 'en', 'es')
 */
export async function getVendureLanguageCode(): Promise<string> {
  const locale = await getLocale();
  
  // Mapeo de locales de Next.js a códigos de idioma de Vendure
  const localeMap: Record<string, string> = {
    'en': 'en',
    'es': 'es',
  };
  
  return localeMap[locale] || 'es'; // Default a español
}
