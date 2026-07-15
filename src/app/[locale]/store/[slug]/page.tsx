import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Select } from '@heroui/react';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/commerce/product-card';
import { FeaturedProductsCarousel } from '@/components/commerce/featured-products-carousel';
import { readFragment } from '@/graphql';
import { ProductCardFragment } from '@/lib/vendure/shared/fragments';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/lib/vendure/shared/metadata';
import { isDisplayableImageUrl, normalizeVendureAssetUrl } from '@/lib/vendure/shared/asset-url';
import {
    channelCodeMatchesStoreSlug,
    getStoreCollections,
    getStoreFeaturedProducts,
    getStoreMetadata,
    getStoreProducts,
    getStoreProfile,
} from './actions';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const [result, profile] = await Promise.all([
        getStoreMetadata(slug, locale),
        getStoreProfile(slug, locale),
    ]);
    const channel = result.data.activeChannel;

    if (!channelCodeMatchesStoreSlug(slug, channel?.code) || !profile?.storeName?.trim()) {
        return {
            title: 'Tienda no encontrada',
        };
    }

    const title = profile.storeName;
    const description =
        truncateDescription(profile.storeDescription) || `Conoce la tienda ${title} en ${SITE_NAME}`;

    return {
        title,
        description,
        alternates: {
            canonical: buildCanonicalUrl(`/store/${slug}`),
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: buildCanonicalUrl(`/store/${slug}`),
            images: buildOgImages(profile.storeBannerUrl, title),
        },
    };
}

