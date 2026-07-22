import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { query } from '@/lib/vendure/server/api';
import { GetBlogPostBySlugQuery, GetBlogPostsQuery } from '@/lib/vendure/shared/blog';
import { SITE_NAME, buildCanonicalUrl, buildOgImages } from '@/lib/vendure/shared/metadata';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ locale: string; slug: string }>;
}

interface BlogPostData {
    id: string;
    slug: string;
    title: string;
    content: string;
    excerpt?: string | null;
    publishedAt?: string | null;
    readingTimeMinutes?: number | null;
    canonicalUrl?: string | null;
    structuredData?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    featuredImage?: { id: string; preview: string } | null;
    ogImage?: { id: string; preview: string } | null;
    author?: { id: string; firstName: string; lastName: string } | null;
    categories?: Array<{ id: string; name: string; slug: string }>;
    tags?: Array<{ id: string; name: string; slug: string }>;
    relatedPosts?: Array<{ id: string; slug: string; title: string; featuredImage?: { id: string; preview: string } | null }>;
    relatedProducts?: Array<{ id: string; name: string; slug: string; featuredAsset?: { id: string; preview: string } | null }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
    try {
        const { data } = await query(GetBlogPostsQuery, { options: { take: 50 } as any } as any);
        const slugs = (data as any)?.blogPosts?.items?.map((p: any) => p.slug as string) ?? [];
        return ['es', 'en'].flatMap(locale => slugs.map((slug: string) => ({ locale, slug })));
    } catch {
        return [];
    }
}

async function getBlogPost(slug: string, locale: string): Promise<BlogPostData | null> {
    try {
        const { data } = await query(GetBlogPostBySlugQuery, {
            slug,
            languageCode: locale === 'en' ? 'en' : 'es',
        });
        const response = data as unknown as { blogPost?: BlogPostData } | null;
        return response?.blogPost ?? null;
    } catch (e) {
        console.error('Error fetching blog post:', e);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = await getBlogPost(slug, locale);

    if (!post) return {};

    return {
        title: post.metaTitle || `${post.title} | Blog | ${SITE_NAME}`,
        description: post.metaDescription || post.excerpt || '',
        alternates: {
            canonical: post.canonicalUrl || buildCanonicalUrl(`/blog/${post.slug}`),
        },
        openGraph: post.ogImage
            ? { images: buildOgImages(post.ogImage.preview) }
            : undefined,
    };
}

function formatDate(dateStr: string, locale: string): string {
    return new Date(dateStr).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function generateStructuredData(post: BlogPostData, locale: string): string {
    if (post.structuredData) return post.structuredData;
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt || '',
        datePublished: post.publishedAt,
        image: post.featuredImage?.preview,
        author: post.author ? {
            '@type': 'Person',
            name: `${post.author.firstName} ${post.author.lastName}`,
        } : {
            '@type': 'Organization',
            name: SITE_NAME,
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': buildCanonicalUrl(`/blog/${post.slug}`),
        },
    });
}

export default async function BlogPostPage({ params }: PageProps) {
    const { locale, slug } = await params;
    const post = await getBlogPost(slug, locale);

    if (!post) notFound();

    const t = await getTranslations({ locale, namespace: 'Blog' });

    const structured = generateStructuredData(post, locale);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: structured }}
            />

            <article className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                <Link
                    href={`/${locale}/blog`}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 md:mb-8"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    {t('backToBlog')}
                </Link>

                <header className="mb-8 md:mb-12">
                    {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.categories.map(cat => (
                                <Link
                                    key={cat.id}
                                    href={`/${locale}/blog?category=${cat.slug}`}
                                    className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        {post.publishedAt && (
                            <time dateTime={post.publishedAt} className="flex items-center gap-1.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                    <line x1="16" x2="16" y1="2" y2="6" />
                                    <line x1="8" x2="8" y1="2" y2="6" />
                                    <line x1="3" x2="21" y1="10" y2="10" />
                                </svg>
                                {formatDate(post.publishedAt, locale)}
                            </time>
                        )}
                        {post.readingTimeMinutes && (
                            <span className="flex items-center gap-1.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                {t('minRead', { minutes: post.readingTimeMinutes })}
                            </span>
                        )}
                        {post.author && (
                            <span className="flex items-center gap-1.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                {t('by')} {post.author.firstName} {post.author.lastName}
                            </span>
                        )}
                    </div>
                </header>

                {post.featuredImage && (
                    <div className="relative aspect-[21/9] mb-8 md:mb-12 rounded-xl overflow-hidden">
                        <Image
                            src={post.featuredImage.preview}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {post.tags.map(tag => (
                            <span key={tag.id} className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}

                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {post.relatedPosts && post.relatedPosts.length > 0 && (
                    <section className="mt-16 md:mt-20 pt-8 md:pt-10 border-t">
                        <h2 className="text-2xl font-bold mb-6">{t('relatedPosts')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {post.relatedPosts.map(related => (
                                <Link
                                    key={related.id}
                                    href={`/${locale}/blog/${related.slug}`}
                                    className="group block border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                                >
                                    {related.featuredImage && (
                                        <div className="relative aspect-video">
                                            <Image
                                                src={related.featuredImage.preview}
                                                alt={related.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                                            {related.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {post.relatedProducts && post.relatedProducts.length > 0 && (
                    <section className="mt-16 md:mt-20 pt-8 md:pt-10 border-t">
                        <h2 className="text-2xl font-bold mb-6">{t('relatedProducts')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {post.relatedProducts.map(product => (
                                <Link
                                    key={product.id}
                                    href={`/${locale}/product/${product.slug}`}
                                    className="group block border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                                >
                                    {product.featuredAsset && (
                                        <div className="relative aspect-square">
                                            <Image
                                                src={product.featuredAsset.preview}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </>
    );
}
