import { MetadataRoute } from "next";
import { query } from "@/lib/vendure/server/api";
import { graphql } from "@/graphql";
import { routing } from "@/i18n/routing";
import { buildAlternates } from "@/lib/vendure/shared/metadata";

export const revalidate = 3600;

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ecommer.shop"
).replace(/\/$/, "");
const { locales } = routing;

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
  "/blog": "2026-03-01",
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

const GetBlogPostsForSitemapQuery = graphql(`
  query GetBlogPostsForSitemap($options: BlogPostListOptions) {
    blogPosts(options: $options) {
      items {
        slug
        publishedAt
      }
      totalItems
    }
  }
`);

// Helper para construir alternates con x-default.
// x-default le dice a Google qué versión mostrar cuando el idioma
// del usuario no coincide con ninguna de las variantes declaradas.
// Reutiliza el helper compartido para que el hreflang del sitemap sea
// idéntico al emitido en el HTML de cada página.
function buildSitemapAlternates(path: string) {
  return {
    languages: buildAlternates(locales[0], path).languages,
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
    "/blog",
  ];

  for (const path of staticPaths) {
    for (const locale of locales) {
      sitemapItems.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(STATIC_LAST_MODIFIED[path]),
        changeFrequency: path === "" ? "daily" : "monthly",
        priority: path === "" ? 1.0 : 0.8,
        alternates: buildSitemapAlternates(path),
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
          alternates: buildSitemapAlternates(path),
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
          alternates: buildSitemapAlternates(path),
        });
      }
    }
  } catch (error) {
    console.error("Error al generar sitemap para productos:", error);
  }

  // 4. Blog posts — una entrada por locale, con hreflang como el resto
  try {
    let posts: Array<{ slug: string | null; publishedAt: string | null }> = [];
    let skip = 0;
    const take = 100;
    let hasMore = true;

    while (hasMore) {
      const result = await query(GetBlogPostsForSitemapQuery, {
        options: { take, skip } as any,
      });
      const data = result.data as unknown as {
        blogPosts?: {
          items?: Array<{ slug: string | null; publishedAt: string | null }>;
        } | null;
      } | null;
      const items = data?.blogPosts?.items ?? [];
      posts = posts.concat(items);
      skip += take;
      hasMore = items.length === take;
    }

    for (const post of posts) {
      // Solo posts publicados (con slug y fecha de publicación)
      if (!post.slug || !post.publishedAt) continue;

      const path = `/blog/${post.slug}`;
      for (const locale of locales) {
        sitemapItems.push({
          url: `${SITE_URL}/${locale}${path}`,
          lastModified: new Date(post.publishedAt),
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: buildSitemapAlternates(path),
        });
      }
    }
  } catch (error) {
    console.error("Error al generar sitemap para blog:", error);
  }

  return sitemapItems;
}
