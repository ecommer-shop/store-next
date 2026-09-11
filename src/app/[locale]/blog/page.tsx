import type { Metadata } from "next";
import { query } from "@/lib/vendure/server/api";
import { GetBlogPostsQuery } from "@/lib/vendure/shared/blog";
import Link from "next/link";
import Image from "next/image";
import { SITE_NAME, buildCanonicalUrl } from "@/lib/vendure/shared/metadata";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: `Blog | ${SITE_NAME}`,
  description: "Read our latest articles and updates.",
  alternates: {
    canonical: buildCanonicalUrl("/blog"),
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(
    locale === "en" ? "en-US" : "es-CO",
  );
}

export const revalidate = 300;

export default async function BlogListPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

  let posts: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    publishedAt?: string | null;
    readingTimeMinutes?: number | null;
    featuredImage?: { id: string; preview: string } | null;
    categories?: Array<{ id: string; name: string; slug: string }>;
    tags?: Array<{ id: string; name: string; slug: string }>;
  }> = [];

  try {
    const { data } = await query(GetBlogPostsQuery, {
      options: { take: 20 } as any,
      languageCode: locale === "en" ? "en" : "es",
    } as any);

    const response = data as unknown as {
      blogPosts?: { items?: typeof posts };
    } | null;

    posts = response?.blogPosts?.items ?? [];
  } catch (e) {
    console.error("Error fetching blog posts:", e);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground py-20">
          {t("noArticles")}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${locale}/blog/${post.slug}`}
            className="group block"
          >
            <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {post.featuredImage && (
                <div className="relative aspect-video">
                  <Image
                    src={post.featuredImage.preview}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div className="p-4">
                {post.categories && post.categories.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    {post.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt, locale)}
                    </time>
                  )}
                  {post.readingTimeMinutes && (
                    <span>
                      {t("minRead", { minutes: post.readingTimeMinutes })}
                    </span>
                  )}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