export default async function StorePage({ params, searchParams }: Props) {
    const { slug, locale } = await params;
    const resolvedSearchParams = await searchParams;
    const [metadataResult, allProducts, profile, featuredProducts, uniqueCollections] = await Promise.all([
        getStoreMetadata(slug, locale),
        getStoreProducts(slug, locale, resolvedSearchParams),
        getStoreProfile(slug, locale),
        getStoreFeaturedProducts(slug, locale),
        getStoreCollections(slug, locale),
    ]);

    const channel = metadataResult.data.activeChannel;

    if (!channelCodeMatchesStoreSlug(slug, channel?.code) || !profile?.storeName?.trim()) {
        notFound();
    }

    const storeName = profile.storeName;
    const storeDescription = profile.storeDescription || 'Sin descripcion de la tienda.';
    const storeBannerUrl = normalizeVendureAssetUrl(profile.storeBannerUrl);
    const storeBannerDisplayable = isDisplayableImageUrl(storeBannerUrl);
    const featuredSet = new Set(
        featuredProducts.map(p => readFragment(ProductCardFragment, p).productId),
    );
    const remainingProducts = allProducts.filter(
        product => !featuredSet.has(readFragment(ProductCardFragment, product).productId),
    );

    type CollectionRef = { id: string; name: string; slug: string };

    const activeCollectionSlug = typeof resolvedSearchParams.collection === 'string'
        ? resolvedSearchParams.collection
        : undefined;
    return (
        <main className="mt-16 space-y-10 pb-10">
            {/* Hero a ancho completo con fondo light/dark estilo home */}
            <section className="relative overflow-hidden">
                <Image
                    src="/bg-light.webp"
                    alt=""
                    aria-hidden
                    width={1600}
                    height={500}
                    className="absolute inset-0 h-full w-full object-cover block dark:hidden"
                />
                <Image
                    src="/bg-dark.webp"
                    alt=""
                    aria-hidden
                    width={1600}
                    height={500}
                    className="absolute inset-0 h-full w-full object-cover hidden dark:block"
                />
                <div className="absolute inset-0 backdrop-blur-2xl bg-[#f1f1f1]/40 dark:bg-[#12123f]/40 pointer-events-none" />

                <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
                    <Link
                        href={`/${locale}`}
                        className="flex items-center justify-center gap-2 text-foreground"
                    >
                        <Image
                            src="/logo-dark.webp"
                            alt="Ecommer"
                            width={60}
                            height={60}
                            className="h-8 sm:h-10 w-auto block dark:hidden"
                            priority
                        />
                        <Image
                            src="/logo-light.webp"
                            alt="Ecommer"
                            width={60}
                            height={60}
                            className="h-8 sm:h-10 w-auto hidden dark:block"
                            priority
                        />
                        <span className="text-xl sm:text-2xl font-semibold tracking-tight">
                            Ecommer
                        </span>
                    </Link>
                </div>
            </section>

            <div className="container mx-auto px-4 space-y-10">
                <section className="flex flex-col sm:flex-row sm:items-center gap-4">
                {storeBannerDisplayable && storeBannerUrl ? (
                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden ring-2 ring-[#6BB8FF]/40 shadow-md flex-shrink-0">
                        <Image
                            src={storeBannerUrl}
                            alt={storeName}
                            fill
                            className="object-cover"
                            sizes="112px"
                            unoptimized
                        />
                    </div>
                ) : null}
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                            {storeName}
                        </h1>
                        <div
                            className="text-muted-foreground prose prose-base sm:prose-lg max-w-2xl leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: storeDescription }}
                        />
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Productos destacados</h2>
                    {featuredProducts.length > 0 ? (
                        <FeaturedProductsCarousel products={featuredProducts} />
                    ) : (
                        <p className="text-muted-foreground">Esta tienda no tiene productos destacados por ahora.</p>
                    )}
                </section>

                <section>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h2 className="text-2xl font-semibold">Todos los productos</h2>
                        <div className="flex items-center gap-3">
                            <form action={`/${locale}/store/${slug}`} className="flex flex-wrap items-center gap-2">
                                {uniqueCollections.length > 0 && (
                                    <>
                                        <label htmlFor="collection-filter" className="text-sm text-muted-foreground whitespace-nowrap">
                                            Filtrar por:
                                        </label>
                                        <select
                                            id="collection-filter"
                                            name="collection"
                                            defaultValue={activeCollectionSlug ?? ''}
                                            className="text-sm rounded-lg border border-[#12123F]/15 dark:border-[#F1F1F1]/20 bg-background px-3 py-2 text-foreground"
                                        >
                                            <option value="">Todas las categorías</option>
                                            {uniqueCollections.map(c => (
                                                <option key={c.id} value={c.slug}>{c.name}</option>
                                            ))}
                                        </select>
                                    </>
                                )}
                                <label htmlFor="sort-filter" className="text-sm text-muted-foreground whitespace-nowrap">
                                    Ordenar por:
                                </label>
                                <select
                                    id="sort-filter"
                                    name="sort"
                                    defaultValue={typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'name-asc'}
                                    className="text-sm rounded-lg border border-[#12123F]/15 dark:border-[#F1F1F1]/20 bg-background px-3 py-2 text-foreground"
                                >
                                    <option value="name-asc">Nombre A-Z</option>
                                    <option value="name-desc">Nombre Z-A</option>
                                    <option value="price-asc">Precio: menor a mayor</option>
                                    <option value="price-desc">Precio: mayor a menor</option>
                                </select>
                                <button
                                    type="submit"
                                    className="text-sm rounded-lg bg-[#12123F] dark:bg-[#F1F1F1] text-white dark:text-[#12123F] px-4 py-2 font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Aplicar
                                </button>
                            </form>
                            <p className="text-sm text-muted-foreground whitespace-nowrap">{allProducts.length} productos</p>
                        </div>
                    </div>
                    {remainingProducts.length ? (
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                            {remainingProducts.map((product, index) => (
                                <ProductCard key={`store-product-${index}`} product={product} storeName={storeName} />
                            ))}
                        </div>
                    ) : featuredProducts.length === 0 ? (
                        <div className="rounded-md border p-6 text-sm text-muted-foreground">
                            Aun no hay productos publicados para esta tienda.
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No hay más productos en esta tienda.</p>
                    )}
                </section>

                <section>
                    <Link href={`/${locale}`} className="text-sm underline underline-offset-2">
                        Volver al inicio
                    </Link>
                </section>
            </div>
        </main>
    );
}
