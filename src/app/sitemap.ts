import { MetadataRoute } from "next";
import { query } from "@/lib/vendure/server/api";
import { graphql } from "@/graphql";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ecommer.shop"
).replace(/\/$/, "");
const { locales, defaultLocale } = routing;

// Fechas fijas para páginas estáticas.
// Antes usaba `new Date()` que cambia en cada request.
// Google interpreta lastmod frecuente como señal de actualización real —
// si siempre es "ahora", pierde confianza en el dato.
const STATIC_LAST_MODIFIED: Record<string, string> = {
  "": "2026-01-15", // Home — ajusta a tu fecha de lanzamiento
  "/about-us": "2026-03-01",
  "/sellers": "2026-03-01",
  "/legal/terms": "2026-02-01",
  "/legal/privacy": "2026-02-01",
};

const GetProductsForSitemapQuery = graphql(`
  query GetProductsForSitemap($options: ProductListOptions) {
    products(options: $options) {
      items {
        slug
        updatedAt
      }
    }
  }
`);

const GetCollectionsForSitemapQuery = graphql(`
  query GetCollectionsForSitemap($options: CollectionListOptions) {
    collections(options: $options) {
      items {
        slug
        updatedAt
      }
    }
  }
`);

// Helper para construir alternates con x-default.
// x-default le dice a Google qué versión mostrar cuando el idioma
// del usuario no coincide con ninguna de las variantes declaradas.
function buildAlternates(path: string) {
  return {
    languages: {
      "x-default": `${SITE_URL}/${defaultLocale}${path}`,
      ...Object.fromEntries(
        locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
      ),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapItems: MetadataRoute.Sitemap = [];

  // 1. Rutas estáticas — una entrada por locale
  const staticPaths = [
    "",
    "/about-us",
    "/sellers",
    "/legal/terms",
    "/legal/privacy",
  ];

  for (const path of staticPaths) {
    for (const locale of locales) {
      sitemapItems.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(STATIC_LAST_MODIFIED[path]),
        changeFrequency: path === "" ? "daily" : "monthly",
        priority: path === "" ? 1.0 : 0.8,
        alternates: buildAlternates(path),
      });
    }
  }

  // 2. Colecciones — sin cambios en la lógica, solo usa buildAlternates
  try {
    let collections: Array<{ slug: string; updatedAt: string }> = [];
    let skip = 0;
    const take = 100;
    let hasMore = true;

    while (hasMore) {
      const result = await query(GetCollectionsForSitemapQuery, {
        options: { take, skip, filter: { slug: { notEq: "" } } },
      });
      const items = result.data.collections.items || [];
      collections = collections.concat(items);
      skip += take;
      hasMore = items.length === take;
    }

    for (const collection of collections) {
      const path = `/collection/${collection.slug}`;
      for (const locale of locales) {
        sitemapItems.push({
          url: `${SITE_URL}/${locale}${path}`,
          lastModified: collection.updatedAt
            ? new Date(collection.updatedAt)
            : new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
          alternates: buildAlternates(path),
        });
      }
    }
  } catch (error) {
    console.error("Error al generar sitemap para colecciones:", error);
  }

  // 3. Productos — sin cambios en la lógica, solo usa buildAlternates
  try {
    let products: Array<{ slug: string; updatedAt: string }> = [];
    let skip = 0;
    const take = 100;
    let hasMore = true;

    while (hasMore) {
      const result = await query(GetProductsForSitemapQuery, {
        options: {
          take,
          skip,
          filter: { enabled: { eq: true }, slug: { notEq: "" } },
        },
      });
      const items = result.data.products.items || [];
      products = products.concat(items);
      skip += take;
      hasMore = items.length === take;
    }

    for (const product of products) {
      const path = `/product/${product.slug}`;
      for (const locale of locales) {
        sitemapItems.push({
          url: `${SITE_URL}/${locale}${path}`,
          lastModified: product.updatedAt
            ? new Date(product.updatedAt)
            : new Date(),
          changeFrequency: "weekly",
          priority: 0.9,
          alternates: buildAlternates(path),
        });
      }
    }
  } catch (error) {
    console.error("Error al generar sitemap para productos:", error);
  }

  return sitemapItems;
}
