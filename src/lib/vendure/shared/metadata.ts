import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Ecommer';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecommer.shop';

const { locales, defaultLocale } = routing;

/**
 * Truncate text to a maximum length, preserving word boundaries.
 * Strips HTML tags and is ideal for meta descriptions (recommended 150-160 chars).
 */
export function truncateDescription(
  text: string | null | undefined,
  maxLength = 155
): string {
  if (!text) return '';

  // Strip HTML tags if present
  const cleanText = text.replace(/<[^>]*>/g, '').trim();

  if (cleanText.length <= maxLength) return cleanText;

  // Find the last space before maxLength to avoid cutting words
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  return lastSpaceIndex > 0
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...';
}

/**
 * Build a canonical URL for a given path.
 */
export function buildCanonicalUrl(path: string): string {
  const baseUrl = SITE_URL.replace(/\/$/, ''); // Remove trailing slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Build a locale-prefixed absolute URL, matching the URLs emitted by the
 * sitemap (`/{locale}/...`). `path === '/'` maps to the home of the locale
 * without a trailing slash (`https://site.com/es`).
 */
export function buildLocalizedUrl(locale: string, path: string): string {
  const baseUrl = SITE_URL.replace(/\/$/, ''); // Remove trailing slash
  const cleanPath =
    path === '' || path === '/'
      ? ''
      : path.startsWith('/')
        ? path
        : `/${path}`;
  return `${baseUrl}/${locale}${cleanPath}`;
}

/**
 * Build canonical + hreflang alternates for a localized page.
 * Keeps the HTML on-page signals consistent with `sitemap.ts` so Google can
 * reconcile the canonical across locales (fixes "duplicate / no canonical").
 */
export function buildAlternates(
  locale: string,
  path: string
): { canonical: string; languages: Record<string, string> } {
  const cleanPath =
    path === '' || path === '/'
      ? ''
      : path.startsWith('/')
        ? path
        : `/${path}`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = buildLocalizedUrl(l, cleanPath);
  }
  languages['x-default'] = buildLocalizedUrl(defaultLocale, cleanPath);

  return {
    canonical: buildLocalizedUrl(locale, cleanPath),
    languages,
  };
}

/**
 * Build Open Graph image array from an image URL.
 */
export function buildOgImages(
  imageUrl: string | null | undefined,
  alt?: string
): NonNullable<Metadata['openGraph']>['images'] {
  if (!imageUrl) return undefined;

  return [
    {
      url: imageUrl,
      alt: alt || 'Product image',
    },
  ];
}

/**
 * Create noindex/nofollow robots config for protected pages.
 */
export function noIndexRobots(): Metadata['robots'] {
  return {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  };
}
